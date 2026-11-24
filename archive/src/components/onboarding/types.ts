export interface OnboardingClinicData {
  clinicName: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  currency: string;
  chairsCount: number;
  bufferMinutes: number;
  depositAmount: number;
  cancellationCutoffHours: number;
  primaryDoctorName: string;
  primaryDoctorTitle: string;
  theme: 'obsidian' | 'azure' | 'nordic' | 'emerald';
}

export interface ThemeOption {
  id: 'azure' | 'obsidian' | 'nordic' | 'emerald';
  name: string;
  desc: string;
  gradient: string;
  badge: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'azure',
    name: 'Harley St. Royal Azure',
    desc: 'Deep cobalt sapphire with platinum accents (Default)',
    gradient: 'from-blue-600 via-indigo-600 to-blue-900',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  },
  {
    id: 'obsidian',
    name: 'Mayfair Obsidian Luxury',
    desc: 'Deep pitch obsidian with metallic gold accents',
    gradient: 'from-amber-600 via-amber-700 to-amber-950',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
  {
    id: 'nordic',
    name: 'Stockholm Nordic Mineral',
    desc: 'Clean Scandinavian slate with icy frost highlight',
    gradient: 'from-slate-600 via-slate-700 to-slate-900',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
  },
  {
    id: 'emerald',
    name: 'Zurich Private Medical',
    desc: 'Swiss alpine emerald with crisp ivory contrast',
    gradient: 'from-emerald-600 via-teal-700 to-emerald-950',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
];
