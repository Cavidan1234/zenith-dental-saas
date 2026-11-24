'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Calendar, ChevronRight, Award, ShieldCheck } from 'lucide-react';
import { playHapticTick } from '@/lib/soundscapes';
import { CLINICAL_CASES, ClinicalCase } from './gallery/clinicalCases';

interface SmileTransformationGalleryProps {
  onBookProcedure?: (serviceId: string, doctorId: string) => void;
}

export function SmileTransformationGallery({
  onBookProcedure,
}: SmileTransformationGalleryProps) {
  const [activeCaseId, setActiveCaseId] = useState<string>('veneers');
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const activeCase = CLINICAL_CASES.find((c) => c.id === activeCaseId) || CLINICAL_CASES[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = (clampedX / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <section id="transformations" className="py-20 relative overflow-hidden bg-slate-950 text-white">
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>[ 04 // VERIFIED CLINICAL OUTCOMES · HARLEY STREET ARCHIVE ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Real Transformations,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-sky-200 to-blue-300">
              Preserved Biology
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Drag the split-slider to inspect patient before-and-after cases documented under high-resolution clinical polarized illumination.
          </p>

          {/* Interactive Case Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {CLINICAL_CASES.map((c) => {
              const isActive = c.id === activeCaseId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    playHapticTick();
                    setActiveCaseId(c.id);
                    setSliderPosition(50);
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 border border-brand-400'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Award className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{c.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Comparison Showcase Card */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {/* Card Top Meta Bar */}
          <div className="px-6 py-4 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400 block">
                {activeCase.category}
              </span>
              <h3 className="text-white text-base sm:text-lg font-black tracking-tight">
                {activeCase.title}
              </h3>
              <p className="text-xs text-slate-400">{activeCase.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <span>↔ Drag divider left or right</span>
            </div>
          </div>

          {/* Split Comparison Canvas */}
          <div
            ref={containerRef}
            onMouseDown={() => (isDragging.current = true)}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[360px] sm:h-[420px] select-none cursor-ew-resize overflow-hidden bg-slate-950"
          >
            {/* "AFTER" VISUAL (Full width background) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-brand-950/60 p-6 sm:p-10">
              <div className="text-center max-w-lg">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-3xl bg-brand-600/20 border-2 border-brand-400/50 flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <span className="text-3xl sm:text-4xl">✨</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Achieved: {activeCase.shadeAfter}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeCase.afterHeadline}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {activeCase.afterDescription}
                </p>
              </div>

              {/* Tag indicator */}
              <div className="absolute top-4 right-4 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-sm">
                AFTER TREATMENT
              </div>
            </div>

            {/* "BEFORE" VISUAL (Clipped Overlay with Dynamic Width) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-[896px] max-w-none flex items-center justify-center bg-gradient-to-tr from-stone-950 via-neutral-900 to-amber-950/30 p-6 sm:p-10">
                <div className="text-center max-w-lg">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-3xl bg-neutral-800/80 border-2 border-neutral-700 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl">🦷</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
                    <span>Pre-Op Assessment: {activeCase.shadeBefore}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-neutral-200 tracking-tight">
                    {activeCase.beforeHeadline}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                    {activeCase.beforeDescription}
                  </p>
                </div>

                {/* Tag indicator */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-slate-700 shadow-sm">
                  BEFORE TREATMENT
                </div>
              </div>
            </div>

            {/* Vertical Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(255,255,255,1)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-brand-600 text-white shadow-2xl flex items-center justify-center border-2 border-white hover:scale-110 active:scale-95 transition-transform duration-150">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 9l-4 3 4 3m8-6l4 3-4 3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card Bottom Action Bar */}
          <div className="p-5 sm:p-6 bg-slate-950 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{activeCase.doctor}</span>
                <span>·</span>
                <span className="text-brand-300 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeCase.duration}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Prepaid deposit: ${activeCase.depositCents / 100} USD · Refundable up to 24h prior
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onBookProcedure) {
                  onBookProcedure(activeCase.serviceId, activeCase.doctorId);
                }
              }}
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 active:scale-95 shadow-md shadow-brand-600/30 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>Book Consultation for this Transformation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
