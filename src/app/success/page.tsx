'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            sessionStorage.setItem('sandbox_email', data.email);
          }
          if (data.tier) {
            sessionStorage.setItem('sandbox_tier', data.tier);
          }
        })
        .catch(console.error)
        .finally(() => setDone(true));
    } else {
      setDone(true);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6 text-[#22c55e]">&#10003;</div>
        <h1 className="text-3xl font-bold text-white mb-3">You&apos;re in.</h1>
        <p className="text-[#8888aa] mb-8">
          Your subscription is active. Head back to your results to
          unlock your premium insights, or run a new play.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/results"
            className="bg-[#6c63ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7c73ff] transition-colors"
          >
            Back to my results
          </Link>
          <Link
            href="/sandbox"
            className="border border-[#1e1e2e] text-[#8888aa] px-6 py-3 rounded-lg hover:border-[#6c63ff] transition-colors"
          >
            Run another play
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <SuccessContent />
    </Suspense>
  );
}
