import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      email: session.customer_details?.email || null,
      tier: session.metadata?.tier || 'pro',
      status: session.status,
    });
  } catch (err) {
    console.error('Failed to retrieve session:', err);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
