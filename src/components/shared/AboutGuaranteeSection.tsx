'use client';

import React from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';
import {
  AnimatedShieldCheckIcon,
  AnimatedGemIcon,
  AnimatedHeartPulseIcon,
} from '@/components/icons/dental-animated';

export function AboutGuaranteeSection() {

  return (
    <section
      id="about"
      className="w-full min-h-[calc(100dvh-66px)] lg:h-[calc(100dvh-66px)] scroll-mt-[66px] relative overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white border-t border-slate-200 flex flex-col justify-center py-4 sm:py-6 lg:py-4 px-4 sm:px-6 lg:px-8 select-none box-border"
    >
      {/* Anchor for backward compatibility with #gallery */}
      <span id="gallery" className="sr-only" aria-hidden="true" />

      {/* Subtle Ambient Aurora background glow (120 FPS lightweight) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[280px] sm:w-[540px] h-[300px] bg-gradient-to-br from-brand-100/40 via-blue-50/30 to-indigo-50/20 blur-[100px] rounded-full z-0" />

      {/* Expanded Container Width to Close Left/Right Gaps (max-w-[1400px]) */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full flex-1 justify-center min-h-0 relative z-10">
        
        {/* Main 2-Column Split: Fits perfectly within visible viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1 lg:min-h-0 w-full items-stretch py-1 overflow-hidden">
          
          {/* LEFT COLUMN (lg:col-span-5): Photographic Clinic Architecture with Doctor Card Style Typography */}
          <BlurReveal
            direction="up"
            delay={60}
            blur={14}
            distance={28}
            className="lg:col-span-5 h-full flex flex-col min-h-0"
          >
            <div className="relative h-full w-full min-h-[420px] lg:min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900 flex flex-col justify-end group cursor-pointer select-none">
              {/* Full-bleed Clinic Photography with Enhanced Daylight Brightness */}
              <img
                src="/images/dental/clinic-hero.jpg"
                alt="Zenith Dental Harley Street Studio Suite"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Cinematic Vignette & Bottom Text Contrast Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 via-45% to-transparent transition-all duration-500 group-hover:from-slate-950 group-hover:via-slate-950/45" />

              {/* Bottom Info Container Matching Doctor Cards Typography Exactly */}
              <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-end transition-all duration-500">
                <div className="space-y-1.5 transform transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Single-Patient Suite Protocol
                  </h3>

                  <p className="text-xs text-brand-300 font-bold uppercase tracking-wider">
                    Zero Waiting Room Congestion
                  </p>

                  <div className="pt-1.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                      CLINICAL PROTOCOL
                    </span>
                    <p className="text-xs text-slate-200/90 leading-relaxed font-normal">
                      Each private surgery suite is thoroughly sanitized and reserved with a mandatory 15-minute buffer prior to your arrival. Dedicated one-on-one specialist attention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BlurReveal>

          {/* RIGHT COLUMN (lg:col-span-7): Editorial Story, 3-Year Guarantee & Structured Grid */}
          <BlurReveal
            direction="up"
            delay={100}
            blur={14}
            distance={28}
            className="lg:col-span-7 flex flex-col justify-center gap-3.5 sm:gap-4 min-h-0 py-2"
          >
            {/* TOP: Headline & Brief Bio */}
            <div className="space-y-1.5 shrink-0">
              <KineticBlurText
                text="About Zenith Dental & Our 3-Year Guarantee"
                as="h2"
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight"
                stagger={40}
              />

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Established in London&apos;s world-renowned Harley Street medical district, Zenith Dental pairs digital 3D precision with calm, one-on-one care. Led by specialists with postgraduate credentials from <strong>King&apos;s College London</strong> and the <strong>University of Geneva</strong>.
              </p>
            </div>

            {/* MIDDLE: 3-Year Comprehensive Guarantee Box (Pure CSS 120 FPS GPU Accelerated) */}
            <div
              className="group/warranty rounded-2xl p-5 sm:p-6 lg:p-6.5 bg-gradient-to-br from-white via-brand-50/30 to-blue-50/20 border-2 border-brand-300 hover:border-brand-500 shadow-md shadow-brand-600/8 hover:shadow-xl hover:shadow-brand-600/15 hover:scale-[1.018] hover:-translate-y-0.5 space-y-3.5 sm:space-y-4 relative overflow-hidden cursor-pointer select-none transform-gpu will-change-transform transition-all duration-300 ease-out"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-600/30 shrink-0 group-hover/warranty:scale-110 group-hover/warranty:bg-brand-700 transition-all duration-300">
                    <AnimatedShieldCheckIcon size={21} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-700 block">
                      Patient Safety Assurance
                    </span>
                    <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 leading-tight">
                      3-Year Comprehensive Dental Warranty
                    </h3>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-brand-600 text-white shadow-2xs shrink-0 group-hover/warranty:bg-brand-700 group-hover/warranty:scale-105 transition-all duration-300">
                  Free
                </span>
              </div>

              <p className="text-xs sm:text-sm lg:text-[14px] text-slate-700 leading-relaxed font-medium">
                We stand with total confidence behind our clinical treatments. If any filling, ceramic veneer, or restoration experiences any defect within <strong>3 full years</strong>, we repair or replace it completely free of charge.
              </p>

              {/* 2x2 Coverage Grid with Item Hover Micro-Animations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
                <div className="group/item flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100/60 shadow-2xs transition-all duration-200 hover:bg-white hover:translate-x-1 cursor-default">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5 group-hover/item:scale-110 group-hover/item:text-brand-700 transition-transform" />
                  <span className="group-hover/item:text-slate-900 transition-colors">Free repair or replacement of chipped/debonded ceramics</span>
                </div>
                <div className="group/item flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100/60 shadow-2xs transition-all duration-200 hover:bg-white hover:translate-x-1 cursor-default">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5 group-hover/item:scale-110 group-hover/item:text-brand-700 transition-transform" />
                  <span className="group-hover/item:text-slate-900 transition-colors">Complimentary filling resealing & bite adjustments</span>
                </div>
                <div className="group/item flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100/60 shadow-2xs transition-all duration-200 hover:bg-white hover:translate-x-1 cursor-default">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5 group-hover/item:scale-110 group-hover/item:text-brand-700 transition-transform" />
                  <span className="group-hover/item:text-slate-900 transition-colors">Official <strong>Zenith Dental Passport</strong> with material serials</span>
                </div>
                <div className="group/item flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium p-2 sm:p-2.5 rounded-xl bg-white/70 border border-brand-100/60 shadow-2xs transition-all duration-200 hover:bg-white hover:translate-x-1 cursor-default">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5 group-hover/item:scale-110 group-hover/item:text-brand-700 transition-transform" />
                  <span className="group-hover/item:text-slate-900 transition-colors">Zero unexpected invoice adjustments or hidden clinic fees</span>
                </div>
              </div>

              {/* Fair transparent disclaimer */}
              <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-white/85 p-2.5 sm:p-3 rounded-xl border border-slate-200/80">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Fair terms: Requires standard 6-month routine hygiene review attendance. Traumatic external sports/accident impact excluded.</span>
              </div>
            </div>

            {/* Core Standards Cards & Clinical Badges */}
            <div className="space-y-2.5 shrink-0">
              {/* Row 1: The 2 Core Standards Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="group/spec p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-brand-400 hover:-translate-y-1 transition-all duration-300 ease-out flex items-center gap-3 cursor-pointer select-none">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover/spec:scale-110 group-hover/spec:bg-brand-600 group-hover/spec:text-white transition-all duration-300 shadow-2xs">
                    <AnimatedGemIcon size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover/spec:text-brand-700 transition-colors">
                      Swiss & German Materials
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Ivoclar E.max & Straumann Bio-Titanium
                    </p>
                  </div>
                </div>

                <div className="group/spec p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 ease-out flex items-center gap-3 cursor-pointer select-none">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/spec:scale-110 group-hover/spec:bg-emerald-600 group-hover/spec:text-white transition-all duration-300 shadow-2xs">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover/spec:text-emerald-700 transition-colors">
                      Fixed Price Quotes
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Digital 3D quote is final; anesthesia included
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Clinical Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5 shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-slate-100/90 hover:bg-brand-50 text-slate-800 hover:text-brand-700 border border-slate-200/80 hover:border-brand-300 text-xs sm:text-[12.5px] font-bold shadow-2xs hover:shadow-xs hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none group/badge">
                  <Award className="w-4 h-4 text-brand-600 group-hover/badge:scale-110 transition-transform shrink-0" />
                  <span>CQC UK Regulated</span>
                </span>

                <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-slate-100/90 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 text-xs sm:text-[12.5px] font-bold shadow-2xs hover:shadow-xs hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none group/badge">
                  <Lock className="w-4 h-4 text-emerald-600 group-hover/badge:scale-110 transition-transform shrink-0" />
                  <span>£10M Clinical Indemnity</span>
                </span>

                <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-slate-100/90 hover:bg-red-50 text-slate-800 hover:text-red-600 border border-slate-200/80 hover:border-red-300 text-xs sm:text-[12.5px] font-bold shadow-2xs hover:shadow-xs hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none group/badge">
                  <AnimatedHeartPulseIcon size={15} className="text-red-500 group-hover/badge:text-red-600 group-hover/badge:scale-110 transition-transform shrink-0" />
                  <span>Pain-Free Protocol</span>
                </span>
              </div>
            </div>

          </BlurReveal>

        </div>

      </div>
    </section>
  );
}