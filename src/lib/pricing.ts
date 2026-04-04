import type { PricingTier } from '@/types';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceMonthly: 0,
    description: 'Get started. Run one play. See what your business is missing.',
    features: [
      '1 guided play (Find My Automation Gaps)',
      'Free summary + top 3 gaps',
      'System Chaos Score',
      'One quick-win recommendation',
    ],
    cta: 'Start Free',
  },
  {
    id: 'pro',
    name: 'Sandbox Pro',
    price: '$29',
    priceMonthly: 29,
    description: 'All plays. Deeper outputs. Built for founders who are serious about fixing their ops.',
    features: [
      'All guided plays (3 total)',
      'Full AI diagnosis reports',
      'Saved run history',
      'Priority fix recommendations',
      'Deeper stack analysis',
      'Unlock premium insights',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    id: 'builder',
    name: 'Sandbox Builder',
    price: '$99',
    priceMonthly: 99,
    description: 'Full system maps, stack analysis, and KAOS readiness. For operators building at scale.',
    features: [
      'Everything in Pro',
      'Full system map output',
      'Complete stack analysis',
      'Priority automation plan',
      'KAOS readiness score',
      'Direct KAOS consulting CTA',
    ],
    cta: 'Upgrade to Builder',
  },
];
