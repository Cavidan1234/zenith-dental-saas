'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Check } from 'lucide-react';

interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  procedure?: string;
}

export function BeforeAfterSlider({
  beforeLabel = 'Before Treatment',
  afterLabel = 'After Ceramic Smile Rejuvenation',
  title = 'Case Study: Full Arch Aesthetic Restoration',
  procedure = '8 Minimal-Prep Handcrafted Porcelain Veneers',
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-3 h-3 mr-1 text-brand-400" /> Verified Clinical Transformation
            </span>
            <h4 className="text-white text-sm font-bold">{title}</h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{procedure}</p>
        </div>
        <div className="text-xs font-semibold text-brand-300 bg-brand-950/80 px-3.5 py-1.5 rounded-full border border-brand-800">
          ↔ Drag slider horizontally to compare
        </div>
      </div>

      {/* Interactive Slider Area */}
      <div
        ref={containerRef}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative h-[340px] sm:h-[400px] select-none cursor-ew-resize overflow-hidden bg-slate-950"
      >
        {/* "After" Visual (Background) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-brand-950">
          <div className="text-center p-8">
            <div className="w-28 h-28 mx-auto mb-4 rounded-3xl bg-brand-600/20 border-2 border-brand-400/60 flex items-center justify-center shadow-blue-glow">
              <span className="text-4xl">✨</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              BL2 Bleach Shade · Natural Enamel Translucency
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Aesthetic Smile Harmony Restored
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              Hand-layered feldspathic porcelain veneers. Corrected severe discoloration and worn incisal edges with biological preservation.
            </p>
          </div>
          <div className="absolute top-4 right-4 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            {afterLabel}
          </div>
        </div>

        {/* "Before" Visual (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 w-[896px] max-w-none flex items-center justify-center bg-gradient-to-tr from-stone-950 via-neutral-900 to-amber-950/40">
            <div className="text-center p-8">
              <div className="w-28 h-28 mx-auto mb-4 rounded-3xl bg-neutral-800/80 border-2 border-neutral-700 flex items-center justify-center">
                <span className="text-4xl">🦷</span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                Severe Enamel Wear & Crowding
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-300 tracking-tight">
                Initial Patient Condition
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
                Heavy intrinsic discoloration, uneven gum line, chipped front teeth, and compromised aesthetic smile corridor.
              </p>
            </div>
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-700">
              {beforeLabel}
            </div>
          </div>
        </div>

        {/* Vertical Divider Line with Draggable Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(255,255,255,0.9)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-600 text-white shadow-xl flex items-center justify-center border-2 border-white hover:scale-110 transition-transform">
            <svg
              className="w-4 h-4 text-white"
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

      {/* Bottom Info Bar */}
      <div className="px-6 py-4 bg-slate-950 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
        <span className="text-slate-400 font-semibold">Clinician: Dr. Leyla Mammadova (BDS, MSc London)</span>
        <span className="text-brand-300 font-bold">Treatment Time: 2 Visits (10 Days total)</span>
      </div>
    </div>
  );
}
