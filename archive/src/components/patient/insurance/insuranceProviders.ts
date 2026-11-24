export interface InsurancePolicy {
  provider: 'bupa' | 'axa' | 'aviva' | 'cigna' | 'denplan' | 'wpa';
  providerName: string;
  policyNumber: string;
  groupNumber?: string;
  tier: 'standard' | 'comprehensive' | 'executive';
  status: 'verified' | 'pending' | 'unverified';
  coveragePct: number;
  preAuthCode?: string;
  verifiedAt?: string;
}

export interface InsuranceProviderConfig {
  id: 'bupa' | 'axa' | 'aviva' | 'cigna' | 'denplan' | 'wpa';
  name: string;
  code: string;
  logo: string;
  badge: string;
  accent: string;
  coverage: {
    standard: number;
    comprehensive: number;
    executive: number;
  };
}

export const PROVIDERS: InsuranceProviderConfig[] = [
  {
    id: 'bupa',
    name: 'Bupa Dental Care',
    code: 'BUPA-UK',
    logo: '🛡️',
    badge: 'Direct Settlement',
    accent: 'border-blue-500 bg-blue-50/10 text-blue-400',
    coverage: { standard: 60, comprehensive: 80, executive: 100 },
  },
  {
    id: 'axa',
    name: 'AXA Health Direct',
    code: 'AXA-PPP',
    logo: '🏛️',
    badge: 'Direct Settlement',
    accent: 'border-rose-500 bg-rose-50/10 text-rose-400',
    coverage: { standard: 50, comprehensive: 75, executive: 90 },
  },
  {
    id: 'aviva',
    name: 'Aviva Dental Solutions',
    code: 'AVIVA-HQ',
    logo: '🌿',
    badge: 'Electronic Claim',
    accent: 'border-amber-500 bg-amber-50/10 text-amber-400',
    coverage: { standard: 50, comprehensive: 70, executive: 85 },
  },
  {
    id: 'cigna',
    name: 'Cigna Global Dental',
    code: 'CGNA-NET',
    logo: '🌐',
    badge: 'Worldwide Direct',
    accent: 'border-cyan-500 bg-cyan-50/10 text-cyan-400',
    coverage: { standard: 60, comprehensive: 80, executive: 95 },
  },
  {
    id: 'denplan',
    name: 'Simplyhealth / Denplan',
    code: 'DNPLN-PREM',
    logo: '💎',
    badge: 'Capitation Scheme',
    accent: 'border-purple-500 bg-purple-50/10 text-purple-400',
    coverage: { standard: 70, comprehensive: 85, executive: 100 },
  },
  {
    id: 'wpa',
    name: 'WPA Healthcare Partner',
    code: 'WPA-EXCL',
    logo: '🦅',
    badge: 'Fast-Track Pre-Auth',
    accent: 'border-emerald-500 bg-emerald-50/10 text-emerald-400',
    coverage: { standard: 55, comprehensive: 75, executive: 90 },
  },
];
