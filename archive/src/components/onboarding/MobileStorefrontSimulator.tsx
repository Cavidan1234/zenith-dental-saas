'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import { OnboardingClinicData, ThemeOption } from './types';

interface MobileStorefrontSimulatorProps {
  formData: OnboardingClinicData;
  currentTheme: ThemeOption;
}

export function MobileStorefrontSimulator({
  formData,
  currentTheme,
}: MobileStorefrontSimulatorProps) {
  return (
    <div className="lg:col-span-5 flex flex-col items-center">
      <div className="w-full max-w-[340px] bg-slate-900 border-4 border-slate-800 rounded-[44px] p-3 shadow-2xl relative overflow-hidden ring-1 ring-slate-700/50">
        {/* Phone Speaker Notch */}
        <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
          <div className="w-2 h-2 bg-slate-800 rounded-full" />
        </div>

        {/* Simulated Mobile Screen */}
        <div className="rounded-[32px] overflow-hidden bg-white text-slate-900 flex flex-col min-h-[540px] border border-slate-100 shadow-inner">
          {/* Mobile Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ZenithLogo size={24} />
              <span className="text-xs font-black truncate max-w-[150px]">
                {formData.clinicName}
              </span>
            </div>
            <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-full">
              {formData.currency.split(' ')[0]}
            </span>
          </div>

          {/* Hero preview */}
          <div
            className={`p-5 bg-gradient-to-br ${currentTheme.gradient} text-white space-y-3 relative overflow-hidden`}
          >
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded-full inline-block">
              Concierge Dentistry
            </span>
            <h3 className="text-base font-black leading-tight tracking-tight">
              Precision Oral Surgery &amp; Esthetics
            </h3>
            <p className="text-[10px] text-white/80 leading-relaxed line-clamp-2">
              {formData.address}, {formData.city}
            </p>

            <div className="pt-1">
              <span className="w-full py-2 rounded-full text-[10px] font-extrabold text-slate-950 bg-white text-center block shadow-xs">
                Book Visit • ${formData.depositAmount} Deposit
              </span>
            </div>
          </div>

          {/* Doctor preview */}
          <div className="p-4 space-y-3 bg-slate-50 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Our Surgery Specialists
            </span>
            <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  {formData.primaryDoctorName}
                </h4>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Available
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {formData.primaryDoctorTitle}
              </p>
              <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                <span>Room Buffer: +{formData.bufferMinutes}m</span>
                <span className="font-bold text-brand-600">View Slots &rarr;</span>
              </div>
            </div>

            {/* Guarantee card */}
            <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/60 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-900 font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                <span>Zero-Wait Guarantee</span>
              </div>
              <p className="text-[9px] text-cyan-800 leading-relaxed">
                Sterilization buffer maintained between all appointments.
              </p>
            </div>
          </div>

          {/* Phone Bottom Footer */}
          <div className="p-3 bg-white border-t border-slate-200 text-center">
            <span className="text-[9px] font-mono text-slate-400">
              Powered by DentalBook.os
            </span>
          </div>
        </div>

        {/* Bottom Home Indicator bar */}
        <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
      </div>

      <p className="text-[11px] font-mono text-slate-500 mt-3 text-center">
        Real-time Mobile Viewport Simulator
      </p>
    </div>
  );
}
