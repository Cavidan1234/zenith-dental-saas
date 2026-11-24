'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { Period, PeriodStats } from './analyticsPeriods';

interface AnalyticsChartsSectionProps {
  period: Period;
  periodStats: PeriodStats;
}

export function AnalyticsChartsSection({ period, periodStats }: AnalyticsChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dynamic Bar Chart (2 cols) */}
      <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Deposit &amp; Surgery Volume Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prepaid deposits collected during {period.replace('_', ' ')}
            </p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {periodStats.label}
          </span>
        </div>

        {/* Interactive Bar Visualization */}
        <div className="pt-4 pb-2">
          <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 pb-3">
            {periodStats.chartBars.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-10">
                  {item.full}: ${item.amount.toLocaleString()} ({item.appts} visits)
                </div>

                <div className="w-full flex justify-center items-end h-36">
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[42px] rounded-xl bg-gradient-to-t from-brand-600 to-blue-500 group-hover:from-brand-500 group-hover:to-blue-400 transition-all duration-300 shadow-2xs"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-brand-600 transition-colors">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specialist Chair Utilization (1 col) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Chair Utilization by Doctor</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time surgery occupancy vs operational capacity
          </p>
        </div>

        <div className="space-y-5 my-auto">
          {/* Doctor 1: Dr. Leyla */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Dr. Leyla Mammadova</span>
                <span className="text-[11px] text-slate-500">Suite A · Aesthetics &amp; Aligners</span>
              </div>
              <span className="font-mono font-extrabold text-brand-600 text-sm">91.2%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: '91.2%' }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block text-right">
              {periodStats.doctorLeylaHours}
            </span>
          </div>

          {/* Doctor 2: Dr. Rashad */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Dr. Rashad Aliyev</span>
                <span className="text-[11px] text-slate-500">Suite B · 3D Implants &amp; Surgery</span>
              </div>
              <span className="font-mono font-extrabold text-blue-600 text-sm">86.4%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: '86.4%' }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block text-right">
              {periodStats.doctorRashadHours}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Both suites operating at peak Tier-1 clinical efficiency.</span>
        </div>
      </div>
    </div>
  );
}
