'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { OnboardingClinicData } from './types';

interface Step3ProtocolsDepositsProps {
  formData: OnboardingClinicData;
  onChange: (data: Partial<OnboardingClinicData>) => void;
}

export function Step3ProtocolsDeposits({
  formData,
  onChange,
}: Step3ProtocolsDepositsProps) {
  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 3 of 4: Deposit &amp; No-Show Policy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Eliminate clinic no-shows
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Stripe-connected deposit capture guarantees serious commitments and covers room preparation costs.
        </p>
      </div>

      <div className="space-y-5 pt-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Required Prepaid Deposit Tier
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {[25, 50, 75, 100].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange({ depositAmount: amt })}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  formData.depositAmount === amt
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className="block text-lg font-black tracking-tight">${amt}</span>
                <span className="text-[10px] font-bold uppercase opacity-80">Per Patient</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Full Deposit Refund Cutoff Window
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { hrs: 12, label: '12 Hours Notice' },
              { hrs: 24, label: '24 Hours (Standard)' },
              { hrs: 48, label: '48 Hours (High Value)' },
            ].map((item) => (
              <button
                key={item.hrs}
                type="button"
                onClick={() => onChange({ cancellationCutoffHours: item.hrs })}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  formData.cancellationCutoffHours === item.hrs
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className="block text-xs font-black">{item.label}</span>
                <span className="text-[10px] text-slate-400 opacity-80 block mt-0.5">
                  Auto refund via Stripe
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3 text-xs text-cyan-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>HIPAA &amp; GDPR Compliant:</strong> Patient medical records remain encrypted in local memory. Only essential billing tokens and calendar invitations are exchanged across PCI-DSS Tier 1 networks.
          </p>
        </div>
      </div>
    </div>
  );
}
