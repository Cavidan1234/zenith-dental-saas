'use client';

import React from 'react';
import { Compass, Info } from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';

export function ContactMapCard() {
  return (
    <BlurReveal
      direction="right"
      delay={120}
      blur={14}
      distance={28}
      className="lg:col-span-6 flex flex-col h-full min-h-0"
    >
      <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white flex flex-col justify-between">
        {/* Map Architectural Top Banner */}
        <div className="p-3.5 sm:p-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-3 z-10 shrink-0">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              Zenith Dental Harley Street Studio
            </h4>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-normal mt-0.5">
              Google Maps Verified Location · Marylebone, London
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=42+Harley+Street+London+W1G+9PR"
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative overflow-hidden px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 hover:bg-brand-600 text-white shadow-2xs hover:shadow-md hover:shadow-brand-500/30 hover:ring-2 hover:ring-brand-400/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1.5 shrink-0 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-500 before:ease-out"
          >
            <Compass className="w-3.5 h-3.5 relative z-10 transition-transform duration-500 ease-out group-hover/btn:rotate-90 group-hover/btn:scale-110" />
            <span className="relative z-10">Open in Maps</span>
          </a>
        </div>

        {/* Google Maps Responsive Embed */}
        <div className="relative flex-1 w-full min-h-[220px] bg-slate-100">
          <iframe
            title="Zenith Dental Harley Street Location"
            src="https://maps.google.com/maps?q=42+Harley+Street,+London+W1G+9PR&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Clean Parking Info Footer */}
        <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-700 font-medium z-10 shrink-0">
          <Info className="w-4 h-4 text-brand-600 shrink-0" />
          <span className="text-[11.5px] sm:text-xs text-slate-600">
            Convenient underground parking available nearby · <strong className="text-slate-800 font-semibold">Q-Park Cavendish Square</strong> (2 min walk)
          </span>
        </div>
      </div>
    </BlurReveal>
  );
}
