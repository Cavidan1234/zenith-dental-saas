'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface PassPreOpChecklistProps {
  service: string;
}

export function PassPreOpChecklist({ service }: PassPreOpChecklistProps) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Clinical Pre-Op Preparation Guidelines</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">Harley St. Protocols</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
        <div className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-brand-400 font-bold shrink-0">1.</span>
          <span>
            {service.includes('Whitening')
              ? '48h White Diet: Avoid black coffee, tea, red wine & dark berries prior to visit.'
              : service.includes('Implant')
              ? 'Fasting Advisory: If sedation requested, avoid solid food 2h before consultation.'
              : 'Smile Wishlist: Bring reference photos or desired tooth shades (VITA shade guide).'}
          </span>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-brand-400 font-bold shrink-0">2.</span>
          <span>
            {service.includes('Whitening')
              ? 'Sensitivity Pre-Care: Brush with potassium nitrate remineralizing paste.'
              : service.includes('Implant')
              ? '3D CBCT Preparation: Remove metal facial jewelry or clips before imaging.'
              : 'Photographic Studio: Arrive refreshed for multi-angle studio shade mapping.'}
          </span>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-brand-400 font-bold shrink-0">3.</span>
          <span>
            Arrival Buffer: Please arrive 10 minutes prior for digital concierge check-in at 14 Harley St.
          </span>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-brand-400 font-bold shrink-0">4.</span>
          <span>
            Parking &amp; Transit: Q-Park Cavendish Square is 3 minutes walk from our surgery suite.
          </span>
        </div>
      </div>
    </div>
  );
}
