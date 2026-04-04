'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/pricing';

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleUpgrade(tierId: string) {
    setLoading(tierId);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  const paidTiers = PRICING_TIERS.filter((t) => t.id !== 'free');

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/results" className="text-[#6c63ff] text-sm hover:underline">← Back to results</Link>
        <div className="text-center mt-8 mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Unlock the full diagnosis</h1>
          <p className="text-[#8888aa]">Choose your plan. Cancel any time.</p>
        </div>
        {error && <p className="text-red-400 text-sm text-center mb-6">{error}</p>}
        <div className="grid md:grid-cols-2 gap-6">
          {paidTiers.map((tier) => (
            <div key={tier.id} className={`bg-[#12121a] border rounded-2xl p-8 flex flex-col ${tier.highlighted ? 'border-[#6c63ff]' : 'border-[#1e1e2e]'}`}>
              {tier.highlighted && <div className="text-xs text-[#6c63ff] font-semibold mb-3 uppercase tracking-wider">Most Popular</div>}
              <h2 className="text-white font-bold text-xl mb-1">{tier.name}</h2>
              <div className="text-3xl font-bold text-white mb-1">
                {tier.price}<span className="text-sm text-[#8888aa] font-normal">/mo</span>
              </div>
              <p className="text-[#8888aa] text-sm mb-6">{tier.description}</p>
              <ul className="space-y-2 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#8888aa]">
                    <span className="text-[#6c63ff]">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(tier.id)}
                disabled={loading === tier.id}
                className={`py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
                  tier.highlighted
                    ? 'bg-[#6c63ff] text-white hover:bg-[#7c73ff]'
                    : 'border border-[#1e1e2e] text-[#8888aa] hover:border-[#6c63ff] hover:text-white'
                }`}
              >
                {loading === tier.id ? 'Redirecting...' : tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
