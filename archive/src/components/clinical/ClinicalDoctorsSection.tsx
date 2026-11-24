'use client';

import React from 'react';
import { Sparkles, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';
import { Language } from '@/lib/i18n';

interface ClinicalDoctorsSectionProps {
  dict: any;
  lang: Language;
  customTenant?: {
    primaryDoctorName?: string;
    primaryDoctorTitle?: string;
  } | null;
  onOpenBooking: (serviceId?: string, doctorId?: string) => void;
}

export function ClinicalDoctorsSection({
  dict,
  lang,
  customTenant,
  onOpenBooking,
}: ClinicalDoctorsSectionProps) {
  const doctors = [
    {
      id: 'doc-leyla',
      name: customTenant?.primaryDoctorName || 'Dr. Leyla Mammadova',
      shortName: customTenant?.primaryDoctorName
        ? customTenant.primaryDoctorName.split(' ')[0] +
          ' ' +
          (customTenant.primaryDoctorName.split(' ')[1] || '')
        : 'Dr. Leyla',
      image: '/images/dental/doctor-leyla.jpg',
      badge: customTenant ? 'Lead Practice Surgeon' : 'BDS, MSc London · 12 Yrs Exp',
      role: customTenant?.primaryDoctorTitle || 'Lead Aesthetic Dentist & Orthodontist',
      suite: 'Harley Street Suite A',
      icon: Sparkles,
      overview:
        'Specialist in invisible aligners, digital smile design, and ultra-thin ceramic veneers with gentle, anxiety-free care.',
      price: '£150',
      depositNote: 'Per Consultation (Deducted from treatment)',
      direction: 'left' as const,
      delay: 120,
    },
    {
      id: 'doc-rashad',
      name: 'Dr. Rashad Aliyev',
      shortName: 'Dr. Rashad',
      image: '/images/dental/doctor-rashad.jpg',
      badge: 'DDS, PhD Geneva · 14 Yrs Exp',
      role: 'Oral & Maxillofacial Surgeon',
      suite: 'Harley Street Suite B',
      icon: ShieldCheck,
      overview:
        'Expert in computer-guided 3D dental implants, complex bone grafting, and wisdom tooth extraction with minimal recovery time.',
      price: '£180',
      depositNote: 'Per Consultation (Deducted from implants)',
      direction: 'right' as const,
      delay: 240,
    },
  ];

  return (
    <section
      id="doctors"
      className="w-full min-h-[calc(100dvh-66px)] h-[calc(100dvh-66px)] scroll-mt-[66px] relative overflow-hidden bg-brand-50/40 border-b border-brand-100 flex flex-col justify-between pt-4 sm:pt-5 pb-4 sm:pb-5 px-4 sm:px-6 lg:px-8 select-none box-border"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full flex-1 justify-between">
        {/* Section Header */}
        <BlurReveal
          direction="up"
          delay={0}
          className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-2 sm:mb-3 space-y-1 shrink-0"
        >
          <span className="text-[11px] font-mono tracking-widest text-brand-600 font-bold uppercase block mb-1">
            {lang === 'az' ? '[ 01 // HƏKİM CƏRRAHLAR ]' : lang === 'ru' ? '[ 01 // ВЕДУЩИЕ ХИРУРГИ ]' : '[ 01 // LEAD CLINICAL SURGEONS ]'}
          </span>
          <KineticBlurText
            text={dict.doctors.title}
            as="h2"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
            stagger={60}
          />
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {dict.doctors.subtitle}
          </p>
        </BlurReveal>

        {/* Doctor Cards Grid - Perfectly fits visible screen height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 max-w-5xl mx-auto w-full flex-1 min-h-0 pb-1">
          {doctors.map((doc) => (
            <BlurReveal
              key={doc.id}
              direction={doc.direction}
              delay={doc.delay}
              blur={16}
              distance={36}
              className="h-full flex flex-col min-h-0"
            >
              <div
                onClick={() => onOpenBooking(undefined, doc.id)}
                className="group relative h-full w-full rounded-[32px] overflow-hidden cursor-pointer select-none shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200/70 hover:border-brand-400/80 bg-slate-900 flex-1"
              >
                {/* Full-Bleed Doctor Portrait */}
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="absolute inset-0 w-full h-full object-cover object-top brightness-105 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Clean Bottom Gradient for Text Legibility */}
                <div className="absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none transition-all duration-500" />

                {/* Bottom Info & Action Container */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end transition-all duration-500">
                  <div className="space-y-1 transform transition-transform duration-500 ease-out md:group-hover:-translate-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                        {doc.badge}
                      </span>
                      <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-400" />
                        {doc.suite}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                      {doc.name}
                    </h3>

                    <p className="text-xs text-brand-300 font-bold uppercase tracking-wider">
                      {doc.role}
                    </p>

                    <div className="pt-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                        OVERVIEW
                      </span>
                      <p className="text-xs text-slate-200/90 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
                        {doc.overview}
                      </p>
                    </div>
                  </div>

                  {/* Reveal on Hover: Consultation Fee + Book Button */}
                  <div className="overflow-hidden transition-all duration-500 ease-out max-h-20 opacity-100 mt-4 pt-4 border-t border-white/15 md:max-h-0 md:opacity-0 md:mt-0 md:pt-0 md:border-transparent md:group-hover:max-h-20 md:group-hover:opacity-100 md:group-hover:mt-4 md:group-hover:pt-4 md:group-hover:border-white/15">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-white">
                          {doc.price}
                        </span>
                        <span className="text-[10px] text-slate-300 block font-medium">
                          {doc.depositNote}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBooking(undefined, doc.id);
                        }}
                        className="px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-white text-slate-900 hover:bg-brand-50 hover:text-brand-700 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-1.5 transition-all active:scale-95 group/btn shrink-0 cursor-pointer"
                      >
                        <span>
                          {lang === 'az'
                            ? `${doc.shortName} ilə qəbul`
                            : lang === 'ru'
                            ? `Запись к ${doc.shortName}`
                            : `Book with ${doc.shortName}`}
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
