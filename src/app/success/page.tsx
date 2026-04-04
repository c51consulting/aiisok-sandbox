import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">✓</div>
        <h1 className="text-3xl font-bold text-white mb-3">You're in.</h1>
        <p className="text-[#8888aa] mb-8">
          Your subscription is active. Head back to your results to unlock your premium insights, or run a new play.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/results" className="bg-[#6c63ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7c73ff] transition-colors">
            Back to my results
          </Link>
          <Link href="/sandbox" className="border border-[#1e1e2e] text-[#8888aa] px-6 py-3 rounded-lg hover:border-[#6c63ff] hover:text-white transition-colors">
            Run another play
          </Link>
        </div>
      </div>
    </main>
  );
}
