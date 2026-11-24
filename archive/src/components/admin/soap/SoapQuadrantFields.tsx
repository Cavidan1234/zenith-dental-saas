'use client';

import React from 'react';
import { SoapNoteData } from './soapPresets';

interface SoapQuadrantFieldsProps {
  soapData: SoapNoteData;
  onChange: (updated: Partial<SoapNoteData>) => void;
}

export function SoapQuadrantFields({ soapData, onChange }: SoapQuadrantFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Subjective */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-brand-100 text-brand-700 text-[11px] font-mono flex items-center justify-center font-black">
              S
            </span>
            Subjective (Patient Chief Complaint &amp; History)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Patient Symptoms</span>
        </div>
        <textarea
          rows={2}
          value={soapData.subjective}
          onChange={(e) => onChange({ subjective: e.target.value })}
          className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Objective */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[11px] font-mono flex items-center justify-center font-black">
              O
            </span>
            Objective (Clinical Findings, Odontogram &amp; Imaging)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Loupes &amp; Panorex</span>
        </div>
        <textarea
          rows={3}
          value={soapData.objective}
          onChange={(e) => onChange({ objective: e.target.value })}
          className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Assessment */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-mono flex items-center justify-center font-black">
              A
            </span>
            Assessment (Diagnosis &amp; Prognosis)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">ICD-10 Diagnostic</span>
        </div>
        <textarea
          rows={2}
          value={soapData.assessment}
          onChange={(e) => onChange({ assessment: e.target.value })}
          className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Plan */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-mono flex items-center justify-center font-black">
              P
            </span>
            Plan &amp; Procedures Performed
          </span>
          <span className="text-[10px] text-slate-400 font-mono">CDT Coding &amp; Rx</span>
        </div>
        <textarea
          rows={3}
          value={soapData.plan}
          onChange={(e) => onChange({ plan: e.target.value })}
          className="w-full p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
