'use client';

import React from 'react';
import { ShieldCheck, Calendar, ArrowRight, Receipt } from 'lucide-react';
import { TreatmentOption, FinancingTerm } from './treatmentCalculatorData';
import { playLuxuryChime } from '@/lib/soundscapes';

interface TreatmentReceiptCardProps {
  selectedTreatment: TreatmentOption;
  qty: number;
  term: FinancingTerm;
  onBook: () => void;
  lang?: 'en' | 'az' | 'ru';
}

export function TreatmentReceiptCard({
  selectedTreatment,
  qty,
  term,
  onBook,
  lang = 'en',
}: TreatmentReceiptCardProps) {
  const total = selectedTreatment.basePrice * qty;
  const monthly = (total / term).toFixed(0);

  const handleBookClick = () => {
    playLuxuryChime();
    onBook();
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
      {/* Background ambient corner shine */}
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/15 pointer-events-none filter blur-2xl" />

      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              Official Estimate
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            0% APR Interest-Free
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="pt-4 space-y-3 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span>{selectedTreatment.name} ({qty} &times; &pound;{selectedTreatment.basePrice.toLocaleString()})</span>
            <span className="font-mono font-bold text-white">&pound;{total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>3D CBCT Diagnostic Scan</span>
            <span className="text-emerald-400 font-bold uppercase text-[10px]">Included (&pound;0)</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Sterilization &amp; Tray Setup</span>
            <span className="text-emerald-400 font-bold uppercase text-[10px]">Included (&pound;0)</span>
          </div>

          {/* Monthly Financing Highlight */}
          <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Monthly Repayment:</span>
              <span className="text-[11px] text-slate-500">Spread over {term} months</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-cyan-300 font-mono tracking-tight">
                &pound;{monthly}
              </span>
              <span className="text-xs text-slate-400 font-medium"> / mo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{selectedTreatment.warranty}</span>
        </div>

        <button
          type="button"
          onClick={handleBookClick}
          className="w-full py-4 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-400/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>
            {lang === 'az' ? 'Qəbula Yazılın' : lang === 'ru' ? 'Записаться на прием' : 'Book Consultation'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
