'use client';

import React from 'react';
import Link from 'next/link';
import { ZenithLogo } from '@/components/shared/ZenithLogo';

interface OnboardingHeaderProps {
  step: number;
}

const STEP_LABELS = [
  { num: 1, label: 'Identity' },
  { num: 2, label: 'Specialists' },
  { num: 3, label: 'Protocols' },
  { num: 4, label: 'Branding' },
  { num: 5, label: 'Go Live' },
];

export function OnboardingHeader({ step }: OnboardingHeaderProps) {
  return (
    <header className="h-18 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <ZenithLogo size={36} />
          <div className="leading-tight">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              DentalBook<span className="text-cyan-400">.os</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Practice Onboarding
            </span>
          </div>
        </Link>
      </div>

      {/* Multi-step progress indicators */}
      <div className="hidden md:flex items-center gap-2 text-xs font-bold">
        {STEP_LABELS.map((item) => (
          <div key={item.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === item.num
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25 ring-2 ring-cyan-400/50'
                  : step > item.num
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {step > item.num ? '✓' : item.num}
            </div>
            <span
              className={`text-[11px] ${
                step === item.num ? 'text-white font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              {item.label}
            </span>
            {item.num < 5 && <div className="w-4 h-0.5 bg-slate-800 mx-1" />}
          </div>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        Exit to Dashboard &rarr;
      </Link>
    </header>
  );
}
