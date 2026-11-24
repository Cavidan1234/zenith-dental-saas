import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { db, ensureInitialized } from '../src/lib/db';
import { bookings, webhookEvents } from '../src/lib/db/schema';
import { seed } from '../src/lib/db/seed';
import {
  stripe,
  constructStripeEvent,
  processStripeWebhookEvent,
  StripeWebhookConfigError,
  StripeWebhookSignatureError,
} from '../src/lib/stripe/webhook';
import { POST as stripeWebhookPost } from '../src/app/api/v1/webhooks/stripe/route';

async function postWebhookToRoute(
  payloadObject: Record<string, unknown>,
  secret: string
): Promise<Response> {
  const payloadJson = JSON.stringify(payloadObject);
  const sig = stripe.webhooks.generateTestHeaderString({
    payload: payloadJson,
    secret,
  });
  const req = new NextRequest('http://localhost:3000/api/v1/webhooks/stripe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': sig,
    },
    body: payloadJson,
  });
  return stripeWebhookPost(req);
}

async function runWebhookSecurityAndIdempotencyTests() {
  console.log('===============================================================');
  console.log('💳 TESTING STRIPE WEBHOOK ROUTE, SECURITY & STATE-MACHINE');
  console.log('===============================================================\n');

  const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const testSecret = 'whsec_test_zenith_dental_signing_secret_2026';

  try {
    await ensureInitialized();
    const seedResult = await seed();
    const tenant = seedResult.tenant;
    const doctor = seedResult.doctorLeyla;
    const service = seedResult.services[0];

    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const eventId = `evt_test_checkout_${uniqueSuffix}`;
    const paymentIntentId = `pi_test_checkout_${uniqueSuffix}`;

    const [testBooking] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Webhook Verification Patient',
        customerEmail: 'webhook.verify@example.com',
        startTime: new Date('2026-11-26T10:00:00.000Z'),
        endTime: new Date('2026-11-26T10:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
      })
      .returning();

    const payloadObject = {
      id: eventId,
      object: 'event',
      api_version: '2026-10-28.endive',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: {
          id: `cs_test_${uniqueSuffix}`,
          object: 'checkout.session',
          payment_status: 'paid',
          amount_total: service.depositCents,
          currency: 'gbp',
          payment_intent: paymentIntentId,
          metadata: {
            bookingId: testBooking.id,
          },
        },
      },
    };
    const payloadJson = JSON.stringify(payloadObject);

    // -------------------------------------------------------------------------
    // 1. Fail-closed when STRIPE_WEBHOOK_SECRET is missing/empty
    // -------------------------------------------------------------------------
    delete process.env.STRIPE_WEBHOOK_SECRET;

    assert.throws(
      () => constructStripeEvent(payloadJson, 't=12345,v1=deadbeef'),
      (err: unknown) => err instanceof StripeWebhookConfigError,
      'constructStripeEvent must throw StripeWebhookConfigError when STRIPE_WEBHOOK_SECRET is unset'
    );

    const missingSecretReq = new NextRequest('http://localhost:3000/api/v1/webhooks/stripe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 't=12345,v1=deadbeef',
      },
      body: payloadJson,
    });
    const missingSecretRes = await stripeWebhookPost(missingSecretReq);
    assert.equal(
      missingSecretRes.status,
      500,
      'POST /api/v1/webhooks/stripe must return HTTP 500 when STRIPE_WEBHOOK_SECRET is unset'
    );
    console.log('✅ [Test 1] Fail-closed with missing STRIPE_WEBHOOK_SECRET (Error + HTTP 500)');

    // -------------------------------------------------------------------------
    // 2. Reject invalid or missing Stripe-Signature with HTTP 400
    // -------------------------------------------------------------------------
    process.env.STRIPE_WEBHOOK_SECRET = testSecret;

    assert.throws(
      () => constructStripeEvent(payloadJson, ''),
      (err: unknown) => err instanceof StripeWebhookSignatureError,
      'constructStripeEvent must throw StripeWebhookSignatureError when signature is empty'
    );

    assert.throws(
      () => constructStripeEvent(payloadJson, 't=1700000000,v1=invalidsignaturehex'),
      (err: unknown) => err instanceof StripeWebhookSignatureError,
      'constructStripeEvent must throw StripeWebhookSignatureError on invalid signature'
    );

    const badSigReq = new NextRequest('http://localhost:3000/api/v1/webhooks/stripe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': 't=1700000000,v1=tampered',
      },
      body: payloadJson,
    });
    const badSigRes = await stripeWebhookPost(badSigReq);
    assert.equal(
      badSigRes.status,
      400,
      'POST /api/v1/webhooks/stripe must return HTTP 400 on invalid Stripe-Signature'
    );
    console.log('✅ [Test 2] Invalid/missing signature rejected (StripeWebhookSignatureError + HTTP 400)');

    // -------------------------------------------------------------------------
    // 3. Valid Stripe generateTestHeaderString signature succeeds
    // -------------------------------------------------------------------------
    const validSignature = stripe.webhooks.generateTestHeaderString({
      payload: payloadJson,
      secret: testSecret,
    });

    const verifiedEvent = constructStripeEvent(payloadJson, validSignature);
    assert.equal(verifiedEvent.id, eventId);
    assert.equal(verifiedEvent.type, 'checkout.session.completed');
    console.log('✅ [Test 3] Valid Stripe generateTestHeaderString signature verified');

    // -------------------------------------------------------------------------
    // 4. Route + DB-backed idempotency check (1st delivery confirms, 2nd is replay)
    // -------------------------------------------------------------------------
    const firstReq = new NextRequest('http://localhost:3000/api/v1/webhooks/stripe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': validSignature,
      },
      body: payloadJson,
    });
    const firstRes = await stripeWebhookPost(firstReq);
    assert.equal(firstRes.status, 200, 'Valid signed webhook must return HTTP 200');
    const firstBody = await firstRes.json();
    assert.equal(firstBody.received, true);
    assert.equal(firstBody.alreadyProcessed, false);
    assert.equal(firstBody.bookingId, testBooking.id);

    const updatedBooking = await db.query.bookings.findFirst({
      where: eq(bookings.id, testBooking.id),
    });
    assert.equal(updatedBooking?.status, 'confirmed');
    assert.equal(updatedBooking?.paymentStatus, 'deposit_paid');
    assert.equal(updatedBooking?.stripePaymentIntentId, paymentIntentId);

    const replayResult = await processStripeWebhookEvent(verifiedEvent);
    assert.equal(replayResult.received, true);
    assert.equal(replayResult.alreadyProcessed, true);

    const secondReq = new NextRequest('http://localhost:3000/api/v1/webhooks/stripe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': validSignature,
      },
      body: payloadJson,
    });
    const secondRes = await stripeWebhookPost(secondReq);
    assert.equal(secondRes.status, 200);
    const secondBody = await secondRes.json();
    assert.equal(secondBody.received, true);
    assert.equal(secondBody.alreadyProcessed, true);

    const recordedEvents = await db.query.webhookEvents.findMany({
      where: eq(webhookEvents.eventId, eventId),
    });
    assert.equal(
      recordedEvents.length,
      1,
      `Expected exactly 1 webhook_events row for ${eventId}, found ${recordedEvents.length}`
    );
    console.log('✅ [Test 4] DB-backed idempotency verified (1 row in webhook_events, replay ignored)');

    // -------------------------------------------------------------------------
    // 5. Route-level state-machine edge cases:
    //    - Missing booking returns 500 & rolls back webhook_events so retry works
    //    - Unpaid checkout.session.completed returns 200 & leaves pending
    //    - Late payment on cancelled booking returns 200 with requiresManualReview: true
    // -------------------------------------------------------------------------
    const earlyRes = await postWebhookToRoute(
      {
        id: `evt_route_early_${uniqueSuffix}`,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_nonexistent_${uniqueSuffix}`,
            object: 'payment_intent',
            amount_received: service.depositCents,
            currency: 'gbp',
          },
        },
      },
      testSecret
    );
    assert.equal(earlyRes.status, 500, 'Missing booking must return HTTP 500 so Stripe retries');
    const rolledBack = await db.query.webhookEvents.findMany({
      where: eq(webhookEvents.eventId, `evt_route_early_${uniqueSuffix}`),
    });
    assert.equal(rolledBack.length, 0, 'Rolled-back event must not remain in webhook_events');

    const [unpaidBooking] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Route Unpaid Patient',
        customerEmail: 'route.unpaid@example.com',
        startTime: new Date('2026-11-27T10:00:00.000Z'),
        endTime: new Date('2026-11-27T10:45:00.000Z'),
        status: 'pending',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
      })
      .returning();

    const unpaidRes = await postWebhookToRoute(
      {
        id: `evt_route_unpaid_${uniqueSuffix}`,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'checkout.session.completed',
        data: {
          object: {
            id: `cs_route_unpaid_${uniqueSuffix}`,
            object: 'checkout.session',
            payment_status: 'unpaid',
            metadata: { bookingId: unpaidBooking.id },
          },
        },
      },
      testSecret
    );
    assert.equal(unpaidRes.status, 200);
    const unpaidAfter = await db.query.bookings.findFirst({ where: eq(bookings.id, unpaidBooking.id) });
    assert.equal(unpaidAfter?.status, 'pending');

    const [cancelledBooking] = await db
      .insert(bookings)
      .values({
        tenantId: tenant.id,
        staffId: doctor.id,
        serviceId: service.id,
        customerName: 'Route Cancelled Patient',
        customerEmail: 'route.cancelled@example.com',
        startTime: new Date('2026-11-27T11:00:00.000Z'),
        endTime: new Date('2026-11-27T11:45:00.000Z'),
        status: 'cancelled',
        paymentStatus: 'unpaid',
        depositAmountCents: service.depositCents,
      })
      .returning();

    const cancelledLateRes = await postWebhookToRoute(
      {
        id: `evt_route_cancelled_late_${uniqueSuffix}`,
        object: 'event',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_route_cancelled_${uniqueSuffix}`,
            object: 'payment_intent',
            amount_received: service.depositCents,
            currency: 'gbp',
            metadata: { bookingId: cancelledBooking.id },
          },
        },
      },
      testSecret
    );
    assert.equal(cancelledLateRes.status, 200);
    const cancelledLateBody = await cancelledLateRes.json();
    assert.equal(cancelledLateBody.requiresManualReview, true);
    const cancelledAfter = await db.query.bookings.findFirst({ where: eq(bookings.id, cancelledBooking.id) });
    assert.equal(cancelledAfter?.status, 'cancelled');

    console.log('✅ [Test 5] Route-level state-machine edge cases passed');
    console.log('\n🎉 ALL STRIPE WEBHOOK SECURITY & DB IDEMPOTENCY TESTS PASSED!');
  } finally {
    if (originalSecret === undefined) {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    } else {
      process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
    }
  }
}

runWebhookSecurityAndIdempotencyTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Webhook test failed:', err);
    process.exit(1);
  });
