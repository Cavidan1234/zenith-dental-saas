'use client';

import React from 'react';
import type { PracticeSettings } from '@/components/admin/PracticeSettingsModal';

interface PracticeBufferAndFinancialSectionProps {
  draftSettings: PracticeSettings;
  setDraftSettings: React.Dispatch<React.SetStateAction<PracticeSettings>>;
}

export function PracticeBufferAndFinancialSection({
  draftSettings,
  setDraftSettings,
}: PracticeBufferAndFinancialSectionProps) {
  return (
    <>
      {/* Section 2: Clinical Protocols & Buffer */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Surgery Disinfection &amp; Turn-around Buffer
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-800">Chair Turnaround Disinfection Interval</p>
              <p className="text-[11px] text-slate-500">
                Sanitization and sterile tray replenishment buffer automatically reserved after every patient.
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200/60">
              {draftSettings.bufferMinutes} min buffer
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDraftSettings((prev) => ({ ...prev, bufferMinutes: mins }))}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                  draftSettings.bufferMinutes === mins
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Financial Protection & Deposit */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Financial Protection &amp; Cancellation Rules
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mandatory Deposit */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Booking Deposit</span>
              <span className="text-xs font-bold text-emerald-600">${draftSettings.depositAmount}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Prepaid deposit required from new patients to secure clinical surgery slots.
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[25, 50, 75, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDraftSettings((prev) => ({ ...prev, depositAmount: amt }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                    draftSettings.depositAmount === amt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Cancellation Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Cancellation Cutoff</span>
              <span className="text-xs font-bold text-amber-600">{draftSettings.cancellationWindowHours}h window</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Minimum advance notice window required for full deposit refund or reschedule.
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[12, 24, 48].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDraftSettings((prev) => ({ ...prev, cancellationWindowHours: hrs }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                    draftSettings.cancellationWindowHours === hrs
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Automated 6-Month Recall Cycle */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Automated Preventive Hygiene Cadence
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-800">Routine Prophylaxis &amp; Recall Notice Interval</p>
              <p className="text-[11px] text-slate-500">
                Default timer after completed treatments before the patient enters the Recall Radar.
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-bold text-xs border border-cyan-200/60">
              {draftSettings.recallIntervalDays} Days
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { days: 90, label: '3 Months (Perio)' },
              { days: 180, label: '6 Months (Standard)' },
              { days: 365, label: '12 Months (Annual)' },
            ].map((item) => (
              <button
                key={item.days}
                type="button"
                onClick={() => setDraftSettings((prev) => ({ ...prev, recallIntervalDays: item.days }))}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                  draftSettings.recallIntervalDays === item.days
                    ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
