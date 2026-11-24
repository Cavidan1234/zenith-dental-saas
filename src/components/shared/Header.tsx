'use client';

import React, { useState, useEffect } from 'react';
import { ZenithLogo } from './ZenithLogo';
import {
  Calendar,
  Phone,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onLogoClick?: (e: React.MouseEvent) => void;
  clinicName?: string;
  slug?: string;
  lang?: any;
  onLanguageChange?: (lang: any) => void;
}

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'doctors', label: 'Specialists', shortLabel: 'Doctors', icon: Stethoscope },
  { id: 'pricing', label: 'Pricing & Treatments', shortLabel: 'Pricing', icon: Sparkles },
  { id: 'about', label: 'About & Guarantee', shortLabel: 'About', icon: ShieldCheck },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact', icon: MapPin },
  { id: 'faq', label: 'FAQ', shortLabel: 'FAQ', icon: HelpCircle },
];

export function Header({
  onOpenBooking,
  onLogoClick,
  clinicName = 'Zenith Dental',
  slug = 'zenith-dental',
}: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Optimized Scroll & ScrollSpy tracking (Hidden in Hero, slides in when scrolled slightly)
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // 1. Hidden in Hero section; reveals smoothly when scrolled slightly (Threshold: 40px)
          const isScrolled = scrollY > 40;
          setIsVisible(isScrolled);

          // 2. ScrollSpy Active Section Detection
          if (scrollY < 220) {
            setActiveSection(null);
          } else {
            const headerOffset = 110;
            let foundSection: string | null = null;

            for (const item of NAV_ITEMS) {
              const el = document.getElementById(item.id);
              if (el) {
                const top = el.offsetTop - headerOffset;
                const bottom = top + el.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                  foundSection = item.id;
                  break;
                }
              }
            }

            // Bottom of page safety check (highlights FAQ when reached footer area)
            if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 70) {
              foundSection = 'faq';
            }

            setActiveSection(foundSection);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Silky Smooth Section Scroll with Exact 66px Header Offset
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerOffset = 66;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    window.history.pushState(null, '', `#${sectionId}`);
    setActiveSection(sectionId);
  };

  // Logo Click: Return Smoothly to Top and hide header
  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', window.location.pathname);
    setActiveSection(null);
    setIsVisible(false);
    if (onLogoClick) {
      onLogoClick(e);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-hidden h-[66px] bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-md shadow-slate-900/5 text-slate-800 transition-all duration-300 ease-out select-none transform-gpu ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between max-w-full overflow-hidden">
          {/* LEFT: Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
            <a
              href={`/b/${slug}`}
              onClick={handleBrandClick}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer min-w-0"
              title="Return to top"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform-gpu group-hover:scale-105 shadow-sm border border-slate-200/80 bg-white p-1 shrink-0">
                <ZenithLogo size={26} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm sm:text-lg tracking-tight transition-colors duration-200 text-slate-900 group-hover:text-brand-600 leading-tight truncate">
                  {clinicName}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-slate-400 group-hover:text-brand-500 transition-colors truncate">
                  Marylebone · London
                </span>
              </div>
            </a>
          </div>

          {/* CENTER: Desktop Navigation Menu with ScrollSpy & Animated Hover */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`group relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                    isActive
                      ? 'text-brand-600 font-black'
                      : 'text-slate-600 hover:text-brand-600'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-all duration-200 transform-gpu ${
                      isActive
                        ? 'scale-115 text-brand-600'
                        : 'text-slate-400 group-hover:text-brand-600 group-hover:scale-125'
                    }`}
                  />
                  <span className="transition-colors duration-200">{item.label}</span>

                  {/* Delicate Bottom Glow Accent Line: Expands on hover, persistent when active */}
                  <span
                    className={`absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-full bg-brand-600 transition-all duration-250 ease-out origin-center transform-gpu ${
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Direct Phone Link, Booking CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
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
              className="group/btn relative overflow-hidden inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all duration-300 cursor-pointer active:scale-95 transform-gpu text-white bg-brand-600 hover:bg-brand-700 hover:shadow-brand-600/35 hover:-translate-y-0.5 shrink-0"
            >
              {/* Subtle ambient light sweep across button */}
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/btn:scale-110 text-white shrink-0" />
              <span className="tracking-tight whitespace-nowrap hidden sm:inline">Book Appointment</span>
              <span className="tracking-tight whitespace-nowrap sm:hidden">Book</span>
            </button>

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors duration-200 active:scale-90 text-slate-700 hover:text-brand-600 hover:bg-slate-100 shrink-0"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE / TABLET FROSTED GLASS DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-[66px] left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ZenithLogo size={24} />
                <span className="text-xs font-black text-slate-800 tracking-tight">
                  {clinicName}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Direct Navigation
              </span>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
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

              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition-colors"
              >
                <span>Staff Portal Login ↗</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
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
      )}
    </>
  );
}
