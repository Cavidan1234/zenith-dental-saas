'use client';

import React from 'react';
import { PeriodStats } from './analyticsPeriods';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface AnalyticsKpiCardsProps {
  periodStats: PeriodStats;
}

export function AnalyticsKpiCards({ periodStats }: AnalyticsKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Deposit Volume */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2 transition-all hover:shadow-hover hover:border-brand-200 hover:-translate-y-0.5 duration-200">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Deposit Volume
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            <AnimatedNumber value={periodStats.depositNum} prefix="$" duration={900} />
          </span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {periodStats.depositGrowth}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">{periodStats.surgeriesText}</p>
      </div>

      {/* No-Show Mitigation */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2 transition-all hover:shadow-hover hover:border-emerald-200 hover:-translate-y-0.5 duration-200">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          No-Show Mitigation
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-emerald-600 tracking-tight">
            <AnimatedNumber value={periodStats.noShowNum} suffix="%" decimals={1} duration={800} />
          </span>
          <span className="text-xs font-bold text-slate-400 line-through">22% avg</span>
        </div>
        <p className="text-[11px] text-slate-400">{periodStats.noShowRecovered}</p>
      </div>

      {/* Average Surgery Yield */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2 transition-all hover:shadow-hover hover:border-brand-200 hover:-translate-y-0.5 duration-200">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Average Surgery Yield
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-600 tracking-tight">
            <AnimatedNumber value={periodStats.yieldNum} prefix="$" decimals={2} duration={850} />
          </span>
          <span className="text-[11px] text-slate-400 font-medium">/ hour</span>
        </div>
        <p className="text-[11px] text-slate-400">Optimized with 15m room sterilization</p>
      </div>

      {/* 6-Month Recall Efficiency */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2 transition-all hover:shadow-hover hover:border-amber-200 hover:-translate-y-0.5 duration-200">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          6-Month Recall Efficiency
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-amber-600 tracking-tight">
            <AnimatedNumber value={periodStats.recallNum} suffix="%" decimals={1} duration={800} />
          </span>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
            High Retention
          </span>
        </div>
        <p className="text-[11px] text-slate-400">Patients returning within 180 days</p>
      </div>
    </div>
  );
}
