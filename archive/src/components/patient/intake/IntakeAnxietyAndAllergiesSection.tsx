'use client';

import React from 'react';
import { COMMON_ALLERGIES } from './intakeConstants';

interface IntakeAnxietyAndAllergiesSectionProps {
  anxietyLevel: 'none' | 'mild' | 'moderate' | 'high';
  onSetAnxietyLevel: (lvl: 'none' | 'mild' | 'moderate' | 'high') => void;
  sedationRequested: boolean;
  onSetSedationRequested: (val: boolean) => void;
  selectedAllergies: string[];
  onToggleAllergy: (allergy: string) => void;
}

export function IntakeAnxietyAndAllergiesSection({
  anxietyLevel,
  onSetAnxietyLevel,
  sedationRequested,
  onSetSedationRequested,
  selectedAllergies,
  onToggleAllergy,
}: IntakeAnxietyAndAllergiesSectionProps) {
  return (
    <div className="space-y-5">
      {/* 1. Dental Anxiety Level */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
          1. Dental Anxiety Assessment
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'none' as const, label: 'None (Calm)', emoji: '😊' },
            { id: 'mild' as const, label: 'Mild', emoji: '🙂' },
            { id: 'moderate' as const, label: 'Moderate', emoji: '😬' },
            { id: 'high' as const, label: 'High (Nervous)', emoji: '😰' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSetAnxietyLevel(item.id)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                anxietyLevel === item.id
                  ? 'border-brand-600 bg-brand-50/80 text-brand-900 shadow-sm ring-2 ring-brand-300'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="text-lg block mb-0.5">{item.emoji}</span>
              <span className="text-[11px] font-bold block">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Sedation Checkbox */}
        <label className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/70 border border-purple-200 cursor-pointer">
          <input
            type="checkbox"
            checked={sedationRequested}
            onChange={(e) => onSetSedationRequested(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-purple-600 rounded border-purple-300 focus:ring-purple-500 cursor-pointer"
          />
          <div className="text-xs text-purple-950">
            <span className="font-extrabold block">Request Inhalation Sedation (Nitrous Oxide / Happy Gas)</span>
            <span className="text-[11px] text-purple-800 font-medium">
              Recommended for moderate-to-high anxiety. Rapid recovery, drive home immediately after.
            </span>
          </div>
        </label>
      </div>

      {/* 2. Known Allergies */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
          <span>2. Medical &amp; Pharmacological Allergies</span>
          <span className="text-[10px] text-slate-400 font-normal">Select all that apply</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_ALLERGIES.map((allergy) => {
            const isSelected = selectedAllergies.includes(allergy);
            return (
              <button
                key={allergy}
                type="button"
                onClick={() => onToggleAllergy(allergy)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? allergy === 'None'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-rose-50 text-rose-800 border-2 border-rose-300 shadow-2xs ring-1 ring-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {allergy === 'None' ? 'None (No Allergies)' : allergy}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
