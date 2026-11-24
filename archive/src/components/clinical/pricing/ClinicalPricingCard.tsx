'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { AnimatedHeartPulseIcon } from '@/components/icons/dental-animated';
import { Language } from '@/lib/i18n';
import type { ClinicalServiceItem } from '../ClinicalPricingSection';

interface ClinicalPricingCardProps {
  srv: ClinicalServiceItem;
  lang: Language;
  isHovered: boolean;
  animInstanceKey: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSelect: () => void;
  transformStyle: string;
  zIndex: number;
  opacity: number;
  shadowClass: string;
}

export function ClinicalPricingCard({
  srv,
  lang,
  isHovered,
  animInstanceKey,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onSelect,
  transformStyle,
  zIndex,
  opacity,
  shadowClass,
}: ClinicalPricingCardProps) {
  const IconComponent = srv.icon;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={onSelect}
      style={{
        transform: transformStyle,
        zIndex,
        opacity,
        transition:
          'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease-out, box-shadow 0.45s ease-out',
      }}
      className={`group relative h-full rounded-2xl sm:rounded-3xl p-[1px] flex flex-col origin-center transform-gpu will-change-transform cursor-pointer select-none ${shadowClass}`}
    >
      {/* Spotlight Border Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background:
            'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.45), transparent 70%)',
        }}
      />

      {/* Base Card Shell */}
      <div className="relative z-10 w-full h-full p-3.5 sm:p-4 rounded-[15px] sm:rounded-[22px] bg-white border border-slate-200/90 group-hover:border-transparent transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs">
        {/* TOP: Header Icon + Category + Title + Desc */}
        <div className="relative z-20 shrink-0">
          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
              <IconComponent key={`main-${animInstanceKey}`} size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {srv.category}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 leading-snug line-clamp-2 min-h-[3rem]">
            {srv.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 min-h-[3.6rem]">
            {srv.desc}
          </p>
        </div>

        {/* MIDDLE: Clean Open List */}
        <div className="relative z-20 space-y-2 mt-2 mb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-brand-600 transition-colors block">
              {lang === 'az'
                ? 'Müayinəyə daxildir'
                : lang === 'ru'
                ? 'Включено в визит'
                : 'Included in Visit'}
            </span>
          </div>

          <ul className="space-y-1.5">
            {srv.highlights.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-slate-700 font-medium"
                >
                  <span className="text-brand-600 shrink-0 mt-0.5 p-1 rounded-md bg-brand-50/70 group-hover:bg-brand-100 transition-colors">
                    <ItemIcon key={`item-${animInstanceKey}-${i}`} size={13} />
                  </span>
                  <span className="leading-snug pt-0.5">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* BOTTOM: Prominent Price, Duration, Guarantee & Tactile CTA */}
        <div className="mt-auto pt-3 border-t border-slate-100/90 relative z-20 space-y-2.5">
          {/* Clinical Guarantee Row */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            <span className={isHovered ? 'text-brand-600' : 'text-slate-500'}>
              <AnimatedHeartPulseIcon key={`pulse-${animInstanceKey}`} size={14} />
            </span>
            <span className="truncate">{srv.guarantee}</span>
          </div>

          {/* Main Price & Deposit Highlight */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {srv.price}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {lang === 'az' ? '/ qəbul' : lang === 'ru' ? '/ визит' : '/ visit'}
              </span>
            </div>
            <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full shadow-2xs">
              {srv.deposit}
            </span>
          </div>

          {/* Est. Duration & Sterilization Buffer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>
              {srv.duration} (
              {lang === 'az'
                ? '+15 dəq sterilizasiya'
                : lang === 'ru'
                ? '+15 мин буфер'
                : '+15m buffer'}
              )
            </span>
          </div>

          {/* Prominent Tactile CTA Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="group/btn w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 border border-brand-500 shadow-md shadow-brand-600/20 hover:shadow-[0_4px_22px_rgba(37,99,235,0.45)] hover:brightness-105 hover:scale-[1.025] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <span>
              {lang === 'az'
                ? 'Qəbul Vaxtını Seç'
                : lang === 'ru'
                ? 'Выбрать время приёма'
                : 'Reserve Treatment Slot'}
            </span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
