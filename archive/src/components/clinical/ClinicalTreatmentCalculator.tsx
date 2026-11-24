'use client';

import React, { useState } from 'react';
import { Calculator, Minus, Plus, Sparkles } from 'lucide-react';
import {
  TREATMENT_CALCULATOR_OPTIONS,
  FINANCING_TERMS,
  TreatmentOption,
  FinancingTerm,
} from './calculator/treatmentCalculatorData';
import { TreatmentReceiptCard } from './calculator/TreatmentReceiptCard';
import { playHapticTick } from '@/lib/soundscapes';

interface ClinicalTreatmentCalculatorProps {
  onOpenBooking: (serviceId?: string) => void;
  lang?: 'en' | 'az' | 'ru';
}

export function ClinicalTreatmentCalculator({
  onOpenBooking,
  lang = 'en',
}: ClinicalTreatmentCalculatorProps) {
  const [selectedId, setSelectedId] = useState<string>('veneers');
  const [qty, setQty] = useState<number>(4);
  const [term, setTerm] = useState<FinancingTerm>(24);

  const selectedTreatment: TreatmentOption =
    TREATMENT_CALCULATOR_OPTIONS.find((t) => t.id === selectedId) ||
    TREATMENT_CALCULATOR_OPTIONS[0];

  const handleSelectTreatment = (option: TreatmentOption) => {
    playHapticTick();
    setSelectedId(option.id);
    setQty(option.defaultQty);
  };

  const handleStep = (delta: number) => {
    playHapticTick();
    setQty((prev) => Math.max(selectedTreatment.minQty, Math.min(selectedTreatment.maxQty, prev + delta)));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQty(parseInt(e.target.value, 10));
  };

  const handleTermChange = (newTerm: FinancingTerm) => {
    playHapticTick();
    setTerm(newTerm);
  };

  return (
    <section
      id="calculator"
      className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200/90 relative z-10"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-cyan-600" />
            <span>
              {lang === 'az' ? '[ 03 // ŞƏFFAF QİYMƏT KALKULYATORU ]' : lang === 'ru' ? '[ 03 // КАЛЬКУЛЯТОР СТОИМОСТИ ]' : '[ 03 // TRANSPARENT TREATMENT FINANCING ]'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'az' ? 'Müalicənizi və Hissə-Hissə Ödənişi Hesablayın' : lang === 'ru' ? 'Рассчитайте план лечения и рассрочку' : 'Calculate Your Custom Smile & 0% APR Plan'}
          </h2>
          <p className="text-sm text-slate-600">
            {lang === 'az'
              ? 'Heç bir gizli ödəniş yoxdur. Diaqnostik 3D CBCT skan və sterilizasiya xidmətə daxildir.'
              : lang === 'ru'
              ? 'Без скрытых комиссий. Диагностика 3D CBCT и стерилизация включены в стоимость.'
              : 'Zero hidden fees. Full 3D intraoral diagnostics and sterilization included upfront.'}
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-7">
            {/* 1. Visual Radio Tabs */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Select Clinical Procedure
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TREATMENT_CALCULATOR_OPTIONS.map((opt) => {
                  const isSelected = opt.id === selectedId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectTreatment(opt)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-cyan-400/30'
                          : 'bg-slate-50/80 hover:bg-slate-100/80 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold leading-tight block">{opt.name}</span>
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          isSelected ? 'text-cyan-300' : 'text-slate-500'
                        }`}
                      >
                        &pound;{opt.basePrice.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Dual Stepper & Range Slider Control */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Quantity ({selectedTreatment.unitLabel})
                </span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {qty} {selectedTreatment.unitLabel.toLowerCase()}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={qty <= selectedTreatment.minQty}
                  onClick={() => handleStep(-1)}
                  className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min={selectedTreatment.minQty}
                  max={selectedTreatment.maxQty}
                  value={qty}
                  onChange={handleSliderChange}
                  className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />

                <button
                  type="button"
                  disabled={qty >= selectedTreatment.maxQty}
                  onClick={() => handleStep(1)}
                  className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-800 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Financing Term Pills */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                3. Repayment Horizon (0% Interest-Free)
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {FINANCING_TERMS.map((t) => {
                  const isSelected = term === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTermChange(t)}
                      className={`py-3 px-4 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                        isSelected
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-black ring-2 ring-cyan-400/20 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {t} Months (0%)
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Estimate Receipt Column (5 cols) */}
          <div className="lg:col-span-5">
            <TreatmentReceiptCard
              selectedTreatment={selectedTreatment}
              qty={qty}
              term={term}
              onBook={() => onOpenBooking(selectedTreatment.id)}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
