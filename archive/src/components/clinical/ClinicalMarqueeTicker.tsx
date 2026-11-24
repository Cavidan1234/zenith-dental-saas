'use client';

import React from 'react';

interface ClinicalMarqueeTickerProps {
  lang?: 'en' | 'az' | 'ru';
}

const ITEMS_BY_LANG: Record<'en' | 'az' | 'ru', string[]> = {
  en: [
    'HARLEY STREET EXCELLENCE',
    '3D CBCT DIGITAL TOMOGRAPHY',
    'ZERO WAIT GUARANTEE',
    '3-YEAR CERAMIC WARRANTY',
    'AXA & BUPA INSTANT PRE-AUTH',
    'PAINLESS LASER MASTERY',
    'VIP PRIVATE CONCIERGE',
    'SWISS BIOMIMETIC IMPLANTS',
  ],
  az: [
    'HARLEY STREET DƏQİQLİYİ',
    '3D CBCT RƏQƏMSAL TOMOQRAFİYA',
    'NÖVBƏSİZ QƏBUL ZƏMANƏTİ',
    '3 İL KERAMİKA ZƏMANƏTİ',
    'AXA VƏ BUPA BİRBAŞA SIĞORTA',
    'AĞRISIZ LAZER ESTETİKASI',
    'VIP ÖZƏL KONSİERJ',
    'İSVEÇRƏ BİOMİMETİK İMPLANTLARI',
  ],
  ru: [
    'СТАНДАРТ ХАРЛИ-СТРИТ',
    '3D CBCT ЦИФРОВАЯ ДИАГНОСТИКА',
    'ГАРАНТИЯ ПРИЕМА БЕЗ ОЧЕРЕДЕЙ',
    '3 ГОДА ГАРАНТИИ НА КЕРАМИКУ',
    'ПРЯМАЯ СТРАХОВКА AXA И BUPA',
    'БЕЗБОЛЕЗНЕННАЯ ЛАЗЕРНАЯ ЭСТЕТИКА',
    'VIP ПЕРСОНАЛЬНЫЙ КОНСЬЕРЖ',
    'ШВЕЙЦАРСКИЕ ИМПЛАНТЫ',
  ],
};

export function ClinicalMarqueeTicker({ lang = 'en' }: ClinicalMarqueeTickerProps) {
  const items = ITEMS_BY_LANG[lang] || ITEMS_BY_LANG.en;
  // Repeat items for seamless 100% infinite marquee loop
  const repeated = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-900 border-y border-slate-800 text-white py-3.5 select-none group z-10"
      aria-label="Clinical excellence guarantees ticker"
    >
      <style>{`
        @keyframes marqueeLinearSlide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeLinearSlide 38s linear infinite;
          will-change: transform;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* Edge gradient mask vignettes */}
      <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex items-center">
        {repeated.map((text, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-slate-200 uppercase whitespace-nowrap px-4 transition-colors group-hover:text-cyan-300">
              {text}
            </span>
            <span className="text-cyan-400 font-serif text-sm select-none opacity-80" aria-hidden="true">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
