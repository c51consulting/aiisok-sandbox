'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { GrowthBottleneckInput } from '@/types';

const QUESTIONS = [
  {
    id: 'revenue' as const,
    question: 'What is your current annual revenue?',
    placeholder: 'e.g. $250K, $1.2M, pre-revenue, around $500K...',
    hint: 'Approximate is fine. This helps calibrate the diagnosis.',
  },
  {
    id: 'team_size' as const,
    question: 'How big is your team?',
    placeholder: 'e.g. Just me, 4 people, 15 full-time staff...',
    hint: 'Include part-time and contractors.',
  },
  {
    id: 'industry' as const,
    question: 'What industry or niche are you in?',
    placeholder: 'e.g. B2B SaaS, e-commerce, professional services, agriculture tech...',
    hint: 'Be as specific as possible about your market.',
  },
  {
    id: 'primary_challenge' as const,
    question: 'What feels like the biggest thing holding back your growth right now?',
    placeholder: 'e.g. Not enough qualified leads, can\'t retain clients, team is stretched thin, no repeatable sales process...',
    hint: 'Describe it in your own words. No need to be polished.',
  },
];

export default function GrowthBottleneckPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<GrowthBottleneckInput>({
    revenue: '',
    team_size: '',
    industry: '',
    primary_challenge: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentQ = QUESTIONS[step];
  const currentAnswer = answers[currentQ.id];
  const isLast = step === QUESTIONS.length - 1;

  function handleChange(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  }

  async function handleNext() {
    if (!currentAnswer.trim()) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/play/growth-bottleneck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      sessionStorage.setItem('sandbox_result', JSON.stringify(result));
      sessionStorage.setItem('sandbox_inputs', JSON.stringify(answers));
      sessionStorage.setItem('sandbox_play', 'growth-bottleneck');
      router.push('/results');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-xl mx-auto">
        <Link href="/sandbox" className="text-[#6c63ff] text-sm hover:underline">← Back to plays</Link>
        <div className="flex gap-2 mt-6 mb-8">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-[#6c63ff]' : 'bg-[#1e1e2e]'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-[#8888aa] mb-2">{step + 1} of {QUESTIONS.length}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{currentQ.question}</h2>
        <p className="text-[#8888aa] text-sm mb-6">{currentQ.hint}</p>
        <textarea
          className="w-full bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 text-white placeholder-[#3a3a5c] resize-none focus:outline-none focus:border-[#6c63ff] transition-colors text-sm leading-relaxed"
          rows={4}
          placeholder={currentQ.placeholder}
          value={currentAnswer}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleNext();
          }}
          autoFocus
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <div className="flex items-center justify-between mt-4">
          <span className="text-[#3a3a5c] text-xs">Ctrl+Enter to continue</span>
          <button
            onClick={handleNext}
            disabled={!currentAnswer.trim() || loading}
            className="bg-[#6c63ff] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#7c73ff] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Analysing...' : isLast ? 'Find My Bottlenecks' : 'Next →'}
          </button>
        </div>
      </div>
    </main>
  );
}
