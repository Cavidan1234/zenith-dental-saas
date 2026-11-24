'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import { ClinicFooter } from '@/components/shared/ClinicFooter';

export default function TestFooterPage() {
  const [animationKey, setAnimationKey] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  const replayWithDirection = (dir: 'up' | 'down') => {
    setDirection(dir);
    setAnimationKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Top Test Navigation Bar */}
      <header className="h-[66px] border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/b/zenith-dental"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Zenith Dental</span>
          </Link>
          <span className="h-4 w-[1px] bg-slate-200" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Footer Animations Lab
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Direction Toggle 1: Aşağıdan Yuxarıya (Recommended) */}
          <button
            onClick={() => replayWithDirection('up')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
              direction === 'up'
                ? 'bg-blue-600 text-white ring-2 ring-blue-500/20 shadow-blue-500/25'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Aşağıdan Yuxarıya (Məsləhət)</span>
          </button>

          {/* Direction Toggle 2: Yuxarıdan Aşağıya */}
          <button
            onClick={() => replayWithDirection('down')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
              direction === 'down'
                ? 'bg-blue-600 text-white ring-2 ring-blue-500/20 shadow-blue-500/25'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Yuxarıdan Aşağıya</span>
          </button>

          <span className="h-4 w-[1px] bg-slate-200 mx-1" />

          {/* Replay */}
          <button
            onClick={() => setAnimationKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </header>

      {/* Guide Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Giriş İstiqaməti: {direction === 'up' ? 'Aşağıdan Yuxarıya (Bottom-to-Top)' : 'Yuxarıdan Aşağıya (Top-to-Bottom)'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Soldan-sağa gecikmə ləğv edildi. Bütün sütunlar və alt hissə vahid şaquli (vertikal) monolit kimi sinxron şəkildə səhnəyə daxil olur.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>120 FPS Sinxron Vertikal Animasiya</span>
          </div>
        </div>
      </section>

      {/* Main Preview Container */}
      <main className="flex-1 flex flex-col justify-end mt-2">
        <ClinicFooter
          animationKey={animationKey}
          clinicSlug="zenith-dental"
          entranceDirection={direction}
        />
      </main>
    </div>
  );
}