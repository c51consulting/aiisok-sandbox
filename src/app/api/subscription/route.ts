import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ tier: 'free', status: 'inactive' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('tier, status')
      .eq('email', email)
      .single();

    if (error || !data) {
      return NextResponse.json({ tier: 'free', status: 'inactive' });
    }

    return NextResponse.json({ tier: data.tier, status: data.status });
  } catch (err) {
    console.error('Subscription check error:', err);
    return NextResponse.json({ tier: 'free', status: 'inactive' });
  }
}
