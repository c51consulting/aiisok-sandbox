'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AutomationGapsInput } from '@/types';

const QUESTIONS = [
  {
    id: 'businessType' as const,
    question: 'What type of business do you run?',
    placeholder: 'e.g. Marketing agency, SaaS startup, retail store, consulting firm...',
    hint: 'Be specific. The more detail, the better the diagnosis.',
  },
  {
    id: 'teamSize' as const,
    question: 'How many people are on your team?',
    placeholder: 'e.g. Just me, 3 people, 12 staff...',
    hint: 'Include contractors and part-timers.',
  },
  {
    id: 'tools' as const,
    question: 'What tools do you currently use?',
    placeholder: 'e.g. Slack, Notion, Zapier, HubSpot, Xero, Google Workspace...',
    hint: 'List every tool your team touches weekly.',
  },
  {
    id: 'bottleneck' as const,
    question: 'What is your biggest admin or workflow bottleneck?',
    placeholder: 'e.g. Chasing invoices manually, onboarding takes too long, reporting is a mess...',
    hint: 'The thing that slows you down the most.',
  },
];

export default function AutomationGapsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AutomationGapsInput>({
    businessType: '',
    teamSize: '',
    tools: '',
    bottleneck: '',
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
      const res = await fetch('/api/play/automation-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      sessionStorage.setItem('sandbox_result', JSON.stringify(result));
      sessionStorage.setItem('sandbox_inputs', JSON.stringify(answers));
      router.push('/results');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-10">
          <Link href="/sandbox" className="text-[#8888aa] hover:text-white text-sm">←</Link>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${
                i < step ? 'bg-[#6c63ff] w-8' : i === step ? 'bg-[#6c63ff] w-8 opacity-60' : 'bg-[#1e1e2e] w-4'
              }`} />
            ))}
          </div>
          <span className="text-[#8888aa] text-xs">{step + 1} of {QUESTIONS.length}</span>
        </div>

        <div key={step}>
          <h1 className="text-2xl font-bold text-white mb-3">{currentQ.question}</h1>
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
              {loading ? 'Analysing...' : isLast ? 'Get my diagnosis' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
