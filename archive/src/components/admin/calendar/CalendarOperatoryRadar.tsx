'use client';

import React from 'react';

export function CalendarOperatoryRadar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs">
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
          <div>
            <span className="font-bold text-slate-900 block">Operatory 1: Dr. Leyla Mammadova</span>
            <span className="text-[11px] text-brand-700">In Surgery · Laser Teeth Whitening (Emma R.)</span>
          </div>
        </div>
        <span className="font-mono text-[10px] font-extrabold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
          Occupied
        </span>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <div>
            <span className="font-bold text-slate-900 block">Operatory 2: Dr. Rashad Aliyev</span>
            <span className="text-[11px] text-emerald-700">Autoclave &amp; UV-C Purified · Ready for Patient</span>
          </div>
        </div>
        <span className="font-mono text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          Sterile &amp; Ready
        </span>
      </div>
    </div>
  );
}
