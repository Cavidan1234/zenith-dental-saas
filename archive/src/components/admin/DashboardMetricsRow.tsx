'use client';

import React from 'react';
import { Calendar as CalendarIcon, DollarSign, TrendingUp, BellRing } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface DashboardMetricsRowProps {
  totalAppointmentsCount: number;
  totalDepositSum: number;
  occupancyRate?: number;
  recallQueueCount?: number;
}

export function DashboardMetricsRow({
  totalAppointmentsCount,
  totalDepositSum,
  occupancyRate = 88.5,
  recallQueueCount = 18,
}: DashboardMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Appointments */}
      <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-brand-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Total Appointments</span>
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <CalendarIcon className="w-4 h-4 text-brand-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            <AnimatedNumber value={totalAppointmentsCount} duration={1200} />
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            +18% this mo.
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          <span>Real-time patient bookings synced</span>
        </div>
      </div>

      {/* Card 2: Prepaid Deposit Volume */}
      <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Prepaid Deposit Volume</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            <AnimatedNumber value={totalDepositSum} prefix="$" duration={1400} />
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Google Pay &amp; Card Sandbox Live</span>
        </div>
      </div>

      {/* Card 3: Surgery Chair Occupancy */}
      <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>Surgery Chair Occupancy</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            <AnimatedNumber value={occupancyRate} suffix="%" decimals={1} duration={1000} />
          </span>
        </div>
        {/* Animated Occupancy Progress Line */}
        <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Card 4: 6-Month Recall Queue */}
      <div className="relative group overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-hover hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 card-shimmer-effect">
        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
          <span>6-Month Recall Queue</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <BellRing className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            <AnimatedNumber value={recallQueueCount} suffix=" Patients" duration={900} />
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>3 Reminders due for dispatch today</span>
        </div>
      </div>
    </div>
  );
}
