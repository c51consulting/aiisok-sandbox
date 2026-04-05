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
  priority_fixes?: string[];
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


export interface StackAuditInput {
  tools: string;
  monthlyCost: string;
  teamSize: string;
  missingOutcomes: string;
}

export interface StackAuditResult {
  summary: string;
  redundant_tools: string[];
  missing_integrations: string[];
  quick_win: string;
  estimated_monthly_waste: string;
  system_score: number;
  premium_teaser: string;
  priority_fixes: string[];
}

export interface GrowthBottleneckInput {
  revenue: string;
  team_size: string;
  industry: string;
  primary_challenge: string;
}

export interface GrowthBottleneckItem {
  rank: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
  timeline: string;
}

export interface GrowthBottleneckResult {
  bottlenecks: GrowthBottleneckItem[];
  priority_action: string;
  growth_potential: string;
}
