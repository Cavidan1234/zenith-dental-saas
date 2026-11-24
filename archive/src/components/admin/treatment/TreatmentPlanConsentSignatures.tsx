'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface TreatmentPlanConsentSignaturesProps {
  patientName: string;
  doctor: string;
}

export function TreatmentPlanConsentSignatures({
  patientName,
  doctor,
}: TreatmentPlanConsentSignaturesProps) {
  return (
    <div className="pt-4 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
          Patient Informed Consent
        </span>
        <p className="text-[11px] text-slate-500 leading-snug">
          I confirm that the clinical findings, procedure alternatives, and associated financial investments have been fully explained to my satisfaction.
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="font-serif italic text-base font-bold text-brand-900">
            {patientName}
          </div>
          <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Electronically Signed &amp; Accepted</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
          Clinician Verification &amp; Stamp
        </span>
        <p className="text-[11px] text-slate-500 leading-snug">
          Certified by Lead Clinician in accordance with British Dental Association (BDA) and GDC Good Medical Practice guidelines.
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="font-serif italic text-base font-bold text-slate-900">
            {doctor}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            GDC Registration #289410 · 14 Harley St.
          </div>
        </div>
      </div>
    </div>
  );
}
