'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { StackAuditInput } from '@/types';

const QUESTIONS = [
  {
    id: 'tools' as const,
    question: 'What tools does your team use regularly?',
    placeholder: 'e.g. Slack, Notion, HubSpot, Xero, Zapier, Google Workspace, Asana...',
    hint: 'List every tool your team touches at least weekly.',
  },
  {
    id: 'monthlyCost' as const,
    question: 'What do you spend on software per month?',
    placeholder: 'e.g. $800/month, around $2,000, not sure exactly...',
    hint: "Include all subscriptions, even ones you're unsure about.",
  },
  {
    id: 'teamSize' as const,
    question: 'How many people are on your team?',
    placeholder: 'e.g. Just me, 5 people, 20 staff...',
    hint: 'Include contractors and part-timers who use these tools.',
  },
  {
    id: 'missingOutcomes' as const,
    question: 'What outcomes are you NOT getting from your current stack?',
    placeholder: 'e.g. No single source of truth, reporting takes hours, leads fall through the cracks...',
    hint: 'Think about what frustrates you most about how your tools work together.',
  },
];

export default function StackAuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StackAuditInput>({
    tools: '',
    monthlyCost: '',
    teamSize: '',
    missingOutcomes: '',
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
      const res = await fetch('/api/play/stack-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      sessionStorage.setItem('sandbox_result', JSON.stringify(result));
      sessionStorage.setItem('sandbox_inputs', JSON.stringify(answers));
      sessionStorage.setItem('sandbox_play', 'stack-audit');
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
            {loading ? 'Auditing...' : isLast ? 'Run Stack Audit' : 'Next →'}
          </button>
        </div>
      </div>
    </main>
  );
}
