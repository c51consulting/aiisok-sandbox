'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AutomationGapsResult } from '@/types';

export default function ResultsPage() {
  const [result, setResult] = useState<AutomationGapsResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('sandbox_result');
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!result) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#8888aa] mb-4">No result found. Run a play first.</p>
          <Link href="/sandbox" className="text-[#6c63ff] hover:underline">Go to Sandbox</Link>
        </div>
      </main>
    );
  }

  const scoreOffset = Math.round(283 - (283 * result.system_score) / 100);
  const scoreColor = result.system_score > 70 ? '#ef4444' : result.system_score > 40 ? '#f59e0b' : '#22c55e';

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/sandbox" className="text-[#6c63ff] text-sm hover:underline">← Run another play</Link>

        <h1 className="text-3xl font-bold text-white mt-6 mb-2">Your Automation Gap Diagnosis</h1>
        <p className="text-[#8888aa] mb-10">Based on your inputs, here is what the AI found.</p>

        {/* Score */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 mb-6 flex items-center gap-8">
          <div className="relative shrink-0">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e1e2e" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={scoreColor} strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={scoreOffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{result.system_score}</span>
              <span className="text-xs text-[#8888aa]">/ 100</span>
            </div>
          </div>
          <div>
            <div className="text-[#8888aa] text-xs font-semibold uppercase tracking-wider mb-1">System Chaos Score</div>
            <div className="text-white font-semibold text-lg mb-2">
              {result.system_score > 70 ? 'High chaos. Fix this now.' : result.system_score > 40 ? 'Moderate friction. Addressable.' : 'Relatively clean. Refine and scale.'}
            </div>
            <p className="text-[#8888aa] text-sm">{result.summary}</p>
          </div>
        </div>

        {/* Top Gaps */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Top 3 automation gaps</h2>
          <ul className="space-y-3">
            {result.top_gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#6c63ff] font-mono text-sm shrink-0 mt-0.5">0{i + 1}</span>
                <span className="text-[#8888aa] text-sm leading-relaxed">{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Win */}
        <div className="bg-[#12121a] border border-[#6c63ff]/30 rounded-2xl p-6 mb-6">
          <div className="text-[#6c63ff] text-xs font-semibold uppercase tracking-wider mb-2">⚡ Quick Win</div>
          <p className="text-white text-sm leading-relaxed">{result.quick_win}</p>
        </div>

        {/* Locked Premium */}
        <div className="relative bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 mb-8 overflow-hidden">
          <div className="locked-blur text-[#8888aa] text-sm leading-relaxed">
            {result.premium_teaser}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]/60 backdrop-blur-sm">
            <div className="text-center px-6">
              <div className="text-white font-semibold mb-1">🔒 Premium Insight Locked</div>
              <p className="text-[#8888aa] text-sm mb-4">Upgrade to Pro to unlock your full system map, priority fix order, and deeper stack analysis.</p>
              <Link href="/upgrade?tier=pro" className="bg-[#6c63ff] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#7c73ff] transition-colors">
                Unlock with Sandbox Pro
              </Link>
            </div>
          </div>
        </div>

        {/* KAOS CTA */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 text-center">
          <p className="text-[#8888aa] text-sm mb-3">Want someone to actually fix this for you?</p>
          <a href="https://kaos.consulting" target="_blank" rel="noopener noreferrer" className="text-[#6c63ff] text-sm hover:underline">
            Book KAOS Consulting →
          </a>
        </div>
      </div>
    </main>
  );
}
