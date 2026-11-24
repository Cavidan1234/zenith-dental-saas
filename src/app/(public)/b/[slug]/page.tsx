'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroStickerShowcase from '@/components/ui/hero-sticker-showcase';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { ClinicFooter } from '@/components/shared/ClinicFooter';
import { Language } from '@/lib/i18n';

const BookingModal = dynamic(
  () => import('@/components/booking/BookingModal').then((m) => m.BookingModal),
  { ssr: false }
);
import { AboutGuaranteeSection } from '@/components/shared/AboutGuaranteeSection';
import { ContactSection } from '@/components/shared/ContactSection';
import { FaqSection } from '@/components/shared/FaqSection';
import { BlurReveal, KineticBlurText } from '@/components/ui/blur-reveal';
import {
  AnimatedScanIcon,
  AnimatedSparklesIcon,
  AnimatedGemIcon,
  AnimatedShieldCheckIcon,
  AnimatedHeartPulseIcon,
  MicroScanReticleIcon,
  MicroSonicWaveIcon,
  MicroAuditChartIcon,
  MicroToothBiteIcon,
  MicroLaserRayIcon,
  MicroEnamelShieldIcon,
  MicroGumBarrierIcon,
  MicroHomeKitIcon,
  MicroSmileCurveIcon,
  MicroCeramicLayersIcon,
  MicroDentalMirrorIcon,
  MicroShadeGuideIcon,
  MicroVolumetricCubeIcon,
  MicroSurgicalGuideIcon,
  MicroImplantPostIcon,
  MicroSafetyRadarIcon,
} from '@/components/icons/dental-animated';

export default function ClinicPublicPage({ params }: { params: { slug: string } }) {
  const [lang] = useState<Language>('en');
  const [heroKey, setHeroKey] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [selectedPricingId, setSelectedPricingId] = useState<string | null>(null);


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


  const clinicSlug = params?.slug || 'zenith-dental';

  // Smooth scroll to top and reset Hero animations fresh
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.scrollY < 120) {
      setHeroKey((prev) => prev + 1);
    } else {
      setTimeout(() => {
        setHeroKey((prev) => prev + 1);
      }, 350);
    }
  };

  // Helper to open booking modal with preselection
  const openBookingFor = (serviceId?: string, doctorId?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  // Cursor-tracking spotlight coordinates with zero layout thrashing (120 FPS)
  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as any)._cardRect = e.currentTarget.getBoundingClientRect();
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = (target as any)._cardRect || target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

  const services = [
    {
      id: 'srv-checkup',
      title: 'Comprehensive 3D Exam & Prophylaxis',
      category: 'Diagnostic & Preventive',
      desc: 'Digital intraoral 3D scan, periodontal bone health check, oral cancer screening, and gentle ultrasonic cleaning.',
      highlights: [
        { text: 'Full-Arch 3D Intraoral Digital Scan', icon: MicroScanReticleIcon },
        { text: 'Swiss EMS Guided Biofilm Therapy', icon: MicroSonicWaveIcon },
        { text: '12-Point Periodontal & Enamel Audit', icon: MicroAuditChartIcon },
        { text: 'Digital Bite & Occlusion Analysis', icon: MicroToothBiteIcon },
      ],
      guarantee: '100% Pain-Free Ultrasonic Protocol',
      duration: '45 mins',
      price: '£80',
      deposit: '£25 deposit',
      icon: AnimatedScanIcon,
    },
    {
      id: 'srv-whitening',
      title: 'Laser Teeth Whitening (In‑Office)',
      category: 'Cosmetic Dentistry',
      desc: 'Medical-grade diode laser activation providing up to 8 shades of whitening with zero dentin hypersensitivity.',
      highlights: [
        { text: 'Philips Zoom & Diode Laser Activation', icon: MicroLaserRayIcon },
        { text: 'Nano-Hydroxyapatite Enamel Armor', icon: MicroEnamelShieldIcon },
        { text: 'Gingival Barrier Protection Shield', icon: MicroGumBarrierIcon },
        { text: 'Custom Take-Home Maintenance Kit', icon: MicroHomeKitIcon },
      ],
      guarantee: 'Zero Sensitivity Desensitizing Gel',
      duration: '60 mins',
      price: '£250',
      deposit: '£50 deposit',
      icon: AnimatedSparklesIcon,
    },
    {
      id: 'srv-veneers',
      title: 'Porcelain Veneer Smile Design',
      category: 'Aesthetic Artistry',
      desc: 'Digital Smile Design (DSD) consultation, facial proportion mapping, and handcrafted ceramic veneers from Germany.',
      highlights: [
        { text: '3D Facial & Lip-Line Smile Preview', icon: MicroSmileCurveIcon },
        { text: 'Hand-Layered Ivoclar E.max Ceramics', icon: MicroCeramicLayersIcon },
        { text: 'Trial Mock-Up Before Any Tooth Prep', icon: MicroDentalMirrorIcon },
        { text: 'Natural Translucency Shade Matching', icon: MicroShadeGuideIcon },
      ],
      guarantee: '10-Year German Ceramic Warranty',
      duration: '45 mins',
      price: '£120',
      deposit: '£30 deposit',
      icon: AnimatedGemIcon,
    },
    {
      id: 'srv-implant',
      title: 'Dental Implant Consultation & 3D CBCT',
      category: 'Implantology & Surgery',
      desc: 'Precision 3D bone volume scan, computer-guided implant planning, and lifetime-guaranteed titanium/zirconia options.',
      highlights: [
        { text: 'Low-Dose 3D CBCT Bone Tomography', icon: MicroVolumetricCubeIcon },
        { text: 'Digital Keyhole Surgical Guide Plan', icon: MicroSurgicalGuideIcon },
        { text: 'Straumann Swiss Titanium & Zirconia', icon: MicroImplantPostIcon },
        { text: '3D Nerve & Sinus Safety Mapping', icon: MicroSafetyRadarIcon },
      ],
      guarantee: 'Lifetime Structural Implant Guarantee',
      duration: '60 mins',
      price: '£150',
      deposit: '£50 deposit',
      icon: AnimatedShieldCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 selection:bg-brand-100 selection:text-brand-900 font-sans overflow-x-hidden max-w-full w-full" suppressHydrationWarning>
      {/* Modern Header */}
      <Header
        onOpenBooking={() => openBookingFor()}
        onLogoClick={handleLogoClick}
        clinicName="Zenith Dental"
        slug={clinicSlug}
      />

      <main className="overflow-x-hidden max-w-full w-full">
        {/* FULL-WIDTH HERO: Edge-to-edge Royal Blue Studio — Exact 100vh Full Screen */}
        <section className="w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#1d4ed8] to-[#1e3a8a]">
          <HeroStickerShowcase key={heroKey} onOpenBooking={openBookingFor} />
        </section>

        {/* ALL BODY CONTENT SECTIONS: Solid Pure White Background (Guarantees zero background bleed-through) */}
        <div className="w-full bg-white relative z-10">
          {/* CLINICAL SPECIALISTS (DOCTORS) SECTION */}
        <section
          id="doctors"
          className="w-full min-h-fit lg:h-[calc(100dvh-66px)] lg:min-h-[calc(100dvh-66px)] scroll-mt-[66px] relative overflow-visible lg:overflow-hidden bg-brand-50/40 border-b border-brand-100 flex flex-col justify-between py-6 sm:py-8 lg:pt-4 lg:pb-5 px-4 sm:px-6 lg:px-8 select-none box-border"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full flex-1 justify-between">
            {/* Section Header */}
            <BlurReveal
              direction="up"
              delay={0}
              className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-2 sm:mb-3 space-y-1 shrink-0"
            >
              <KineticBlurText
                text="Meet Our Senior Specialists"
                as="h2"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
                stagger={60}
              />
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Click below to view each specialist&apos;s live calendar and reserve your consultation directly.
              </p>
            </BlurReveal>

            {/* Doctor Cards Grid - Perfectly fits screen, comfortable natural height on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 max-w-5xl mx-auto w-full flex-1 min-h-0 pb-1 overflow-visible lg:overflow-hidden">
              {[
                {
                  id: 'doc-leyla',
                  name: 'Dr. Leyla Mammadova',
                  shortName: 'Dr. Leyla',
                  image: '/images/dental/doctor-leyla.jpg',
                  role: 'Lead Aesthetic Dentist & Orthodontist',
                  icon: Sparkles,
                  overview: 'Specialist in invisible aligners, digital smile design, and ultra-thin ceramic veneers with gentle, anxiety-free care.',
                  price: '£150',
                  depositNote: 'Per Consultation (Deducted from treatment)',
                  direction: 'up' as const,
                  delay: 120,
                },
                {
                  id: 'doc-rashad',
                  name: 'Dr. Rashad Aliyev',
                  shortName: 'Dr. Rashad',
                  image: '/images/dental/doctor-rashad.jpg',
                  role: 'Oral & Maxillofacial Surgeon',
                  icon: ShieldCheck,
                  overview: 'Expert in computer-guided 3D dental implants, complex bone grafting, and wisdom tooth extraction with minimal recovery time.',
                  price: '£180',
                  depositNote: 'Per Consultation (Deducted from implants)',
                  direction: 'up' as const,
                  delay: 240,
                },
              ].map((doc) => {
                const isExpanded = expandedDoctorId === doc.id;

                return (
                  <BlurReveal
                    key={doc.id}
                    direction={doc.direction}
                    delay={doc.delay}
                    blur={16}
                    distance={36}
                    className="h-full flex flex-col min-h-[460px] sm:min-h-[500px] md:min-h-0"
                  >
                    <div
                      onClick={() => setExpandedDoctorId(isExpanded ? null : doc.id)}
                      className={`group relative h-full w-full min-h-[460px] sm:min-h-[500px] md:min-h-0 rounded-[32px] overflow-hidden select-none shadow-xl hover:shadow-2xl transition-all duration-500 border ${
                        isExpanded ? 'border-brand-400 ring-2 ring-brand-400/30' : 'border-slate-200/70 hover:border-brand-400/80'
                      } bg-slate-900 flex-1 transform-gpu will-change-transform cursor-pointer`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {/* Full-Bleed Doctor Portrait - 100% Bright & Natural */}
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="absolute inset-0 w-full h-full object-cover object-top brightness-105 transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu will-change-transform pointer-events-none"
                      />

                      {/* Clean Bottom Gradient: Collapsed reaches only 50% so face is 100% unobstructed, expands smoothly on tap/hover */}
                      <div
                        className={`absolute inset-x-0 bottom-0 ${
                          isExpanded ? 'h-[76%] sm:h-[80%]' : 'h-[50%] sm:h-[55%] md:group-hover:h-[80%]'
                        } bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pointer-events-none transition-all duration-500`}
                      />

                      {/* Bottom Info & Action Container */}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col justify-end transition-all duration-500">
                        {/* Doctor Info */}
                        <div className="space-y-1 transform transition-transform duration-500 ease-out md:group-hover:-translate-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                              {doc.name}
                            </h3>
                            {/* Mobile Tap Toggle Chevron Indicator */}
                            <span
                              className={`md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white backdrop-blur-md transition-transform duration-300 ${
                                isExpanded ? 'rotate-180 bg-brand-500 text-white' : ''
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </span>
                          </div>

                          <p className="text-xs text-brand-300 font-bold uppercase tracking-wider">
                            {doc.role}
                          </p>

                          <div className="pt-1.5">
                            <p className="text-xs text-slate-200/90 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
                              {doc.overview}
                            </p>
                          </div>

                          {/* Subtle tap guidance when collapsed on mobile */}
                          <div
                            className={`md:hidden text-[10.5px] text-brand-200/90 font-medium pt-1 flex items-center gap-1 transition-all duration-300 ${
                              isExpanded ? 'opacity-0 max-h-0 overflow-hidden pt-0' : 'opacity-100 max-h-6'
                            }`}
                          >
                            <span>Tap card to view consultation fee & book</span>
                            <ChevronRight className="w-3 h-3 text-brand-300 inline" />
                          </div>
                        </div>

                        {/* Reveal on Tap (Mobile) / Reveal on Hover (Desktop): Consultation Fee + Book Button */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-out border-t ${
                            isExpanded
                              ? 'max-h-28 opacity-100 mt-3.5 pt-3.5 border-white/20 pointer-events-auto'
                              : 'max-h-0 opacity-0 mt-0 pt-0 border-transparent pointer-events-none'
                          } md:pointer-events-auto md:min-h-0 md:max-h-0 md:opacity-0 md:mt-0 md:pt-0 md:border-transparent md:group-hover:max-h-28 md:group-hover:opacity-100 md:group-hover:mt-4 md:group-hover:pt-4 md:group-hover:border-white/15`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="text-xl sm:text-2xl font-black text-white">
                                {doc.price}
                              </span>
                              <span className="text-[10px] sm:text-[11px] text-slate-300 block font-medium leading-tight">
                                {doc.depositNote}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openBookingFor(undefined, doc.id);
                              }}
                              className="px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full bg-white text-slate-900 hover:bg-brand-50 hover:text-brand-700 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 group/btn shrink-0 cursor-pointer"
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              <span>Book with {doc.shortName}</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
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

        {/* PRICING & TREATMENTS SECTION */}
        <section
          id="pricing"
          className="w-full min-h-[calc(100dvh-66px)] lg:h-[calc(100dvh-66px)] scroll-mt-[66px] relative overflow-hidden bg-white border-b border-slate-200 flex flex-col justify-between py-8 lg:py-5 px-4 sm:px-6 lg:px-8 select-none box-border"
        >
          {/* Supporting anchor for legacy or external #services links */}
          <span id="services" className="absolute -top-[66px]" />

          <div className="max-w-7xl mx-auto w-full flex flex-col h-full flex-1 justify-between gap-6 lg:gap-0">
            <BlurReveal
              direction="up"
              delay={0}
              className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-5 sm:mb-6 shrink-0"
            >
              <KineticBlurText
                text="Precision Dental Treatments"
                as="h2"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
                stagger={60}
              />
            </BlurReveal>

            {/* 4-Column Enriched Cards Grid (Pure CSS 120 FPS GPU Acceleration) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 flex-1 lg:min-h-0 w-full items-stretch pb-1 overflow-visible">
              {services.map((srv, idx) => {
                const IconComponent = srv.icon;
                const animInstanceKey = `${entranceAnimKey}`;

                return (
                  <BlurReveal
                    key={srv.id}
                    direction="up"
                    delay={60 + idx * 75}
                    blur={14}
                    distance={26}
                    className="h-full flex flex-col min-h-0 relative z-10 hover:z-30 transition-[z-index] overflow-visible"
                  >
                    <div
                      onMouseEnter={handleCardMouseEnter}
                      onMouseMove={handleCardMouseMove}
                      onClick={() => {
                        setSelectedPricingId(selectedPricingId === srv.id ? null : srv.id);
                      }}
                      className={`group relative h-full rounded-2xl sm:rounded-3xl p-[1px] flex flex-col origin-center transform-gpu will-change-transform select-none shadow-xs hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.12),0_8px_16px_-6px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out cursor-pointer ${
                        selectedPricingId === srv.id
                          ? 'scale-[1.025] -translate-y-1 shadow-lg ring-2 ring-brand-500'
                          : 'hover:scale-[1.025] hover:-translate-y-1 active:scale-[1.025] active:-translate-y-0.5'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {/* Spotlight Border Glow */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                        style={{
                          background:
                            'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.45), transparent 70%)',
                        }}
                      />

                      {/* Base Card Shell (Slightly more compact padding) */}
                      <div className="relative z-10 w-full h-full p-3.5 sm:p-4 rounded-[15px] sm:rounded-[22px] bg-white border border-slate-200/90 group-hover:border-transparent transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs">

                        {/* TOP: Header Icon + Category + Title + Desc */}
                        <div className="relative z-20 shrink-0">
                          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                              <IconComponent key={`main-${animInstanceKey}-${srv.id}`} size={20} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {srv.category}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 leading-snug line-clamp-2 min-h-0 md:min-h-[3rem]">
                            {srv.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 min-h-0 md:min-h-[3.6rem]">
                            {srv.desc}
                          </p>
                        </div>

                        {/* MIDDLE: Clean Open List */}
                        <div className="relative z-20 space-y-2 mt-2 mb-2">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-brand-600 transition-colors block">
                              Included in Visit
                            </span>
                          </div>

                          <ul className="space-y-1.5">
                            {srv.highlights.map((item, i) => {
                              const ItemIcon = item.icon;
                              return (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                                  <span className="text-brand-600 shrink-0 mt-0.5 p-1 rounded-md bg-brand-50/70 group-hover:bg-brand-100 transition-colors">
                                    <ItemIcon key={`item-${animInstanceKey}-${srv.id}-${i}`} size={13} />
                                  </span>
                                  <span className="leading-snug pt-0.5">{item.text}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* BOTTOM: Prominent Price, Duration, Guarantee & Tactile CTA */}
                        <div className="mt-auto pt-3 border-t border-slate-100/90 relative z-20 space-y-2.5">
                          {/* Clinical Guarantee Row */}
                          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                            <span className="text-slate-500 group-hover:text-brand-600 transition-colors">
                              <AnimatedHeartPulseIcon key={`pulse-${animInstanceKey}-${srv.id}`} size={14} />
                            </span>
                            <span className="truncate">{srv.guarantee}</span>
                          </div>

                          {/* Main Price & Deposit Highlight */}
                          <div className="flex items-baseline justify-between pt-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                {srv.price}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">/ visit</span>
                            </div>
                            <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full shadow-2xs">
                              {srv.deposit}
                            </span>
                          </div>

                          {/* Est. Duration & Sterilization Buffer */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                            <span>{srv.duration} (+15m buffer)</span>
                          </div>

                          {/* Prominent Tactile CTA Button with subtle luminous glow & hover micro-scale */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openBookingFor(srv.id);
                            }}
                            className="group/btn w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 border border-brand-500 shadow-md shadow-brand-600/20 hover:shadow-[0_4px_22px_rgba(37,99,235,0.45)] hover:brightness-105 hover:scale-[1.02] active:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <span>Reserve Treatment Slot</span>
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </BlurReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ABOUT CLINIC & 3-YEAR GUARANTEE SECTION */}
        <AboutGuaranteeSection />

        {/* CONTACT & CLINICAL LOCATION SECTION */}
        <ContactSection />

        {/* FAQ SECTION (Placed at the very end above footer) */}
        <FaqSection />
      </div>
      </main>

      {/* PROFESSIONAL LUXURY CLINIC FOOTER: Sky Blue with seamless bottom coverage */}
      <div className="w-full bg-[#38bdf8] relative z-0">
        <ClinicFooter
          onOpenBooking={() => openBookingFor()}
          clinicSlug={clinicSlug}
          entranceDirection="up"
        />
      </div>

      {/* The Booking Modal (lazy-loaded on demand) */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          lang={lang}
          preselectedServiceId={selectedServiceId}
          preselectedDoctorId={selectedDoctorId}
          tenantSlug={clinicSlug}
        />
      )}
    </div>
  );
}
