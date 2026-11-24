"use client"

import * as React from "react"
import { Calendar, ArrowRight } from "lucide-react"

interface HeroEditorialHeaderProps {
  lang: 'en' | 'az' | 'ru'
  onOpenBooking: (serviceId?: string, doctorId?: string) => void
}

export function HeroEditorialHeader({ lang, onOpenBooking }: HeroEditorialHeaderProps) {
  return (
    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 pt-3 sm:pt-6">
      {/* Main Centered Headline with Kinetic Blur-to-Focus Words and Artistic Blue Pencil Underline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15] max-w-4xl drop-shadow-[0_4px_16px_rgba(10,20,60,0.6)]">
        {lang === 'az' ? (
          <>
            <span className="hero-blur-word-1 relative inline-block whitespace-nowrap">
              Dünya Səviyyəli
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3.5 sm:h-5 text-cyan-400 pointer-events-none overflow-visible"
                viewBox="0 0 250 16"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 3 11 C 55 4, 135 3, 246 8"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-draw-1"
                />
                <path
                  d="M 18 14 C 85 9, 175 8, 238 12"
                  stroke="#60a5fa"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-draw-2"
                  opacity="0.85"
                />
              </svg>
            </span>{' '}
            <span className="hero-blur-word-2 inline-block">Diş</span>{' '}
            <span className="hero-blur-word-3 inline-block">Baxımı.</span>{' '}
            <span className="text-cyan-300 block sm:inline mt-1 sm:mt-0">
              <span className="hero-blur-word-4 inline-block">Növbəsiz</span>{' '}
              <span className="hero-blur-word-5 inline-block">Qəbul.</span>
            </span>
          </>
        ) : lang === 'ru' ? (
          <>
            <span className="hero-blur-word-1 relative inline-block whitespace-nowrap">
              Стоматология
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3.5 sm:h-5 text-cyan-400 pointer-events-none overflow-visible"
                viewBox="0 0 250 16"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 3 11 C 55 4, 135 3, 246 8"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-draw-1"
                />
                <path
                  d="M 18 14 C 85 9, 175 8, 238 12"
                  stroke="#60a5fa"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-draw-2"
                  opacity="0.85"
                />
              </svg>
            </span>{' '}
            <span className="hero-blur-word-2 inline-block">мирового</span>{' '}
            <span className="hero-blur-word-3 inline-block">уровня.</span>{' '}
            <span className="text-cyan-300 block sm:inline mt-1 sm:mt-0">
              <span className="hero-blur-word-4 inline-block">Без</span>{' '}
              <span className="hero-blur-word-5 inline-block">очередей.</span>
            </span>
          </>
        ) : (
          <>
            <span className="hero-blur-word-1 relative inline-block whitespace-nowrap">
              World-Class
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3.5 sm:h-5 text-cyan-400 pointer-events-none overflow-visible"
                viewBox="0 0 250 16"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 3 11 C 55 4, 135 3, 246 8"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-draw-1"
                />
                <path
                  d="M 18 14 C 85 9, 175 8, 238 12"
                  stroke="#60a5fa"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pencil-draw-2"
                  opacity="0.85"
                />
              </svg>
            </span>{' '}
            <span className="hero-blur-word-2 inline-block">Dental</span>{' '}
            <span className="hero-blur-word-3 inline-block">Care.</span>{' '}
            <span className="text-cyan-300 block sm:inline mt-1 sm:mt-0">
              <span className="hero-blur-word-4 inline-block">Zero</span>{' '}
              <span className="hero-blur-word-5 inline-block">Wait</span>{' '}
              <span className="hero-blur-word-6 inline-block">Times.</span>
            </span>
          </>
        )}
      </h1>

      {/* Subtitle with Kinetic Blur-to-Focus Dissolve */}
      <p className="hero-blur-sub text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl leading-relaxed font-normal drop-shadow-sm pt-1">
        {lang === 'az'
          ? 'Marylebone-da qabaqcıl 3D intraoral diaqnostika, ağrısız estetik, implant və fərdi stomatoloji qayğı təcrübəsi.'
          : lang === 'ru'
          ? 'Эстетическая стоматология, имплантация и 3D диагностика мирового уровня с бережным и безболезненным подходом в Мэрилебон.'
          : 'Experience pain-free cosmetic, implant, and general dentistry with cutting-edge 3D intraoral diagnostics and personalized care in Marylebone.'}
      </p>

      {/* Action Buttons with Kinetic Rise */}
      <div className="hero-blur-cta flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2 sm:pt-3">
        {/* LIQUID METAL BUTTON: Real-time White & Blue Liquid Chrome Ring */}
        <div className="liquid-metal-frame active:scale-95 transition-transform duration-200">
          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="flow-button group relative overflow-hidden inline-flex items-center justify-center px-9 sm:px-10 py-4 sm:py-4.5 rounded-full text-base sm:text-lg font-black text-blue-950 cursor-pointer shadow-lg"
          >
            {/* Sliding text mask container */}
            <div className="relative overflow-hidden flex items-center justify-center h-7 min-w-[225px] sm:min-w-[240px] pointer-events-none">
              {/* Default layer: slides out to the RIGHT on hover starting from its resting place */}
              <span className="inline-flex items-center justify-center gap-2.5 w-full pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-[150%]">
                <Calendar className="w-5 h-5 text-brand-700 shrink-0" />
                <span className="tracking-tight whitespace-nowrap">
                  {lang === 'az' ? 'Onlayn Qəbula Yazılın' : lang === 'ru' ? 'Записаться онлайн' : 'Book Your Visit Online'}
                </span>
                <ArrowRight className="w-4 h-4 text-brand-700 shrink-0" />
              </span>

              {/* Incoming clone layer: starts at LEFT, slides in to CENTER on hover */}
              <span className="absolute inset-0 inline-flex items-center justify-center gap-2.5 w-full pointer-events-none -translate-x-[150%] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0">
                <Calendar className="w-5 h-5 text-brand-700 shrink-0" />
                <span className="tracking-tight whitespace-nowrap">
                  {lang === 'az' ? 'Onlayn Qəbula Yazılın' : lang === 'ru' ? 'Записаться онлайн' : 'Book Your Visit Online'}
                </span>
                <ArrowRight className="w-4 h-4 text-brand-700 shrink-0" />
              </span>
            </div>
          </button>
        </div>

        {/* Secondary Action: Uiverse.io Expanding Circle Button (cssbuttons-io) */}
        <a
          href="#doctors"
          className="learn-more select-none active:scale-95 transition-transform"
          aria-label={lang === 'az' ? 'Həkimlərimiz' : lang === 'ru' ? 'Наши врачи' : 'Meet Specialists'}
        >
          <span className="circle" aria-hidden="true">
            <span className="icon arrow" />
          </span>
          <span className="button-text">
            {lang === 'az' ? 'Həkimlərimiz' : lang === 'ru' ? 'Наши врачи' : 'Meet Specialists'}
          </span>
        </a>
      </div>
    </div>
  )
}
