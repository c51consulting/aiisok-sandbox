import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_details?.email;
        const tier = session.metadata?.tier || 'pro';
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (email) {
          await supabaseAdmin
            .from('subscriptions')
            .upsert(
              {
                email,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                tier,
                status: 'active',
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'email' }
            );
          console.log('Subscription upserted for', email, 'tier:', tier);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const subCustomerId = subscription.customer as string;
        const status = subscription.status === 'active' ? 'active' : 'inactive';

        await supabaseAdmin
          .from('subscriptions')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', subCustomerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subCustomerId = subscription.customer as string;

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'inactive', tier: 'free', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', subCustomerId);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
