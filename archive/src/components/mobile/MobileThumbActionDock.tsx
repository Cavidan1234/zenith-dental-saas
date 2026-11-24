'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Sparkles } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { playHapticTick } from '@/lib/soundscapes';

interface MobileThumbActionDockProps {
  onOpenBooking: () => void;
  lang?: Language;
  phone?: string;
}

export function MobileThumbActionDock({
  onOpenBooking,
  lang = 'en',
  phone = '+44 20 7946 0921',
}: MobileThumbActionDockProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Reveal dock after scrolling past hero (150px)
          setIsVisible(window.scrollY > 150);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bookLabel = lang === 'az' ? 'Qəbula Yazıl' : lang === 'ru' ? 'Записаться' : 'Book Appointment';
  const calcLabel = lang === 'az' ? 'Hesabla' : lang === 'ru' ? 'Расчет' : 'Estimate';

  return (
    <aside
      aria-label="Mobile Navigation Dock"
      className={`fixed bottom-4 left-4 right-4 z-40 md:hidden transition-all duration-300 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5 p-2 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl">
        {/* Quick Phone Call (44x44px Touch Target) */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          aria-label="Call Surgery Reception"
          onClick={() => playHapticTick()}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-transform"
        >
          <Phone className="w-5 h-5 text-brand-300" />
        </a>

        {/* Jump to Treatment Calculator */}
        <a
          href="#calculator"
          aria-label="Treatment Calculator"
          onClick={() => playHapticTick()}
          className="flex items-center gap-1.5 px-3 h-11 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold hover:bg-white/10 active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{calcLabel}</span>
        </a>

        {/* Main CTA: Book Appointment */}
        <button
          type="button"
          onClick={() => {
            playHapticTick();
            onOpenBooking();
          }}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-xs tracking-wide shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-white" />
          <span>{bookLabel}</span>
        </button>
      </div>
    </aside>
  );
}
