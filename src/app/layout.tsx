import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI is OK Sandbox — Find Your Automation Gaps',
  description: 'Guided AI diagnosis for small business operators. Find your automation gaps in under 2 minutes.',
  keywords: ['AI automation', 'business diagnosis', 'workflow gaps', 'automation tools'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-brand-bg text-brand-text antialiased">
        {children}
      </body>
    </html>
  );
}
