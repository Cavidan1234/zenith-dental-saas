'use client';

import React, { useState, useEffect } from 'react';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';
import { Language } from '@/lib/i18n';
import { ClinicalPricingCard } from './pricing/ClinicalPricingCard';

interface ServiceHighlight {
  text: string;
  icon: React.ComponentType<{ size?: number; className?: string; key?: string }>;
}

export interface ClinicalServiceItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  highlights: ServiceHighlight[];
  guarantee: string;
  duration: string;
  price: string;
  deposit: string;
  icon: React.ComponentType<{ size?: number; className?: string; key?: string }>;
}

interface ClinicalPricingSectionProps {
  dict: any;
  lang: Language;
  services: ClinicalServiceItem[];
  onOpenBooking: (serviceId?: string) => void;
}

export function ClinicalPricingSection({
  dict,
  lang,
  services,
  onOpenBooking,
}: ClinicalPricingSectionProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [cardAnimKeys, setCardAnimKeys] = useState<Record<string, number>>({});
  const [entranceAnimKey, setEntranceAnimKey] = useState(0);

  // Trigger SVG draw animations upon pricing section entry into viewport
  useEffect(() => {
    const elem = document.getElementById('pricing');
    if (!elem) return;
    if (typeof IntersectionObserver === 'undefined') {
      setEntranceAnimKey(1);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntranceAnimKey((prev) => (prev === 0 ? 1 : prev));
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(elem);
    return () => observer.disconnect();
  }, []);

  const triggerCardRedraw = (cardId: string) => {
    setHoveredCardId(cardId);
    setCardAnimKeys((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 1,
    }));
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section
      id="pricing"
      className="w-full min-h-[calc(100dvh-66px)] lg:h-[calc(100dvh-66px)] scroll-mt-[66px] relative lg:overflow-hidden bg-white border-b border-slate-200 flex flex-col justify-between py-8 lg:py-5 px-4 sm:px-6 lg:px-8 select-none box-border"
    >
      {/* Supporting anchor for legacy or external #services links */}
      <span id="services" className="absolute -top-[66px]" />

      <div className="max-w-7xl mx-auto w-full flex flex-col h-full flex-1 justify-between gap-6 lg:gap-0">
        <BlurReveal
          direction="up"
          delay={0}
          className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-5 sm:mb-6 shrink-0"
        >
          <span className="text-[11px] font-mono tracking-widest text-brand-600 font-bold uppercase block mb-1">
            {lang === 'az' ? '[ 02 // QİYMƏTLƏR VƏ PROSEDURLAR ]' : lang === 'ru' ? '[ 02 // ПРОЦЕДУРЫ И ЦЕНЫ ]' : '[ 02 // PROCEDURES & SURGICAL FEES ]'}
          </span>
          <KineticBlurText
            text={dict.services.title}
            as="h2"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
            stagger={60}
          />
        </BlurReveal>

        {/* 4-Column Enriched Cards Grid with iOS Repulsion Physics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 flex-1 lg:min-h-0 w-full items-stretch pb-1">
          {services.map((srv, idx) => {
            const animInstanceKey = `${entranceAnimKey}-${cardAnimKeys[srv.id] || 0}`;
            const hoveredIndex = services.findIndex((s) => s.id === hoveredCardId);
            const isHovered = hoveredCardId === srv.id;

            // Dynamic iOS Repulsion Physics
            let transformStyle = 'scale(0.97) translateY(0px)';
            let zIndex = 10;
            let opacity = 1;
            let shadowClass = 'shadow-xs';

            if (hoveredIndex !== -1) {
              if (idx === hoveredIndex) {
                transformStyle = 'scale(1.038) translateY(-4px)';
                zIndex = 30;
                opacity = 1;
                shadowClass =
                  'shadow-[0_20px_40px_-10px_rgba(15,23,42,0.12),0_8px_16px_-6px_rgba(15,23,42,0.06)]';
              } else {
                const distance = idx - hoveredIndex;
                const shiftPx = distance > 0 ? (distance === 1 ? 14 : 8) : distance === -1 ? -14 : -8;
                transformStyle = `translateX(${shiftPx}px) scale(0.965)`;
                zIndex = 10;
                opacity = 0.92;
              }
            }

            return (
              <BlurReveal
                key={srv.id}
                direction="up"
                delay={60 + idx * 75}
                blur={14}
                distance={26}
                className={`h-full flex flex-col min-h-0 ${
                  isHovered ? 'z-30 relative' : 'z-10 relative'
                }`}
              >
                <ClinicalPricingCard
                  srv={srv}
                  lang={lang}
                  isHovered={isHovered}
                  animInstanceKey={animInstanceKey}
                  onMouseEnter={() => triggerCardRedraw(srv.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onMouseMove={handleCardMouseMove}
                  onSelect={() => onOpenBooking(srv.id)}
                  transformStyle={transformStyle}
                  zIndex={zIndex}
                  opacity={opacity}
                  shadowClass={shadowClass}
                />
              </BlurReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
