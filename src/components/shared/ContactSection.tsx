'use client';

import React, { useState } from 'react';
import {
  Phone,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Compass,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.776.979-.952 1.18-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.239-.244-.59-.493-.51-.677-.52-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.229 3.109.15.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.379.197 1.9.12.579-.086 1.78-.727 2.03-1.43.251-.702.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.042 2C6.5 2 2 6.5 2 12.042c0 1.83.49 3.54 1.34 5.01L2 22l5.12-1.31c1.42.78 3.03 1.22 4.74 1.22 5.542 0 10.042-4.5 10.042-10.042C21.902 6.5 17.584 2 12.042 2zm0 18.083c-1.54 0-2.98-.44-4.2-1.2l-.3-.19-3.12.82.83-3.04-.2-.32c-.83-1.31-1.27-2.83-1.27-4.41 0-4.43 3.61-8.04 8.06-8.04 4.45 0 8.06 3.61 8.06 8.04 0 4.44-3.62 8.05-8.06 8.05z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43 6.27 6.27 0 0 0 1.93-4.52V8.67a8.28 8.28 0 0 0 4.8 1.54V6.78a4.86 4.86 0 0 1-1-.09z" />
    </svg>
  );
}

export function ContactSection() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <section
      id="contact"
      className="w-full min-h-[calc(100vh-66px)] lg:h-[calc(100vh-66px)] relative overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white border-t border-slate-200 flex flex-col justify-between py-6 sm:py-8 lg:py-7 px-4 sm:px-6 lg:px-8 select-none box-border scroll-mt-16 sm:scroll-mt-20"
    >
      {/* Subtle Ambient Aurora background glow (120 FPS lightweight) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[280px] sm:w-[540px] h-[300px] bg-gradient-to-br from-brand-100/40 via-blue-50/30 to-indigo-50/20 blur-[100px] rounded-full z-0" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[260px] sm:w-[420px] h-[260px] bg-indigo-50/40 blur-[100px] rounded-full z-0" />

      {/* Max Width Container matching About Us Section strictly (1400px) */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full flex-1 justify-between min-h-0 relative z-10">
        
        {/* Section Header: Pure English, Eyebrow Removed, Relaxed & Airy Spacing */}
        <BlurReveal direction="up" delay={0} className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-8 space-y-2 shrink-0">
          <KineticBlurText
            text="Visit Our Practice or Speak with Our Team"
            as="h2"
            className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-slate-900 tracking-tight leading-snug"
            stagger={35}
          />
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-normal">
            Direct telephone bookings, private patient concierge on WhatsApp, and clinical case portfolio.
          </p>
        </BlurReveal>

        {/* Main 2-Column Split: Harmonious 4 Horizontal Cards on Left & Google Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 flex-1 lg:min-h-0 w-full items-stretch py-1">
          
          {/* LEFT COLUMN (lg:col-span-6): 4 Interactive Animated Cards (Phone, WhatsApp, Instagram, TikTok) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-0 gap-3 sm:gap-3.5">
            
            {/* 1. Main Reception Phone Card */}
            <BlurReveal
              direction="up"
              delay={60}
              duration={650}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="group relative overflow-hidden py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-brand-400 hover:ring-2 hover:ring-brand-500/10 transition-all duration-300 ease-out flex-1 flex flex-col justify-center before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-blue-50/60 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none">
                <div className="flex items-center justify-between gap-2.5 sm:gap-3 relative z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100 shadow-2xs group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                      <Phone className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block leading-tight truncate">
                        Main Clinic Reception & Bookings
                      </span>
                      <a
                        href="tel:+442079460991"
                        className="text-sm sm:text-lg font-black text-slate-900 hover:text-brand-600 tracking-tight transition-colors leading-tight block mt-0.5 whitespace-nowrap"
                      >
                        +44 20 7946 0991
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Clean bare copy button: interactive micro-animation */}
                    <button
                      onClick={() => copyToClipboard('+442079460991', 'phone')}
                      title="Copy phone number"
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:scale-125 hover:rotate-6 active:scale-90 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
                    >
                      {copiedType === 'phone' ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <a
                      href="tel:+442079460991"
                      className="group/btn relative overflow-hidden px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-2xs hover:shadow-md hover:shadow-blue-500/25 hover:ring-2 hover:ring-brand-400/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-500 before:ease-out"
                    >
                      <span className="relative z-10 hidden sm:inline">Call Now</span>
                      <span className="relative z-10 sm:hidden">Call</span>
                      <ChevronRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 ease-out group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
                <p className="mt-1.5 sm:mt-1 text-[11px] text-slate-500 font-medium flex items-center gap-1.5 relative z-10">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Monday – Friday: 08:30 – 19:30 · Dedicated patient liaison desk</span>
                </p>
              </div>
            </BlurReveal>

            {/* 2. WhatsApp Patient Concierge Card */}
            <BlurReveal
              direction="up"
              delay={140}
              duration={650}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="group relative overflow-hidden py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-500/10 transition-all duration-300 ease-out flex-1 flex flex-col justify-center before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-emerald-50/60 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none">
                <div className="flex items-center justify-between gap-2.5 sm:gap-3 relative z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block leading-tight truncate">
                        WhatsApp Patient Concierge
                      </span>
                      <a
                        href="https://wa.me/442079460991"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-lg font-black text-slate-900 hover:text-emerald-600 tracking-tight transition-colors leading-tight block mt-0.5 whitespace-nowrap"
                      >
                        +44 20 7946 0991
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Clean bare copy button: interactive micro-animation */}
                    <button
                      onClick={() => copyToClipboard('+442079460991', 'wa')}
                      title="Copy WhatsApp number"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:scale-125 hover:rotate-6 active:scale-90 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
                    >
                      {copiedType === 'wa' ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <a
                      href="https://wa.me/442079460991"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative overflow-hidden px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs hover:shadow-md hover:shadow-emerald-500/25 hover:ring-2 hover:ring-emerald-400/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-500 before:ease-out"
                    >
                      <span className="relative z-10 hidden sm:inline">Chat on WhatsApp</span>
                      <span className="relative z-10 sm:hidden">Chat</span>
                      <ExternalLink className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
                <p className="mt-1.5 sm:mt-1 text-[11px] text-slate-500 font-medium relative z-10">
                  Fast queries, treatment estimates, scheduling & photo consultations
                </p>
              </div>
            </BlurReveal>

            {/* 3. Official Instagram Card */}
            <BlurReveal
              direction="up"
              delay={220}
              duration={650}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="group relative overflow-hidden py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-pink-400 hover:ring-2 hover:ring-rose-500/10 transition-all duration-300 ease-out flex-1 flex flex-col justify-center before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-pink-50/60 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none">
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <InstagramIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                        Official Studio Portfolio
                      </span>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-lg font-black text-slate-900 hover:text-purple-600 tracking-tight transition-colors leading-tight block mt-0.5 truncate max-w-[130px] sm:max-w-none"
                      >
                        @zenith.dental.london
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Clean bare copy button: interactive micro-animation */}
                    <button
                      onClick={() => copyToClipboard('@zenith.dental.london', 'insta')}
                      title="Copy Instagram handle"
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:scale-125 hover:rotate-6 active:scale-90 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
                    >
                      {copiedType === 'insta' ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative overflow-hidden px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-2xs hover:shadow-md hover:shadow-rose-500/30 hover:ring-2 hover:ring-rose-400/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:transition-transform before:duration-500 before:ease-out"
                    >
                      <span className="relative z-10 hidden sm:inline">View Instagram</span>
                      <span className="relative z-10 sm:hidden">View</span>
                      <ExternalLink className="w-3 h-3 relative z-10 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-medium relative z-10">
                  Smile transformations, surgical case breakdowns & clinical insights
                </p>
              </div>
            </BlurReveal>

            {/* 4. Official TikTok Card */}
            <BlurReveal
              direction="up"
              delay={300}
              duration={650}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="group relative overflow-hidden py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-slate-500 hover:ring-2 hover:ring-slate-500/10 transition-all duration-300 ease-out flex-1 flex flex-col justify-center before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-slate-100/60 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none">
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0 shadow-2xs border border-slate-800 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                      <TikTokIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                        Official TikTok Channel
                      </span>
                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-lg font-black text-slate-900 hover:text-slate-700 tracking-tight transition-colors leading-tight block mt-0.5 truncate max-w-[130px] sm:max-w-none"
                      >
                        @zenith.dental
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Clean bare copy button: interactive micro-animation */}
                    <button
                      onClick={() => copyToClipboard('@zenith.dental', 'tiktok')}
                      title="Copy TikTok handle"
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:scale-125 hover:rotate-6 active:scale-90 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
                    >
                      {copiedType === 'tiktok' ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn relative overflow-hidden px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-2xs hover:shadow-md hover:shadow-slate-900/40 hover:ring-2 hover:ring-slate-700/60 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-500 before:ease-out"
                    >
                      <span className="relative z-10 hidden sm:inline">Watch on TikTok</span>
                      <span className="relative z-10 sm:hidden">Watch</span>
                      <ExternalLink className="w-3 h-3 relative z-10 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 font-medium relative z-10">
                  Dental health guides, patient transformations & daily clinic reels
                </p>
              </div>
            </BlurReveal>

          </div>

          {/* RIGHT COLUMN (lg:col-span-6): Interactive Framed Google Map (Fills 100% height) */}
          <BlurReveal
            direction="up"
            delay={120}
            blur={14}
            distance={28}
            className="lg:col-span-6 flex flex-col h-full min-h-0"
          >
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white flex flex-col justify-between">
              
              {/* Map Architectural Top Banner — Clean Text Only, Larger & Legible */}
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

              {/* Google Maps Responsive Embed (Flexibly fills the rest of the height) */}
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

              {/* Clean Parking Info Footer with Info Icon */}
              <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-700 font-medium z-10 shrink-0">
                <Info className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-[11.5px] sm:text-xs text-slate-600">
                  Convenient underground parking available nearby · <strong className="text-slate-800 font-semibold">Q-Park Cavendish Square</strong> (2 min walk)
                </span>
              </div>

            </div>
          </BlurReveal>

        </div>

      </div>
    </section>
  );
}
