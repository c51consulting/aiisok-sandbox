import type { Tier } from '@/types';

export function canAccessPremiumInsights(tier: Tier): boolean {
  return tier === 'pro' || tier === 'builder';
}

export function canAccessAllPlays(tier: Tier): boolean {
  return tier === 'pro' || tier === 'builder';
}

export function canAccessFullSystemMap(tier: Tier): boolean {
  return tier === 'builder';
}

export function canAccessKAOSScore(tier: Tier): boolean {
  return tier === 'builder';
}

export function getTierLabel(tier: Tier): string {
  const labels: Record<Tier, string> = {
    free: 'Free',
    pro: 'Sandbox Pro',
    builder: 'Sandbox Builder',
  };
  return labels[tier];
}
