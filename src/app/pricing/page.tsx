import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/pricing';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Link href="/" className="text-[#6c63ff] text-sm hover:underline">← Back to home</Link>
          <h1 className="text-4xl font-bold text-white mt-6 mb-4">Simple, honest pricing</h1>
          <p className="text-[#8888aa] text-lg">Start free. Upgrade when the diagnosis is worth acting on.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.id} className={`bg-[#12121a] border rounded-2xl p-8 flex flex-col ${tier.highlighted ? 'border-[#6c63ff] relative' : 'border-[#1e1e2e]'}`}>
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6c63ff] text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </div>
              )}
              <div>
                <h2 className="text-white font-bold text-xl mb-2">{tier.name}</h2>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.priceMonthly && tier.priceMonthly > 0 && <span className="text-[#8888aa] mb-1">/month</span>}
                </div>
                <p className="text-[#8888aa] text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#8888aa]">
                      <span className="text-[#6c63ff] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto">
                <Link
                  href={tier.id === 'free' ? '/sandbox' : `/upgrade?tier=${tier.id}`}
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-[#6c63ff] text-white hover:bg-[#7c73ff]'
                      : 'border border-[#1e1e2e] text-[#8888aa] hover:border-[#6c63ff] hover:text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[#8888aa] text-sm mt-8">
          All plans billed monthly. Cancel any time.
        </p>
      </div>
    </main>
  );
}
