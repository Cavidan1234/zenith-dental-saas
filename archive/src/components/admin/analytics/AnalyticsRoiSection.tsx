'use client';

import React from 'react';
import { PieChart, ShieldCheck } from 'lucide-react';
import { PeriodStats } from './analyticsPeriods';

interface AnalyticsRoiSectionProps {
  periodStats: PeriodStats;
}

export function AnalyticsRoiSection({ periodStats }: AnalyticsRoiSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Treatment Contribution Matrix */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Treatment Revenue Contribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Volume &amp; revenue share by clinical category</p>
          </div>
          <PieChart className="w-4 h-4 text-slate-400" />
        </div>

        <div className="space-y-3 pt-2">
          {[
            { label: 'Porcelain Veneer Smile Design', share: '38%', rev: '$3,400', count: '14 visits', color: 'bg-brand-500' },
            { label: 'Dental Implant Consultation & 3D CBCT', share: '23%', rev: '$2,100', count: '8 visits', color: 'bg-blue-500' },
            { label: 'Laser Teeth Whitening (In-Office)', share: '21%', rev: '$1,850', count: '16 visits', color: 'bg-emerald-500' },
            { label: 'Comprehensive 3D Exam & Prophylaxis', share: '18%', rev: '$1,600', count: '24 visits', color: 'bg-amber-500' },
          ].map((proc, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${proc.color} shrink-0`} />
                <div>
                  <span className="font-bold text-slate-900 block">{proc.label}</span>
                  <span className="text-[11px] text-slate-400">{proc.count}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-900">{proc.rev}</span>
                <span className="text-[11px] text-slate-500 block font-mono">{proc.share}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No-Show Mitigation Architecture */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white shadow-2xs space-y-5 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Financial Protection System</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Prepaid Deposit Impact: {periodStats.noShowRecovered.replace(' in lost chair time', '')}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            Traditional dental practices lose an average of 22% of revenue to same-day no-shows. By requiring an upfront prepaid deposit, DentalBook achieves a 98.2% attendance rate.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Before DentalBook</span>
            <span className="text-xl font-black text-rose-400">22% Missed</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">~$3,400 monthly loss</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
            <span className="text-emerald-300 text-[10px] font-bold uppercase block mb-1">With $50 Deposit</span>
            <span className="text-xl font-black text-emerald-400">98.2% Show</span>
            <span className="text-[10px] text-emerald-200 block mt-0.5">Zero empty chairs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
