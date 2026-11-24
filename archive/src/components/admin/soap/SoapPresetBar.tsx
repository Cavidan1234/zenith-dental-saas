'use client';

import React from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { CLINICAL_PRESETS } from './soapPresets';

interface SoapPresetBarProps {
  isSynthesizing: boolean;
  onSynthesize: () => void;
  selectedPreset: string;
  onSelectPreset: (id: string) => void;
}

export function SoapPresetBar({
  isSynthesizing,
  onSynthesize,
  selectedPreset,
  onSelectPreset,
}: SoapPresetBarProps) {
  return (
    <>
      {/* Quick AI Synthesis Trigger Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-indigo-50/50 to-sky-50 border border-brand-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-brand-950 block">
              Autopilot Clinical Synthesis
            </span>
            <span className="text-[11px] text-brand-700">
              Synthesize SOAP record from Odontogram teeth, Panorex imaging &amp; Pre-Op triage.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSynthesize}
          disabled={isSynthesizing}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
          <span>{isSynthesizing ? 'Synthesizing...' : '1-Click Chart Synthesis'}</span>
        </button>
      </div>

      {/* Clinical Specialty Preset Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Standard Clinical Procedure Presets
          </label>
          <span className="text-[10px] text-slate-400 font-mono">ICD-10 / CDT Linked</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {CLINICAL_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPreset === p.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-brand-400'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-[9px] font-mono uppercase tracking-wider block opacity-70">
                {p.category}
              </span>
              <span className="text-xs font-bold block truncate mt-0.5">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
