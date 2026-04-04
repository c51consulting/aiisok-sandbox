import Link from 'next/link';

export default function SandboxPage() {
  const plays = [
    {
      id: 'automation-gaps',
      title: 'Find My Automation Gaps',
      description: 'Answer 4 questions and get a structured diagnosis of where your business is leaking time and money.',
      time: '90 seconds',
      free: true,
      href: '/sandbox/automation-gaps',
    },
    {
      id: 'stack-audit',
      title: 'Stack Audit',
      description: 'Evaluate every tool in your tech stack and identify overlap, cost waste, and missing integrations.',
      time: '2 minutes',
      free: false,
      href: '/upgrade?tier=pro',
    },
    {
      id: 'growth-bottleneck',
      title: 'Growth Bottleneck Finder',
      description: 'Identify the single operational constraint blocking your next growth stage.',
      time: '2 minutes',
      free: false,
      href: '/upgrade?tier=pro',
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-[#6c63ff] text-sm hover:underline">← Back to home</Link>
        <h1 className="text-3xl font-bold text-white mt-6 mb-2">Choose a play</h1>
        <p className="text-[#8888aa] mb-10">Each play is a guided diagnostic session. Start with the free one.</p>
        <div className="space-y-4">
          {plays.map((play) => (
            <Link key={play.id} href={play.href} className="block">
              <div className={`bg-[#12121a] border rounded-xl p-6 hover:border-[#6c63ff] transition-colors ${play.free ? 'border-[#1e1e2e]' : 'border-[#1e1e2e] opacity-75'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-white font-semibold">{play.title}</h2>
                      {play.free ? (
                        <span className="bg-[#6c63ff]/20 text-[#6c63ff] text-xs px-2 py-0.5 rounded-full">Free</span>
                      ) : (
                        <span className="bg-[#1e1e2e] text-[#8888aa] text-xs px-2 py-0.5 rounded-full">Pro</span>
                      )}
                    </div>
                    <p className="text-[#8888aa] text-sm">{play.description}</p>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-xs text-[#8888aa]">{play.time}</div>
                    <div className="text-[#6c63ff] mt-2">→</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
