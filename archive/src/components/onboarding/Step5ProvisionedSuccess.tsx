'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { OnboardingClinicData } from './types';

interface Step5ProvisionedSuccessProps {
  formData: OnboardingClinicData;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export function Step5ProvisionedSuccess({
  formData,
  copiedLink,
  onCopyLink,
}: Step5ProvisionedSuccessProps) {
  return (
    <div className="space-y-6 animate-fade-in relative z-10 text-center py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/30">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block">
          Enterprise Clinic Online
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {formData.clinicName} is Live!
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Your high-converting booking storefront is published. You can now accept online patient appointments, capture deposits, and track odontograms.
        </p>
      </div>

      {/* Published Storefront URL Card */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto flex items-center justify-between gap-3 shadow-inner">
        <span className="text-xs font-mono text-cyan-300 truncate font-semibold">
          http://localhost:3000/b/{formData.slug}
        </span>
        <button
          type="button"
          onClick={onCopyLink}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          title="Copy Public Link"
        >
          {copiedLink ? (
            <span className="text-[10px] font-bold text-emerald-400">Copied!</span>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Quick Launch Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/b/${formData.slug}`}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/25 active:scale-95 inline-flex items-center justify-center gap-2"
        >
          <span>View Public Clinic Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 active:scale-95 inline-flex items-center justify-center gap-2"
        >
          <span>Open Surgery Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
