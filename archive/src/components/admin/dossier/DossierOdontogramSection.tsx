'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export type ToothState = 'sound' | 'restored' | 'surgical' | 'watch';

interface DossierOdontogramSectionProps {
  odontogram: Record<number, ToothState>;
  selectedTooth: number | null;
  onToggleTooth: (toothNumber: number) => void;
  onSetToothState: (toothNumber: number, state: ToothState) => void;
}

export function DossierOdontogramSection({
  odontogram,
  selectedTooth,
  onToggleTooth,
  onSetToothState,
}: DossierOdontogramSectionProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Clinical Odontogram (32-Tooth Chart)
            </h4>
            <p className="text-[10px] text-slate-400">
              Interactive arch mapping for restorative &amp; surgical tracking
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          Universal System
        </span>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center gap-2.5 text-[10px] pt-1 pb-1 border-y border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
          <span className="text-slate-600 font-medium">Sound (Intact)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shadow-xs" />
          <span className="text-brand-700 font-bold">Veneer / Crown</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
          <span className="text-emerald-700 font-bold">Implant / Surgical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-700 font-bold">Watch / Sensitivity</span>
        </div>
      </div>

      {/* Upper Maxillary Arch (1-16) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Maxilla (Upper Arch)</span>
          <span className="font-mono">R 1 ──────── 16 L</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => {
            const state = odontogram[num] || 'sound';
            const isSelected = selectedTooth === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onToggleTooth(num)}
                title={`Tooth #${num}: ${state.toUpperCase()} (Click to cycle)`}
                className={`h-9 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer font-mono font-bold text-[10px] relative border ${
                  isSelected ? 'ring-2 ring-brand-500 ring-offset-1 z-10' : ''
                } ${
                  state === 'restored'
                    ? 'bg-brand-600 text-white border-brand-700 shadow-xs'
                    : state === 'surgical'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : state === 'watch'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 font-black shadow-xs animate-pulse'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lower Mandibular Arch (17-32) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Mandible (Lower Arch)</span>
          <span className="font-mono">L 17 ──────── 32 R</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
          {[17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32].map((num) => {
            const state = odontogram[num] || 'sound';
            const isSelected = selectedTooth === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onToggleTooth(num)}
                title={`Tooth #${num}: ${state.toUpperCase()} (Click to cycle)`}
                className={`h-9 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer font-mono font-bold text-[10px] relative border ${
                  isSelected ? 'ring-2 ring-brand-500 ring-offset-1 z-10' : ''
                } ${
                  state === 'restored'
                    ? 'bg-brand-600 text-white border-brand-700 shadow-xs'
                    : state === 'surgical'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : state === 'watch'
                    ? 'bg-amber-400 text-amber-950 border-amber-500 font-black shadow-xs animate-pulse'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Inspector for Clicked Tooth */}
      {selectedTooth && (
        <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs animate-fade-in">
          <span className="font-bold text-slate-800">
            Tooth #{selectedTooth}:{' '}
            <span className="uppercase text-brand-600 font-mono">
              {odontogram[selectedTooth] || 'sound'}
            </span>
          </span>

          <div className="flex items-center gap-1">
            {(['sound', 'restored', 'surgical', 'watch'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onSetToothState(selectedTooth, st)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  odontogram[selectedTooth] === st
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
