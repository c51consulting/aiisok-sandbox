import Link from 'next/link';
import { PRICING_TIERS } from '@/lib/pricing';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Nav */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-white font-bold text-lg tracking-tight">AI is OK <span className="text-[#6c63ff]">Sandbox</span></span>
        <div className="flex gap-4">
          <Link href="/pricing" className="text-sm text-[#8888aa] hover:text-white transition-colors">Pricing</Link>
          <Link href="/sandbox" className="text-sm bg-[#6c63ff] text-white px-4 py-1.5 rounded-md hover:bg-[#7c73ff] transition-colors">Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block bg-[#12121a] border border-[#1e1e2e] text-[#6c63ff] text-xs font-medium px-3 py-1 rounded-full mb-6">
          Free • No account needed • Result in 90 seconds
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Find out where your business is leaking time and money
        </h1>
        <p className="text-xl text-[#8888aa] mb-10 max-w-2xl mx-auto leading-relaxed">
          Answer 4 questions. Get an AI diagnosis of your workflow gaps, a chaos score, and your single best automation move. Free. No fluff.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sandbox" className="bg-[#6c63ff] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#7c73ff] transition-colors">
            Run the Free Play →
          </Link>
          <a href="https://kaos.consulting" target="_blank" rel="noopener noreferrer" className="border border-[#1e1e2e] text-[#8888aa] px-8 py-4 rounded-lg text-lg hover:border-[#6c63ff] hover:text-white transition-colors">
            Talk to KAOS Instead
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-12">How the Sandbox works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Answer 4 questions', desc: 'Tell us your business type, team size, tools, and biggest bottleneck. Honest answers = better diagnosis.' },
            { step: '02', title: 'Get your diagnosis', desc: 'Our AI analyzes your inputs and returns a structured report: gaps, quick wins, and a chaos score.' },
            { step: '03', title: 'Fix your worst problem first', desc: 'Use the free result to act now. Upgrade to unlock deeper insights and the full system map.' },
          ].map((item) => (
            <div key={item.step} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
              <div className="text-[#6c63ff] font-mono text-sm mb-3">{item.step}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-[#8888aa] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Simple pricing</h2>
        <p className="text-[#8888aa] text-center mb-12">Start free. Upgrade when the results are worth it.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.id} className={`bg-[#12121a] border rounded-xl p-6 ${tier.highlighted ? 'border-[#6c63ff]' : 'border-[#1e1e2e]'}`}>
              {tier.highlighted && <div className="text-xs text-[#6c63ff] font-semibold mb-3">MOST POPULAR</div>}
              <div className="text-white font-bold text-xl mb-1">{tier.name}</div>
              <div className="text-3xl font-bold text-white mb-1">{tier.price}<span className="text-sm text-[#8888aa] font-normal">{tier.priceMonthly && tier.priceMonthly > 0 ? '/mo' : ''}</span></div>
              <p className="text-[#8888aa] text-sm mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#8888aa]">
                    <span className="text-[#6c63ff] mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.id === 'free' ? '/sandbox' : `/upgrade?tier=${tier.id}`}
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${tier.highlighted ? 'bg-[#6c63ff] text-white hover:bg-[#7c73ff]' : 'border border-[#1e1e2e] text-[#8888aa] hover:border-[#6c63ff] hover:text-white'}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* KAOS CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Need a human to look at your systems?</h2>
          <p className="text-[#8888aa] mb-6">The Sandbox gives you the diagnosis. KAOS does the work. Book a session and we will map your entire system, build your automation stack, and get you out of the weeds.</p>
          <a href="https://kaos.consulting" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-[#0a0a0f] px-8 py-3 rounded-lg font-semibold hover:bg-[#e2e2f0] transition-colors">
            Book KAOS Consulting
          </a>
        </div>
      </section>

      <footer className="border-t border-[#1e1e2e] py-8 text-center text-[#8888aa] text-sm">
        <p>© 2025 AI is OK Sandbox • Built by <a href="https://kaos.consulting" className="text-[#6c63ff] hover:underline">KAOS Consulting</a></p>
      </footer>
    </main>
  );
}
