import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/db';
import {
  constructStripeEvent,
  processStripeWebhookEvent,
  StripeWebhookConfigError,
  StripeWebhookSignatureError,
  StripeWebhookValidationError,
} from '@/lib/stripe/webhook';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    const event = constructStripeEvent(rawBody, signature);
    await ensureInitialized();
    const result = await processStripeWebhookEvent(event);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error instanceof StripeWebhookConfigError) {
      console.error('[Stripe Webhook Config Error]:', error.message);
      return NextResponse.json(
        { error: 'Webhook endpoint is not configured.' },
        { status: 500 }
      );
    }

    if (error instanceof StripeWebhookSignatureError) {
      console.error('[Stripe Webhook Signature Error]:', error.message);
      return NextResponse.json(
        { error: error.message || 'Invalid Stripe webhook signature' },
        { status: 400 }
      );
    }

    if (error instanceof StripeWebhookValidationError) {
      console.error('[Stripe Webhook Validation Error]:', error.message);
      return NextResponse.json(
        { error: error.message || 'Invalid Stripe webhook payload' },
        { status: 400 }
      );
    }

    console.error('[Stripe Webhook Processing Error]:', error?.message || error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
