export type Tier = 'free' | 'pro' | 'builder';

export interface AutomationGapsInput {
  businessType: string;
  teamSize: string;
  tools: string;
  bottleneck: string;
}

export interface AutomationGapsResult {
  summary: string;
  top_gaps: string[];
  quick_win: string;
  system_score: number;
  premium_teaser: string;
}

export interface CustomerRecord {
  email: string;
  stripeCustomerId: string;
  subscriptionId: string;
  tier: Tier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  createdAt: string;
}

export interface PricingTier {
  id: Tier;
  name: string;
  price: string;
  priceMonthly: number | null;
  description: string;
  features: string[];
  cta: string;
  stripePriceId?: string;
  highlighted?: boolean;
}
