'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';

interface FaqItem {
  q: string;
  a: string;
  highlight?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    q: 'Do you provide a formal guarantee on dental procedures?',
    a: 'Every restorative ceramic restoration, porcelain veneer, and surgical implant procedure is backed by our Zenith 3-Year All-Inclusive Clinical Guarantee. If any material fracture, ceramic chipping, or structural loosening occurs during normal clinical use, we repair or replace it completely free of charge with priority surgical suite booking.',
    highlight: '3-Year All-Inclusive Clinical Guarantee',
  },
  {
    q: 'Why is a nominal deposit required when booking an appointment?',
    a: 'To guarantee our strict zero-wait-time commitment, each surgery suite is sanitized, calibrated, and reserved exclusively for you 15 minutes before your scheduled arrival. Your deposit is credited 100% towards your final treatment invoice upon attendance.',
  },
  {
    q: 'Can I easily reschedule or cancel my appointment?',
    a: 'Yes. You can reschedule or cancel your appointment online with a single click via your confirmation email or through our dedicated WhatsApp concierge up to 24 hours prior to your visit for an instant, full refund of your deposit.',
  },
  {
    q: 'Where is the practice located, and is parking available nearby?',
    a: 'Zenith Dental is situated at 42 Harley Street, Marylebone, London (W1G 9PR). Secure underground parking is available 2 minutes away at Q-Park Cavendish Square, and Oxford Circus tube station is a convenient 5-minute walk.',
  },
];

export function FaqSection() {
  // First item (Guarantee) open by default to immediately reassure patients
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="w-full min-h-[calc(100vh-66px)] lg:h-[calc(100vh-66px)] relative overflow-hidden bg-white border-t border-slate-200 flex flex-col justify-center py-6 sm:py-8 lg:py-6 px-4 sm:px-6 lg:px-8 select-none box-border scroll-mt-16 sm:scroll-mt-20"
    >
      {/* Subtle Ambient Background Light */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[280px] sm:w-[600px] h-[300px] bg-gradient-to-b from-brand-50/50 via-slate-50/20 to-transparent blur-[120px] rounded-full z-0" />

      <div className="max-w-4xl mx-auto w-full flex flex-col justify-center min-h-0 relative z-10">
        
        {/* Section Header: Lifted Upward for Flawless Full-Screen Viewport Fit */}
        <BlurReveal direction="up" delay={0} className="text-center mb-5 sm:mb-6 lg:mb-6 space-y-1.5 shrink-0">
          <KineticBlurText
            text="Frequently Asked Questions"
            as="h2"
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-slate-900 tracking-tight leading-tight text-center"
            stagger={40}
          />
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-normal text-center">
            Everything you need to know about our clinical standards, 3-year guarantee, and Harley Street private appointments.
          </p>
        </BlurReveal>

        {/* 4 Interactive Accordion Cards with Rich Micro-Animations */}
        <div className="space-y-3 sm:space-y-3.5">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            const itemNumber = (idx + 1).toString().padStart(2, '0');

            return (
              <BlurReveal
                key={idx}
                direction="up"
                delay={60 + idx * 70}
                duration={600}
                blur={12}
                distance={20}
              >
                <div
                  onClick={() => toggleFaq(idx)}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 ease-out cursor-pointer select-none border ${
                    isOpen
                      ? 'bg-white border-brand-400 shadow-md ring-2 ring-brand-500/10'
                      : 'bg-slate-50/70 hover:bg-white border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-brand-300'
                  } before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-blue-50/40 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none`}
                >
                  {/* Question Row Header */}
                  <div className="py-3 px-4 sm:py-3.5 sm:px-5 flex items-center justify-between gap-3.5 relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 text-left">
                      {/* Number Pill / Indicator */}
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isOpen
                            ? 'bg-brand-600 text-white shadow-2xs scale-105'
                            : 'bg-slate-200/70 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600'
                        }`}
                      >
                        {itemNumber}
                      </span>

                      {/* Question Text */}
                      <h3
                        className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-200 ${
                          isOpen
                            ? 'text-brand-900'
                            : 'text-slate-900 group-hover:text-brand-700'
                        }`}
                      >
                        {item.q}
                      </h3>
                    </div>

                    {/* Animated Chevron Button */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-brand-50 text-brand-600 rotate-180 scale-105'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:scale-110'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Smooth Animated Accordion Body (CSS Grid 120 FPS height transition) */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out px-4 sm:px-5 relative z-10 ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 pb-3.5 sm:pb-4'
                        : 'grid-rows-[0fr] opacity-0 pb-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                          {item.a}
                        </p>

                        {/* Special Guarantee Assurance Badge on item 0 */}
                        {item.highlight && (
                          <div className="mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[10.5px] font-bold text-emerald-800 self-start shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item.highlight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </BlurReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
