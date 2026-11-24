'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { OnboardingClinicData, ThemeOption } from './types';

interface Step4BrandAestheticsProps {
  formData: OnboardingClinicData;
  themes: ThemeOption[];
  onSelectTheme: (themeId: 'azure' | 'obsidian' | 'nordic' | 'emerald') => void;
}

export function Step4BrandAesthetics({
  formData,
  themes,
  onSelectTheme,
}: Step4BrandAestheticsProps) {
  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 4 of 4: Studio Brand Aesthetics</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Select your visual identity
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Designed to international Awwwards standards. No generic AI templates.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {themes.map((theme) => {
          const isSelected = formData.theme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-cyan-400 bg-slate-950 shadow-md shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} shadow-md flex items-center justify-center text-white font-bold text-xs`}
                >
                  ✓
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">{theme.name}</span>
                  <span className="text-xs text-slate-400">{theme.desc}</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${theme.badge}`}
              >
                {isSelected ? 'Active Selection' : 'Select'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
