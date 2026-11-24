'use client';

import React from 'react';
import { Phone, Calendar, ChevronRight } from 'lucide-react';
import { ZenithLogo } from '../ZenithLogo';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Language } from '@/lib/i18n';
import { NavItem } from './headerNav';

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  clinicName: string;
  lang: Language;
  onLanguageChange?: (lang: Language) => void;
  navItems: NavItem[];
  activeSection: string | null;
  onScrollToSection: (e: React.MouseEvent, sectionId: string) => void;
  onOpenBooking: () => void;
}

export function HeaderMobileMenu({
  isOpen,
  onClose,
  clinicName,
  lang,
  onLanguageChange,
  navItems,
  activeSection,
  onScrollToSection,
  onOpenBooking,
}: HeaderMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="fixed top-[66px] left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header Title & Language Selector */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ZenithLogo size={24} />
            <span className="text-xs font-black text-slate-800 tracking-tight">
              {clinicName}
            </span>
          </div>
          {onLanguageChange && (
            <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
          )}
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => onScrollToSection(e, item.id)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-brand-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-brand-600 translate-x-0.5' : 'text-slate-400'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Mobile Actions: Phone & Booking CTA */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
          <a
            href="tel:+442079460991"
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-600" />
            <span>Call Clinic: +44 20 7946 0991</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book Appointment Online</span>
          </button>
        </div>
      </div>
    </div>
  );
}
