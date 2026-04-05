'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AutomationGapsResult, StackAuditResult, GrowthBottleneckResult } from '@/types';

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [tier, setTier] = useState('free');
  const [play, setPlay] = useState<string>('automation-gaps');

  useEffect(() => {
    const rawResult = sessionStorage.getItem('sandbox_result');
    const activePlay = sessionStorage.getItem('sandbox_play') || 'automation-gaps';
    
    if (rawResult) {
      try {
        setResult(JSON.parse(rawResult));
        setPlay(activePlay);
      } catch {
        // ignore
      }
    }

    const email = sessionStorage.getItem('sandbox_email');
    const cachedTier = sessionStorage.getItem('sandbox_tier');

    if (cachedTier && cachedTier !== 'free') {
      setTier(cachedTier);
      setLoaded(true);
    } else if (email) {
      fetch(`/api/subscription?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.tier && data.status === 'active') {
            setTier(data.tier);
            sessionStorage.setItem('sandbox_tier', data.tier);
          }
        })
        .catch(console.error)
        .finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, []);

  if (!loaded) return null;
  if (!result) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-[#8888aa] mb-4">No result found. Run a play first.</p>
          <Link href="/sandbox" className="bg-[#6c63ff] text-white px-6 py-2 rounded-lg hover:bg-[#7c73ff]">
            Go to Sandbox
          </Link>
        </div>
      </main>
    );
  }

  const isPro = tier !== 'free';

  // Render logic based on play type
  if (play === 'automation-gaps') {
    const data = result as AutomationGapsResult;
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
        <div className="max-w-xl mx-auto">
          <Link href="/sandbox" className="text-[#6c63ff] text-sm hover:underline">← Run another play</Link>
          <h1 className="text-3xl font-bold text-white mt-8 mb-2">Automation Gap Diagnosis</h1>
          <p className="text-[#8888aa] mb-10">Based on your inputs, here is what the AI found.</p>

          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="45" fill="transparent" stroke="#1e1e2e" strokeWidth="6" />
                  <circle 
                    cx="48" cy="48" r="45" fill="transparent" 
                    stroke={data.system_score > 70 ? '#ef4444' : data.system_score > 40 ? '#f59e0b' : '#22c55e'} 
                    strokeWidth="6" 
                    strokeDasharray="283" 
                    strokeDashoffset={Math.round(283 - (283 * data.system_score) / 100)} 
                  />
                </svg>
                <span className="absolute text-2xl font-bold text-white">{data.system_score}</span>
              </div>
              <div>
                <div className="text-white font-semibold">System Chaos Score</div>
                <div className="text-[#8888aa] text-sm">
                  {data.system_score > 70 ? 'High chaos. Fix this now.' : data.system_score > 40 ? 'Moderate friction. Addressable.' : 'Relatively clean.'}
                </div>
              </div>
            </div>
            <p className="text-white text-sm leading-relaxed mb-6">{data.summary}</p>
          </div>

          <h3 className="text-white font-semibold mb-4">Top 3 automation gaps</h3>
          <div className="space-y-3 mb-8">
            {data.top_gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 text-sm text-[#8888aa]">
                <span className="text-[#6c63ff] font-mono font-bold">0{i + 1}</span>
                <span className="text-white">{gap}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-xl p-6 mb-8">
            <h4 className="text-[#6c63ff] font-semibold text-sm mb-2 flex items-center gap-2">
              <span>⚡</span> Quick Win
            </h4>
            <p className="text-white text-sm">{data.quick_win}</p>
          </div>

          {!isPro ? (
            <div className="bg-[#12121a] border border-[#6c63ff]/30 rounded-2xl p-8 relative overflow-hidden">
               <div className="absolute top-4 right-4 text-xs font-mono text-[#6c63ff]">LOCKED</div>
               <p className="text-[#8888aa] text-sm blur-sm select-none mb-6">{data.premium_teaser}</p>
               <div className="text-center">
                 <h4 className="text-white font-bold mb-2">🔒 Premium Insight Locked</h4>
                 <p className="text-[#8888aa] text-xs mb-6">Upgrade to Pro to unlock your full system map and priority fix order.</p>
                 <Link href="/upgrade" className="inline-block bg-[#6c63ff] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7c73ff]">
                   Unlock with Sandbox Pro
                 </Link>
               </div>
            </div>
          ) : (
            <div className="bg-[#12121a] border border-green-500/30 rounded-2xl p-8">
              <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                <span>✨</span> Premium Insight — {tier.toUpperCase()}
              </h4>
              <p className="text-white text-sm leading-relaxed mb-6">{data.premium_teaser}</p>
              {data.priority_fixes && (
                <div>
                  <h5 className="text-[#8888aa] text-xs font-bold uppercase tracking-wider mb-4">Priority Fix Order</h5>
                  <div className="space-y-4">
                    {data.priority_fixes.map((fix, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-[#6c63ff] font-mono">{i + 1}.</span>
                        <p className="text-white text-sm">{fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 p-8 bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[#1e1e2e] rounded-2xl text-center">
            <h3 className="text-white font-bold mb-2">Want someone to actually fix this for you?</h3>
            <p className="text-[#8888aa] text-sm mb-6">Book a 30-min strategy session to discuss implementing these fixes.</p>
            <a href="https://kaos.consulting" className="text-[#6c63ff] font-semibold hover:underline">
              Book KAOS Consulting →
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (play === 'stack-audit') {
    const data = result.audit || result; // Handle both direct result and result.audit
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/sandbox" className="text-[#6c63ff] text-sm hover:underline">← Back to plays</Link>
          <h1 className="text-3xl font-bold text-white mt-8 mb-2">Stack Audit Report</h1>
          <p className="text-[#8888aa] mb-10">Analysis of your tool efficiency and cost waste.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#12121a] border border-[#1e1e2e] p-6 rounded-2xl">
               <div className="text-xs text-[#8888aa] uppercase mb-1">Efficiency Score</div>
               <div className="text-3xl font-bold text-white">{data.system_score}%</div>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] p-6 rounded-2xl">
               <div className="text-xs text-[#8888aa] uppercase mb-1">Monthly Waste</div>
               <div className="text-3xl font-bold text-red-400">{data.estimated_monthly_waste}</div>
            </div>
          </div>

          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 mb-8">
             <h3 className="text-white font-semibold mb-4">Diagnosis Summary</h3>
             <p className="text-[#8888aa] text-sm leading-relaxed">{data.summary}</p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-3">Redundant Tools</h3>
              <div className="space-y-2">
                {data.redundant_tools.map((tool: string, i: number) => (
                  <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 text-sm text-white">
                    {tool}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Missing Integrations</h3>
              <div className="space-y-2">
                {data.missing_integrations.map((integration: string, i: number) => (
                  <div key={i} className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 text-sm text-white">
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-xl p-6 mb-12">
            <h4 className="text-[#6c63ff] font-semibold text-sm mb-2 flex items-center gap-2">
              <span>⚡</span> Quick Win
            </h4>
            <p className="text-white text-sm">{data.quick_win}</p>
          </div>

          <div className="bg-[#12121a] border border-green-500/30 rounded-2xl p-8 mb-12">
            <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <span>✨</span> Pro Priority Fixes
            </h4>
            <div className="space-y-4">
              {data.priority_fixes.map((fix: string, i: number) => (
                <div key={i} className="flex gap-4">
                  <span className="text-[#6c63ff] font-mono">{i + 1}.</span>
                  <p className="text-white text-sm">{fix}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <a href="https://kaos.consulting" className="bg-[#6c63ff] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7c73ff]">
              Book Implementation Support →
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (play === 'growth-bottleneck') {
    const data = result.analysis || result;
    return (
      <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/sandbox" className="text-[#6c63ff] text-sm hover:underline">← Back to plays</Link>
          <h1 className="text-3xl font-bold text-white mt-8 mb-2">Growth Bottleneck Analysis</h1>
          <p className="text-[#8888aa] mb-10">Identifying the constraints blocking your next revenue stage.</p>

          <div className="bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-2xl p-8 mb-8 text-center">
            <div className="text-xs text-[#6c63ff] uppercase font-bold tracking-widest mb-2">Primary Priority</div>
            <p className="text-xl text-white font-semibold italic">"{data.priority_action}"</p>
          </div>

          <div className="space-y-6 mb-12">
            {data.bottlenecks.map((b: any) => (
              <div key={b.rank} className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-[#6c63ff] font-mono">BOTTLENECK #{b.rank}</span>
                    <h3 className="text-xl font-bold text-white">{b.title}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    b.impact === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {b.impact} Impact
                  </span>
                </div>
                <p className="text-[#8888aa] text-sm mb-6">{b.description}</p>
                <div className="space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase">Recommendations:</h4>
                  {b.recommendations.map((rec: string, j: number) => (
                    <div key={j} className="flex gap-3 text-sm text-[#8888aa]">
                      <span className="text-[#6c63ff]">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-[#1e1e2e] text-xs text-[#3a3a5c]">
                  Expected Timeline: {b.timeline}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center mb-12">
            <h3 className="text-green-400 font-bold mb-2">Projected Growth Potential</h3>
            <p className="text-white text-2xl font-bold">{data.growth_potential}</p>
          </div>

          <div className="text-center">
             <Link href="/upgrade" className="text-[#6c63ff] hover:underline">Want a custom roadmap? Upgrade to Builder Tier →</Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
