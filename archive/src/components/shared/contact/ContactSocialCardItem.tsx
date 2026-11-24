'use client';

import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';

interface ContactSocialCardItemProps {
  delay: number;
  iconBgClass: string;
  hoverBorderClass: string;
  hoverRingClass: string;
  gradientShineClass: string;
  icon: React.ReactNode;
  categoryLabel: string;
  handle: string;
  url: string;
  copyType: string;
  copiedType: string | null;
  onCopy: (text: string, type: string) => void;
  ctaText: string;
  ctaButtonClass: string;
  description: string;
}

export function ContactSocialCardItem({
  delay,
  iconBgClass,
  hoverBorderClass,
  hoverRingClass,
  gradientShineClass,
  icon,
  categoryLabel,
  handle,
  url,
  copyType,
  copiedType,
  onCopy,
  ctaText,
  ctaButtonClass,
  description,
}: ContactSocialCardItemProps) {
  return (
    <BlurReveal
      direction="left"
      delay={delay}
      duration={650}
      className="flex-1 flex flex-col min-h-0"
    >
      <div
        className={`group relative overflow-hidden py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 ${hoverBorderClass} hover:ring-2 ${hoverRingClass} transition-all duration-300 ease-out flex-1 flex flex-col justify-center before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent ${gradientShineClass} before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none`}
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${iconBgClass} flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-110`}
            >
              {icon}
            </div>
            <div>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                {categoryLabel}
              </span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg font-black text-slate-900 tracking-tight transition-colors leading-tight block mt-0.5"
              >
                {handle}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onCopy(handle, copyType)}
              title={`Copy ${handle}`}
              className="p-1.5 text-slate-400 hover:scale-125 hover:rotate-6 active:scale-90 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
            >
              {copiedType === copyType ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn relative overflow-hidden px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs hover:shadow-md hover:ring-2 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-500 before:ease-out ${ctaButtonClass}`}
            >
              <span className="relative z-10">{ctaText}</span>
              <ExternalLink className="w-3 h-3 relative z-10 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 font-medium relative z-10">
          {description}
        </p>
      </div>
    </BlurReveal>
  );
}
