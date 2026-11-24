import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { db, ensureInitialized } from '../src/lib/db';
import { bookings, webhookEvents } from '../src/lib/db/schema';
import {
  stripe,
  constructStripeEvent,
  processStripeWebhookEvent,
  BookingNotFoundForWebhookError,
  StripeWebhookConfigError,
  StripeWebhookSignatureError,
  StripeWebhookValidationError,
} from '../src/lib/stripe/webhook';
import { seed } from '../src/lib/db/seed';
import Stripe from 'stripe';

function buildSignedEvent(
  eventPayload: Record<string, unknown>,
  secret: string
): Stripe.Event {
  const raw = JSON.stringify(eventPayload);
  const sig = stripe.webhooks.generateTestHeaderString({
    payload: raw,
    secret,
  });
  return constructStripeEvent(raw, sig, secret);
}

async function runStripeWebhookStateMachineTests() {
  console.log('===============================================================');
  console.log('💳 Stripe Webhook Signature, Idempotency & State-Machine Tests');
  console.log('===============================================================\n');

  const originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const originalStripeKey = process.env.STRIPE_SECRET_KEY;
  const originalNodeEnv = process.env.NODE_ENV;
  const testSecret = 'whsec_test_stripe_idempotency_2026';

  try {
    await ensureInitialized();
    const seedResult = await seed();
    const tenant = seedResult.tenant;
    const doctor = seedResult.doctorLeyla;
    const service = seedResult.services[0]; // depositCents: 2500, currency: USD

    process.env.STRIPE_WEBHOOK_SECRET = testSecret;
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // -------------------------------------------------------------------------
    // Baseline: Fail-closed signature & production key checks + PII minimization
    // -------------------------------------------------------------------------
    const [baselineBooking] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Stripe Baseline Patient',
        customerEmail: 'baseline.secret.pii@example.com',
        customerPhone: '+994501112233',
        startTime: new Date('2026-11-25T11:00:00.000Z'),
        endTime: new Date('2026-11-25T11:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        stripePaymentIntentId: `pi_base_${suffix}`,
      })
      .returning();

    const basePayloadObj = {
      id: `evt_base_${suffix}`,
      object: 'event',
      api_version: '2026-10-28.endive',
      created: Math.floor(Date.now() / 1000),
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: `pi_base_${suffix}`,
          object: 'payment_intent',
          amount_received: service.depositCents,
          currency: 'gbp',
          receipt_email: 'baseline.secret.pii@example.com',
          metadata: { bookingId: baselineBooking.id },
        },
      },
    };
    const basePayloadStr = JSON.stringify(basePayloadObj);

    // Production fail-closed when STRIPE_SECRET_KEY is missing
    delete process.env.STRIPE_SECRET_KEY;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    assert.throws(
      () => constructStripeEvent(basePayloadStr, 't=123,v1=invalid', testSecret),
      (err: unknown) => err instanceof StripeWebhookConfigError,
      'Must fail closed in production when STRIPE_SECRET_KEY is missing'
    );
    (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;

    delete process.env.STRIPE_WEBHOOK_SECRET;
    assert.throws(
      () => constructStripeEvent(basePayloadStr, 't=123,v1=invalid'),
      (err: unknown) => err instanceof StripeWebhookConfigError
    );

    process.env.STRIPE_WEBHOOK_SECRET = testSecret;
    assert.throws(
      () => constructStripeEvent(basePayloadStr, 't=123,v1=invalid'),
      (err: unknown) => err instanceof StripeWebhookSignatureError
    );

    const verifiedBaseEvent = buildSignedEvent(basePayloadObj, testSecret);
    const resBase1 = await processStripeWebhookEvent(verifiedBaseEvent);
    assert.equal(resBase1.received, true);
    assert.equal(resBase1.alreadyProcessed, false);

    const resBase2 = await processStripeWebhookEvent(verifiedBaseEvent);
    assert.equal(resBase2.alreadyProcessed, true);

    const storedBaseRows = await db.query.webhookEvents.findMany({
      where: eq(webhookEvents.eventId, basePayloadObj.id),
    });
    assert.equal(storedBaseRows.length, 1);
    const serializedStoredPayload = JSON.stringify(storedBaseRows[0].payload);
    assert.equal(
      serializedStoredPayload.includes('baseline.secret.pii@example.com'),
      false,
      'webhook_events.payload must minimize PII and exclude customer email'
    );
    console.log('✅ [Baseline] Fail-closed secrets, signature verification, idempotency, and PII minimization passed');

    // -------------------------------------------------------------------------
    // Scenario (a): payment_intent.payment_failed -> then payment_intent.succeeded
    // Expected: failed attempt leaves booking pending/unpaid for retry; success confirms it
    // -------------------------------------------------------------------------
    const [bookingA] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Scenario A Patient',
        customerEmail: 'scenario.a@example.com',
        startTime: new Date('2026-11-26T09:00:00.000Z'),
        endTime: new Date('2026-11-26T09:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        stripePaymentIntentId: `pi_a_${suffix}`,
      })
      .returning();

    const failEventA = buildSignedEvent(
      {
        id: `evt_a_fail_${suffix}`,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: `pi_a_${suffix}`,
            object: 'payment_intent',
            metadata: { bookingId: bookingA.id },
          },
        },
      },
      testSecret
    );
    await processStripeWebhookEvent(failEventA);

    const afterFailA = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingA.id) });
    assert.equal(afterFailA?.status, 'pending', 'Failed payment must keep slot pending for card retry');
    assert.equal(afterFailA?.paymentStatus, 'unpaid');

    const succeedEventA = buildSignedEvent(
      {
        id: `evt_a_ok_${suffix}`,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_a_${suffix}`,
            object: 'payment_intent',
            amount_received: service.depositCents,
            currency: 'gbp',
            metadata: { bookingId: bookingA.id },
          },
        },
      },
      testSecret
    );
    await processStripeWebhookEvent(succeedEventA);

    const afterSuccessA = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingA.id) });
    assert.equal(afterSuccessA?.status, 'confirmed');
    assert.equal(afterSuccessA?.paymentStatus, 'deposit_paid');
    console.log('✅ [Scenario a] payment_intent.payment_failed -> payment_intent.succeeded passed');

    // -------------------------------------------------------------------------
    // Scenario (b): payment_intent.succeeded -> late payment_intent.payment_failed
    // Expected: late failed event NEVER cancels or downgrades confirmed/deposit_paid
    // -------------------------------------------------------------------------
    const [bookingB] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Scenario B Patient',
        customerEmail: 'scenario.b@example.com',
        startTime: new Date('2026-11-26T10:00:00.000Z'),
        endTime: new Date('2026-11-26T10:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        stripePaymentIntentId: `pi_b_${suffix}`,
      })
      .returning();

    await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_b_ok_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: `pi_b_${suffix}`,
              object: 'payment_intent',
              amount_received: service.depositCents,
              currency: 'gbp',
              metadata: { bookingId: bookingB.id },
            },
          },
        },
        testSecret
      )
    );

    await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_b_late_fail_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'payment_intent.payment_failed',
          data: {
            object: {
              id: `pi_b_${suffix}`,
              object: 'payment_intent',
              metadata: { bookingId: bookingB.id },
            },
          },
        },
        testSecret
      )
    );

    const afterLateFailB = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingB.id) });
    assert.equal(afterLateFailB?.status, 'confirmed', 'Late payment_failed must never cancel confirmed booking');
    assert.equal(afterLateFailB?.paymentStatus, 'deposit_paid', 'Late payment_failed must never downgrade deposit_paid');
    console.log('✅ [Scenario b] payment_intent.succeeded -> late payment_intent.payment_failed passed');

    // -------------------------------------------------------------------------
    // Scenario (c): checkout.session.completed with payment_status: 'unpaid'
    // Expected: booking remains pending/unpaid (does NOT confirm)
    // -------------------------------------------------------------------------
    const [bookingC] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Scenario C Patient',
        customerEmail: 'scenario.c@example.com',
        startTime: new Date('2026-11-26T11:00:00.000Z'),
        endTime: new Date('2026-11-26T11:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
      })
      .returning();

    await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_c_unpaid_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'checkout.session.completed',
          data: {
            object: {
              id: `cs_c_${suffix}`,
              object: 'checkout.session',
              payment_status: 'unpaid',
              amount_total: service.depositCents,
              currency: 'gbp',
              payment_intent: `pi_c_${suffix}`,
              metadata: { bookingId: bookingC.id },
            },
          },
        },
        testSecret
      )
    );

    const afterUnpaidC = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingC.id) });
    assert.equal(afterUnpaidC?.status, 'pending', 'Unpaid checkout session must NOT confirm booking');
    assert.equal(afterUnpaidC?.paymentStatus, 'unpaid');

    // Also verify tampered amount is rejected
    await assert.rejects(
      () =>
        processStripeWebhookEvent(
          buildSignedEvent(
            {
              id: `evt_c_bad_amt_${suffix}`,
              object: 'event',
              created: Math.floor(Date.now() / 1000),
              type: 'checkout.session.completed',
              data: {
                object: {
                  id: `cs_c_bad_${suffix}`,
                  object: 'checkout.session',
                  payment_status: 'paid',
                  amount_total: 100,
                  currency: 'gbp',
                  payment_intent: `pi_c_${suffix}`,
                  metadata: { bookingId: bookingC.id },
                },
              },
            },
            testSecret
          )
        ),
      (err: unknown) => err instanceof StripeWebhookValidationError
    );
    console.log('✅ [Scenario c] checkout.session.completed (unpaid & amount validation) passed');

    // -------------------------------------------------------------------------
    // Scenario (d): Event arriving before booking/PI exists
    // Expected: throws BookingNotFoundForWebhookError & rolls back webhook_events so retry succeeds
    // -------------------------------------------------------------------------
    const earlyPiId = `pi_early_${suffix}`;
    const earlyEventId = `evt_d_early_${suffix}`;
    const earlyEvent = buildSignedEvent(
      {
        id: earlyEventId,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: earlyPiId,
            object: 'payment_intent',
            amount_received: service.depositCents,
            currency: 'gbp',
          },
        },
      },
      testSecret
    );

    await assert.rejects(
      () => processStripeWebhookEvent(earlyEvent),
      (err: unknown) => err instanceof BookingNotFoundForWebhookError,
      'Missing booking/PI must throw so transaction rolls back for Stripe retry'
    );

    const rolledBackEvents = await db.query.webhookEvents.findMany({
      where: eq(webhookEvents.eventId, earlyEventId),
    });
    assert.equal(rolledBackEvents.length, 0, 'webhook_events insert must roll back on missing booking');

    // Now create booking with that PI and retry the exact same event
    const [bookingD] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Scenario D Patient',
        customerEmail: 'scenario.d@example.com',
        startTime: new Date('2026-12-27T12:00:00.000Z'),
        endTime: new Date('2026-12-27T12:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        stripePaymentIntentId: earlyPiId,
      })
      .returning();

    const retryResultD = await processStripeWebhookEvent(earlyEvent);
    assert.equal(retryResultD.alreadyProcessed, false);
    assert.equal(retryResultD.bookingId, bookingD.id);
    const confirmedD = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingD.id) });
    assert.equal(confirmedD?.status, 'confirmed');
    assert.equal(confirmedD?.paymentStatus, 'deposit_paid');
    console.log('✅ [Scenario d] Missing booking rollback + retry confirmation passed');

    // -------------------------------------------------------------------------
    // Scenario (e): Concurrent duplicate event.id via Promise.all
    // Expected: only 1 processes, others return alreadyProcessed: true
    // -------------------------------------------------------------------------
    const [bookingE] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Scenario E Patient',
        customerEmail: 'scenario.e@example.com',
        startTime: new Date('2026-11-26T14:00:00.000Z'),
        endTime: new Date('2026-11-26T14:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        stripePaymentIntentId: `pi_e_${suffix}`,
      })
      .returning();

    const concurrentEventId = `evt_e_race_${suffix}`;
    const concurrentEvent = buildSignedEvent(
      {
        id: concurrentEventId,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_e_${suffix}`,
            object: 'payment_intent',
            amount_received: service.depositCents,
            currency: 'gbp',
            metadata: { bookingId: bookingE.id },
          },
        },
      },
      testSecret
    );

    const concurrentResults = await Promise.all(
      Array.from({ length: 5 }, () => processStripeWebhookEvent(concurrentEvent))
    );
    const freshCount = concurrentResults.filter((r) => r.alreadyProcessed === false).length;
    const dupCount = concurrentResults.filter((r) => r.alreadyProcessed === true).length;
    assert.equal(freshCount, 1, `Expected exactly 1 fresh processing, got ${freshCount}`);
    assert.equal(dupCount, 4, `Expected 4 duplicate interceptions, got ${dupCount}`);

    const concurrentRows = await db.query.webhookEvents.findMany({
      where: eq(webhookEvents.eventId, concurrentEventId),
    });
    assert.equal(concurrentRows.length, 1);
    console.log('✅ [Scenario e] Concurrent duplicate event.id race passed (1 processed, 4 deduplicated)');

    // -------------------------------------------------------------------------
    // Scenario (f): payment_intent.succeeded on already-cancelled booking
    // Expected: MUST NOT confirm; flags [REFUND_REQUIRED / LATE_PAYMENT_ON_CANCELLED] & requiresManualReview
    // -------------------------------------------------------------------------
    const [bookingF] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Scenario F Patient',
        customerEmail: 'scenario.f@example.com',
        startTime: new Date('2026-11-26T15:00:00.000Z'),
        endTime: new Date('2026-11-26T15:45:00.000Z'),
        status: 'cancelled',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        stripePaymentIntentId: `pi_f_${suffix}`,
      })
      .returning();

    const resultF = await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_f_late_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: `pi_f_${suffix}`,
              object: 'payment_intent',
              amount_received: service.depositCents,
              currency: 'gbp',
              metadata: { bookingId: bookingF.id },
            },
          },
        },
        testSecret
      )
    );

    assert.equal(resultF.requiresManualReview, true);
    const afterLateF = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingF.id) });
    assert.equal(afterLateF?.status, 'cancelled', 'Late payment on cancelled booking MUST NOT confirm');
    assert.ok(
      afterLateF?.internalNotes?.includes('[REFUND_REQUIRED / LATE_PAYMENT_ON_CANCELLED]'),
      'Must record [REFUND_REQUIRED / LATE_PAYMENT_ON_CANCELLED] in internalNotes'
    );
    console.log('✅ [Scenario f] Late payment_intent.succeeded on cancelled booking stayed cancelled & flagged review');

    // -------------------------------------------------------------------------
    // Bonus: checkout.session.expired & charge.refunded guards
    // -------------------------------------------------------------------------
    await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_expire_c_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'checkout.session.expired',
          data: {
            object: {
              id: `cs_c_${suffix}`,
              object: 'checkout.session',
              metadata: { bookingId: bookingC.id },
            },
          },
        },
        testSecret
      )
    );
    const expiredC = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingC.id) });
    assert.equal(expiredC?.status, 'cancelled', 'checkout.session.expired cancels pending unpaid booking');

    // Partial refund (refunded: false) must NOT set paymentStatus: 'refunded'
    await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_partial_refund_b_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'charge.refunded',
          data: {
            object: {
              id: `ch_b_part_${suffix}`,
              object: 'charge',
              refunded: false,
              payment_intent: `pi_b_${suffix}`,
            },
          },
        },
        testSecret
      )
    );
    const afterPartialB = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingB.id) });
    assert.equal(afterPartialB?.paymentStatus, 'deposit_paid', 'Partial refund must not mark refunded');

    // Full refund (refunded: true) sets paymentStatus: 'refunded'
    await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_full_refund_b_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'charge.refunded',
          data: {
            object: {
              id: `ch_b_full_${suffix}`,
              object: 'charge',
              refunded: true,
              payment_intent: `pi_b_${suffix}`,
            },
          },
        },
        testSecret
      )
    );
    const afterFullB = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingB.id) });
    assert.equal(afterFullB?.paymentStatus, 'refunded', 'Full refund must set paymentStatus to refunded');

    console.log('✅ [Guards] checkout.session.expired & charge.refunded (partial vs full) passed');

    // Scenario g: Late payment on an expired pending hold whose slot was taken by another patient
    const [expiredHoldA] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        bookingCode: `ZD-EXPA-${suffix.slice(-4).toUpperCase()}`,
        customerName: 'Patient A (Expired Hold)',
        customerEmail: 'patient.a.expired@example.com',
        startTime: new Date('2026-12-23T10:00:00.000Z'),
        endTime: new Date('2026-12-23T10:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      })
      .returning();

    const [winnerB] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        bookingCode: `ZD-WINB-${suffix.slice(-4).toUpperCase()}`,
        customerName: 'Patient B (Claimed Slot)',
        customerEmail: 'patient.b.winner@example.com',
        startTime: new Date('2026-12-23T10:00:00.000Z'),
        endTime: new Date('2026-12-23T10:45:00.000Z'),
        status: 'confirmed',
        paymentStatus: 'deposit_paid',
        depositAmountCents: service.depositCents,
      })
      .returning();

    const lateExpiredRes = await processStripeWebhookEvent(
      buildSignedEvent(
        {
          id: `evt_late_expired_${suffix}`,
          object: 'event',
          created: Math.floor(Date.now() / 1000),
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: `pi_late_expired_${suffix}`,
              object: 'payment_intent',
              amount: service.depositCents,
              amount_received: service.depositCents,
              currency: 'gbp',
              metadata: { bookingId: expiredHoldA.id },
            },
          },
        },
        testSecret
      )
    );
    assert.equal(lateExpiredRes.requiresManualReview, true);
    const afterExpiredA = await db.query.bookings.findFirst({ where: eq(bookings.id, expiredHoldA.id) });
    const afterWinnerB = await db.query.bookings.findFirst({ where: eq(bookings.id, winnerB.id) });
    assert.equal(afterExpiredA?.status, 'cancelled', 'Expired hold whose slot was taken must be cancelled, not double-confirmed');
    assert.ok(afterExpiredA?.internalNotes?.includes('[REFUND_REQUIRED / EXPIRED_HOLD_SLOT_TAKEN]'));
    assert.equal(afterWinnerB?.status, 'confirmed', 'Active slot holder must remain confirmed');
    console.log('✅ [Scenario g] Late payment on expired pending hold with taken slot safely cancelled & flagged for refund');
    console.log('\n===============================================================');
    console.log('🎉 ALL STRIPE WEBHOOK STATE-MACHINE TESTS PASSED PERFECTLY!');
    console.log('===============================================================');
  } finally {
    if (originalWebhookSecret === undefined) {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    } else {
      process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;
    }
    if (originalStripeKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY;
    } else {
      process.env.STRIPE_SECRET_KEY = originalStripeKey;
    }
    (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
  }
}

runStripeWebhookStateMachineTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Stripe webhook state-machine test failed:', err);
    process.exit(1);
  });
