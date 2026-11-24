import Stripe from 'stripe';
import { and, eq } from 'drizzle-orm';
import { db as defaultDb } from '../db';
import { bookings, webhookEvents } from '../db/schema';

const DEV_PLACEHOLDER_STRIPE_KEY = 'sk_test_placeholder_key';
const STRIPE_API_VERSION = '2026-10-28.endive' as const;
const LATE_PAYMENT_REFUND_NOTE = '[REFUND_REQUIRED / LATE_PAYMENT_ON_CANCELLED]';

export class StripeWebhookConfigError extends Error {
  constructor(message = 'STRIPE_WEBHOOK_SECRET is not configured.') {
    super(message);
    this.name = 'StripeWebhookConfigError';
  }
}

export class StripeWebhookSignatureError extends Error {
  constructor(message = 'Stripe webhook signature verification failed.') {
    super(message);
    this.name = 'StripeWebhookSignatureError';
  }
}

export class StripeWebhookValidationError extends Error {
  constructor(message = 'Stripe webhook payload failed validation.') {
    super(message);
    this.name = 'StripeWebhookValidationError';
  }
}

export class BookingNotFoundForWebhookError extends Error {
  constructor(message = 'Matching booking not found for Stripe webhook event.') {
    super(message);
    this.name = 'BookingNotFoundForWebhookError';
  }
}

let cachedStripeClient: Stripe | null = null;
let cachedStripeKey: string | null = null;

function resolveStripeSecretKey(): string {
  const envKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (envKey) {
    return envKey;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new StripeWebhookConfigError(
      'STRIPE_SECRET_KEY is not configured in production; failing closed.'
    );
  }

  return DEV_PLACEHOLDER_STRIPE_KEY;
}

function isLiveStripeConfigured(): boolean {
  const envKey = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(envKey && envKey !== DEV_PLACEHOLDER_STRIPE_KEY);
}

/**
 * Lazily resolves the Stripe SDK client so build-time imports do not crash while
 * runtime production calls fail closed if STRIPE_SECRET_KEY is missing.
 */
export function getStripeClient(): Stripe {
  const secretKey = resolveStripeSecretKey();
  if (!cachedStripeClient || cachedStripeKey !== secretKey) {
    cachedStripeClient = new Stripe(secretKey, {
      apiVersion: STRIPE_API_VERSION,
      typescript: true,
    });
    cachedStripeKey = secretKey;
  }
  return cachedStripeClient;
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripeClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export interface WebhookProcessingResult {
  received: boolean;
  alreadyProcessed?: boolean;
  success?: boolean;
  eventType?: string;
  bookingId?: string;
  requiresManualReview?: boolean;
  error?: string;
}

/**
 * Extracts only non-PII audit summary fields from a Stripe event for persistence in webhook_events.
 */
function buildSafeWebhookAuditPayload(event: Stripe.Event): Record<string, unknown> {
  const obj = (event.data?.object ?? {}) as unknown as Record<string, unknown>;
  const metadata = (obj.metadata ?? {}) as Record<string, unknown>;
  const rawPaymentIntent = obj.payment_intent as string | { id?: string } | null | undefined;
  const paymentIntentId =
    typeof rawPaymentIntent === 'string'
      ? rawPaymentIntent
      : rawPaymentIntent && typeof rawPaymentIntent === 'object'
      ? rawPaymentIntent.id ?? null
      : null;

  return {
    id: event.id,
    type: event.type,
    api_version: event.api_version ?? null,
    created: event.created,
    livemode: event.livemode,
    objectSummary: {
      id: typeof obj.id === 'string' ? obj.id : null,
      object: typeof obj.object === 'string' ? obj.object : null,
      status: typeof obj.status === 'string' ? obj.status : null,
      payment_status: typeof obj.payment_status === 'string' ? obj.payment_status : null,
      amount_total: typeof obj.amount_total === 'number' ? obj.amount_total : null,
      amount_received: typeof obj.amount_received === 'number' ? obj.amount_received : null,
      amount: typeof obj.amount === 'number' ? obj.amount : null,
      amount_refunded: typeof obj.amount_refunded === 'number' ? obj.amount_refunded : null,
      refunded: typeof obj.refunded === 'boolean' ? obj.refunded : null,
      currency: typeof obj.currency === 'string' ? obj.currency : null,
      bookingId: typeof metadata.bookingId === 'string' ? metadata.bookingId : null,
      payment_intent: paymentIntentId,
    },
  };
}

function appendInternalNote(existingNotes: string | null | undefined, noteToAdd: string): string {
  const trimmed = existingNotes?.trim() || '';
  if (!trimmed) {
    return noteToAdd;
  }
  if (trimmed.includes(noteToAdd)) {
    return trimmed;
  }
  return `${trimmed}\n${noteToAdd}`;
}

/**
 * Verifies Stripe Webhook signature and returns the parsed Stripe event.
 * Fails closed whenever STRIPE_WEBHOOK_SECRET is missing or signature verification fails.
 */
export function constructStripeEvent(
  payload: string | Buffer,
  signature: string,
  secret?: string
): Stripe.Event {
  const resolvedSecret = (
    secret !== undefined ? secret : process.env.STRIPE_WEBHOOK_SECRET || ''
  ).trim();

  if (!resolvedSecret) {
    throw new StripeWebhookConfigError(
      'STRIPE_WEBHOOK_SECRET is not configured; refusing unverified webhook payload.'
    );
  }

  if (!signature || typeof signature !== 'string') {
    throw new StripeWebhookSignatureError('Missing Stripe-Signature header.');
  }

  const client = getStripeClient();

  try {
    return client.webhooks.constructEvent(payload, signature, resolvedSecret);
  } catch (err: any) {
    throw new StripeWebhookSignatureError(
      err?.message || 'Stripe webhook signature verification failed.'
    );
  }
}

interface ConfirmBookingParams {
  tx: any;
  eventType: string;
  bookingId?: string;
  paymentIntentId?: string;
  paidAmountCents?: number;
  currency?: string;
}

async function confirmPendingBooking(params: ConfirmBookingParams): Promise<WebhookProcessingResult> {
  const { tx, eventType, bookingId, paymentIntentId, paidAmountCents, currency } = params;

  if (!bookingId && !paymentIntentId) {
    throw new BookingNotFoundForWebhookError(
      `Stripe ${eventType} event is missing both metadata.bookingId and payment_intent.`
    );
  }

  const existingBooking = await tx.query.bookings.findFirst({
    where: bookingId
      ? eq(bookings.id, bookingId)
      : eq(bookings.stripePaymentIntentId, paymentIntentId!),
    with: {
      service: true,
      tenant: true,
    },
  });

  if (!existingBooking) {
    throw new BookingNotFoundForWebhookError(
      `Booking not found for ${eventType} (bookingId=${bookingId || 'n/a'}, pi=${paymentIntentId || 'n/a'}).`
    );
  }

  const expectedDepositCents =
    typeof existingBooking.depositAmountCents === 'number' && existingBooking.depositAmountCents > 0
      ? existingBooking.depositAmountCents
      : existingBooking.service?.depositCents ?? 0;

  if (
    typeof paidAmountCents === 'number' &&
    expectedDepositCents > 0 &&
    paidAmountCents !== expectedDepositCents
  ) {
    throw new StripeWebhookValidationError(
      `Payment amount mismatch for booking ${existingBooking.id}: expected ${expectedDepositCents} cents, received ${paidAmountCents} cents.`
    );
  }

  if (typeof currency === 'string' && currency.trim() && existingBooking.tenant?.currency) {
    const expectedCurrency = existingBooking.tenant.currency.trim().toLowerCase();
    const receivedCurrency = currency.trim().toLowerCase();
    if (receivedCurrency !== expectedCurrency) {
      throw new StripeWebhookValidationError(
        `Currency mismatch for booking ${existingBooking.id}: expected ${expectedCurrency}, received ${receivedCurrency}.`
      );
    }
  }

  const updatedRows = await tx
    .update(bookings)
    .set({
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
      ...(expectedDepositCents > 0 && { depositAmountCents: expectedDepositCents }),
    })
    .where(and(eq(bookings.id, existingBooking.id), eq(bookings.status, 'pending')))
    .returning();

  if (updatedRows.length > 0) {
    return {
      received: true,
      alreadyProcessed: false,
      success: true,
      eventType,
      bookingId: updatedRows[0].id,
    };
  }

  // 0 rows updated because booking is no longer pending; inspect authoritative state.
  if (
    existingBooking.status === 'confirmed' &&
    (existingBooking.paymentStatus === 'deposit_paid' ||
      existingBooking.paymentStatus === 'fully_paid')
  ) {
    return {
      received: true,
      alreadyProcessed: false,
      success: true,
      eventType,
      bookingId: existingBooking.id,
    };
  }

  if (existingBooking.status === 'cancelled') {
    let requiresManualReview = true;
    let nextPaymentStatus = existingBooking.paymentStatus;
    let updatedNotes = appendInternalNote(existingBooking.internalNotes, LATE_PAYMENT_REFUND_NOTE);

    if (isLiveStripeConfigured() && paymentIntentId) {
      try {
        const refund = await getStripeClient().refunds.create({
          payment_intent: paymentIntentId,
        });
        nextPaymentStatus = 'refunded';
        requiresManualReview = false;
        updatedNotes = appendInternalNote(updatedNotes, `[AUTO_REFUNDED:${refund.id}]`);
      } catch (refundErr: any) {
        updatedNotes = appendInternalNote(
          updatedNotes,
          `[AUTO_REFUND_FAILED:${refundErr?.message || 'unknown'}]`
        );
      }
    }

    await tx
      .update(bookings)
      .set({
        internalNotes: updatedNotes,
        paymentStatus: nextPaymentStatus,
      })
      .where(eq(bookings.id, existingBooking.id));

    return {
      received: true,
      alreadyProcessed: false,
      success: true,
      eventType,
      bookingId: existingBooking.id,
      requiresManualReview,
    };
  }

  return {
    received: true,
    alreadyProcessed: false,
    success: true,
    eventType,
    bookingId: existingBooking.id,
    requiresManualReview: true,
  };
}

/**
 * Processes a Stripe Webhook Event with atomic database-level idempotency
 * and strict booking payment state-machine transitions.
 */
export async function processStripeWebhookEvent(
  event: Stripe.Event,
  db = defaultDb
): Promise<WebhookProcessingResult> {
  const eventId = event.id;
  const eventType = event.type;

  return await db.transaction(async (tx: any) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({
        eventId,
        eventType,
        processedAt: new Date(),
        payload: buildSafeWebhookAuditPayload(event),
      })
      .onConflictDoNothing({ target: webhookEvents.eventId })
      .returning({ id: webhookEvents.id });

    if (inserted.length === 0) {
      return {
        received: true,
        alreadyProcessed: true,
        eventType,
      };
    }

    switch (eventType) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        if (session.payment_status !== 'paid') {
          return {
            received: true,
            alreadyProcessed: false,
            success: true,
            eventType,
            ...(bookingId && { bookingId }),
          };
        }

        return await confirmPendingBooking({
          tx,
          eventType,
          bookingId,
          paymentIntentId,
          paidAmountCents:
            typeof session.amount_total === 'number' ? session.amount_total : undefined,
          currency: typeof session.currency === 'string' ? session.currency : undefined,
        });
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;
        const paymentIntentId = paymentIntent.id;
        const paidAmountCents =
          typeof paymentIntent.amount_received === 'number'
            ? paymentIntent.amount_received
            : typeof paymentIntent.amount === 'number'
            ? paymentIntent.amount
            : undefined;

        return await confirmPendingBooking({
          tx,
          eventType,
          bookingId,
          paymentIntentId,
          paidAmountCents,
          currency: typeof paymentIntent.currency === 'string' ? paymentIntent.currency : undefined,
        });
      }

      case 'payment_intent.payment_failed': {
        // Never cancel pending bookings (customer may retry) and never downgrade confirmed/paid bookings.
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;
        const paymentIntentId = paymentIntent.id;

        const existingBooking =
          bookingId || paymentIntentId
            ? await tx.query.bookings.findFirst({
                where: bookingId
                  ? eq(bookings.id, bookingId)
                  : eq(bookings.stripePaymentIntentId, paymentIntentId),
              })
            : null;

        return {
          received: true,
          alreadyProcessed: false,
          success: true,
          eventType,
          ...(existingBooking?.id ? { bookingId: existingBooking.id } : bookingId ? { bookingId } : {}),
        };
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        const matchCond = bookingId
          ? eq(bookings.id, bookingId)
          : paymentIntentId
          ? eq(bookings.stripePaymentIntentId, paymentIntentId)
          : null;

        let affectedBookingId: string | undefined;
        if (matchCond) {
          const cancelledRows = await tx
            .update(bookings)
            .set({ status: 'cancelled' })
            .where(
              and(
                matchCond,
                eq(bookings.status, 'pending'),
                eq(bookings.paymentStatus, 'unpaid')
              )
            )
            .returning({ id: bookings.id });

          if (cancelledRows.length > 0) {
            affectedBookingId = cancelledRows[0].id;
          }
        }

        return {
          received: true,
          alreadyProcessed: false,
          success: true,
          eventType,
          ...(affectedBookingId && { bookingId: affectedBookingId }),
        };
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id;

        let affectedBookingId: string | undefined;
        if (charge.refunded === true && paymentIntentId) {
          const refundedRows = await tx
            .update(bookings)
            .set({ paymentStatus: 'refunded' })
            .where(eq(bookings.stripePaymentIntentId, paymentIntentId))
            .returning({ id: bookings.id });

          if (refundedRows.length > 0) {
            affectedBookingId = refundedRows[0].id;
          }
        }

        return {
          received: true,
          alreadyProcessed: false,
          success: true,
          eventType,
          ...(affectedBookingId && { bookingId: affectedBookingId }),
        };
      }

      default:
        return {
          received: true,
          alreadyProcessed: false,
          success: true,
          eventType,
        };
    }
  });
}
