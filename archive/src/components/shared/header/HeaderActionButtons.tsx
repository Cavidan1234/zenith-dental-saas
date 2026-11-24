'use client';

import React from 'react';
import { Calendar, Phone, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Language } from '@/lib/i18n';

interface HeaderActionButtonsProps {
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
  onOpenBooking: () => void;
  bookShort: string;
  bookText: string;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function HeaderActionButtons({
  lang,
  onLanguageChange,
  onOpenBooking,
  bookShort,
  bookText,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: HeaderActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Desktop Language Switcher */}
      {onLanguageChange && (
        <div className="hidden sm:inline-flex">
          <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
        </div>
      )}

      {/* Direct Phone Pill with Micro-Tilt */}
      <a
        href="tel:+442079460991"
        className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-all duration-200 group active:scale-95 text-slate-700 hover:text-brand-600 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 shadow-2xs"
      >
        <Phone className="w-3.5 h-3.5 text-brand-500 group-hover:rotate-12 transition-transform duration-200" />
        <span>+44 20 7946 0991</span>
      </a>

      {/* Book Appointment CTA Button with Kinetic Lift & Shine */}
      <button
        type="button"
        onClick={onOpenBooking}
        className="group/btn relative overflow-hidden inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 cursor-pointer active:scale-95 transform-gpu text-white bg-brand-600 hover:bg-brand-700 hover:shadow-brand-600/35 hover:-translate-y-0.5"
      >
        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/btn:scale-110 text-white shrink-0" />
        <span className="tracking-tight whitespace-nowrap">
          <span>{bookShort}</span>
          <span className="hidden sm:inline"> {bookText.replace(bookShort, '').trim()}</span>
        </span>
      </button>

      {/* Mobile / Tablet Menu Toggle Button */}
      <button
        type="button"
        onClick={onToggleMobileMenu}
        className="lg:hidden p-2 rounded-xl transition-colors duration-200 active:scale-90 text-slate-700 hover:text-brand-600 hover:bg-slate-100"
        aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
