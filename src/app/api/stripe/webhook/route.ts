import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        console.log('checkout.session.completed', {
          customerId: session.customer,
          subscriptionId: session.subscription,
          email: session.customer_details?.email,
          tier: session.metadata?.tier,
        });
        // TODO: Replace with Supabase upsert
        // await upsertCustomer({
        //   email: session.customer_details?.email!,
        //   stripeCustomerId: session.customer as string,
        //   subscriptionId: session.subscription as string,
        //   tier: session.metadata?.tier as Tier,
        //   status: 'active',
        // });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('subscription created/updated', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
        });
        // TODO: Replace with Supabase update
        // await updateSubscriptionStatus({
        //   subscriptionId: subscription.id,
        //   status: subscription.status,
        // });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('subscription cancelled', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });
        // TODO: Replace with Supabase update
        // await updateSubscriptionStatus({
        //   subscriptionId: subscription.id,
        //   status: 'canceled',
        // });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
