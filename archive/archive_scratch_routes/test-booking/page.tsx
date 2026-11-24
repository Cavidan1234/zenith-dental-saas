'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SVGProps } from 'react';
import {
  Clock,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  MousePointerClick,
} from 'lucide-react';
import { BookingModal } from '@/components/booking/BookingModal';

/* ========================================================================== */
/* Animated Micro-SVGs for Price Cards                                        */
/* ========================================================================== */

type AnimatedIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function AnimatedScanIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="36" strokeDashoffset="36" d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="36;0" />
        </path>
        <path strokeDasharray="32" strokeDashoffset="32" d="M8.5 9c0-1.7 1.3-3 3.5-3s3.5 1.3 3.5 3c0 2.2-1 3.8-1.6 6-.3 1.1-1.1 1.1-1.9 0-.8 1.1-1.6 1.1-1.9 0C9.5 12.8 8.5 11.2 8.5 9Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.35s" values="32;0" />
        </path>
        <path strokeDasharray="20" strokeDashoffset="20" d="M4 12h16">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.25s" values="20;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedSparklesIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="64" strokeDashoffset="64" d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.45s" values="64;0" />
        </path>
        <path strokeDasharray="12" strokeDashoffset="12" d="M19 3v4M21 5h-4">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.25s" values="12;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedGemIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="60" strokeDashoffset="60" d="M6 3h12l4 6-10 12L2 9Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.45s" values="60;0" />
        </path>
        <path strokeDasharray="24" strokeDashoffset="24" d="M2 9h20">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.25s" values="24;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedShieldCheckIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="64" strokeDashoffset="64" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="64;0" />
        </path>
        <path strokeDasharray="14" strokeDashoffset="14" d="m9 12 2 2 4-4">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.2s" values="14;0" />
        </path>
      </g>
    </svg>
  );
}

function MicroScanReticleIcon({ size = 14, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="32" strokeDashoffset="0" d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MicroLaserRayIcon({ size = 14, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="30" strokeDashoffset="0" d="m13 2-2 7h5l-4 13 2-8h-5l4-12Z" />
    </svg>
  );
}

function MicroSmileCurveIcon({ size = 14, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13.5s1.5 3 4 3 4-3 4-3" />
    </svg>
  );
}

function MicroVolumetricCubeIcon({ size = 14, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

/* ========================================================================== */
/* Main Test Page Component                                                   */
/* ========================================================================== */

export default function TestBookingPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [cardsReplayKey, setCardsReplayKey] = useState(0);

  const openBooking = (serviceId?: string, doctorId?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  const replayCardsAnimation = () => {
    setCardsReplayKey((k) => k + 1);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const services = [
    {
      id: 'srv-checkup',
      title: 'Comprehensive 3D Exam & Prophylaxis',
      category: 'Diagnostic & Preventive',
      desc: 'Digital intraoral 3D scan, periodontal bone health check, oral cancer screening, and gentle ultrasonic cleaning.',
      highlight: 'Full-Arch 3D Intraoral Digital Scan',
      guarantee: '100% Pain-Free Ultrasonic Protocol',
      duration: '45 mins',
      price: '$80',
      deposit: '$25 deposit',
      icon: AnimatedScanIcon,
      microIcon: MicroScanReticleIcon,
    },
    {
      id: 'srv-whitening',
      title: 'Laser Teeth Whitening (In-Office)',
      category: 'Cosmetic Dentistry',
      desc: 'Medical-grade diode laser activation providing up to 8 shades of whitening with zero dentin hypersensitivity.',
      highlight: 'Philips Zoom & Diode Laser Activation',
      guarantee: 'Zero Sensitivity Desensitizing Gel',
      duration: '60 mins',
      price: '$250',
      deposit: '$50 deposit',
      icon: AnimatedSparklesIcon,
      microIcon: MicroLaserRayIcon,
    },
    {
      id: 'srv-veneers',
      title: 'Porcelain Veneer Smile Design',
      category: 'Aesthetic Artistry',
      desc: 'Digital Smile Design (DSD) consultation, facial proportion mapping, and handcrafted ceramic veneers.',
      highlight: '3D Facial & Lip-Line Smile Preview',
      guarantee: '10-Year German Ceramic Warranty',
      duration: '45 mins',
      price: '$120',
      deposit: '$30 deposit',
      icon: AnimatedGemIcon,
      microIcon: MicroSmileCurveIcon,
    },
    {
      id: 'srv-implant',
      title: 'Dental Implant Consultation & 3D CBCT',
      category: 'Implantology & Surgery',
      desc: 'Precision 3D bone volume scan, computer-guided implant planning, and lifetime-guaranteed titanium/zirconia.',
      highlight: 'Low-Dose 3D CBCT Bone Tomography',
      guarantee: 'Lifetime Structural Implant Guarantee',
      duration: '60 mins',
      price: '$150',
      deposit: '$50 deposit',
      icon: AnimatedShieldCheckIcon,
      microIcon: MicroVolumetricCubeIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Top Test Navigation Bar */}
      <header className="h-[66px] border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/b/zenith-dental"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Zenith Dental</span>
          </Link>
          <span className="h-4 w-[1px] bg-slate-200" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Booking Modal & Pricing Cards Lab
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Replay Cards Entrance Animation */}
          <button
            onClick={replayCardsAnimation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Replay cards entrance animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kartların Giriş Animasiyası</span>
          </button>

          {/* Direct Step 1 Launcher */}
          <button
            onClick={() => openBooking(undefined, undefined)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Open Modal (Step 1)</span>
          </button>
        </div>
      </header>

      {/* Guide Banner with Real-time Technical Verifications */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Modal Təkmilləşdirmələri və Dondurulmuş (Freeze) Arxitektura</span>
              </div>
              <p className="text-xs text-slate-600">
                Aşağıdakı qiymət kartlarına klikləyərək modalın daxil olma animasiyasını və 5 əsas düzəlişi canlı yoxlaya bilərsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Pill Box Silindi
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                İnteraktiv Stepper
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Lock className="w-3 h-3 text-indigo-600" />
                Scroll Lock: Aktiv
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Layers className="w-3 h-3 text-purple-600" />
                Hündürlük: Donduruldu (0px Tullanış)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-0.5">1. Sadə Başlıq (Simple Typography):</span>
              <span className="text-[11px]">«Zenith Dental · Instant Online Reservation» ətrafındakı qutu silinib, zərif təmiz mətn saxlanılıb.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-0.5">2. İnteraktiv Mərhələ Barı:</span>
              <span className="text-[11px]">Yuxarıdakı xətlər düyməyə çevrilib: 1, 2 və 3-cü addımlara birbaşa klikləyərək keçmək mümkündür.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-0.5">3. Freeze & Scroll Lock:</span>
              <span className="text-[11px]">Modal açılanda arxa fon skrolu donur, addımlar dəyişəndə isə modal yuxarı-aşağı tullanmır (hündürlüyü sabitdir).</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 1:1 Pricing Cards Section Viewport */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-center">
        <div className="text-center mb-6 space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Live Interactive Pricing Cards
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Precision Dental Treatments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Hər hansı kartın üzərinə və ya «Reserve Treatment Slot» düyməsinə klikləyərək dondurulmuş modalı və animasiyanı yoxlayın.
          </p>
        </div>

        {/* 4-Column Enriched Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {services.map((srv, idx) => {
            const IconComponent = srv.icon;
            const MicroIcon = srv.microIcon;
            const hoveredIndex = services.findIndex((s) => s.id === hoveredCardId);
            const isHovered = hoveredCardId === srv.id;

            let transformStyle = 'scale(0.98) translateY(0px)';
            let zIndex = 10;
            let shadowClass = 'shadow-xs';

            if (hoveredIndex !== -1) {
              if (idx === hoveredIndex) {
                transformStyle = 'scale(1.03) translateY(-4px)';
                zIndex = 30;
                shadowClass = 'shadow-xl shadow-brand-900/10';
              } else {
                const distance = idx - hoveredIndex;
                const shiftPx = distance > 0 ? (distance === 1 ? 8 : 4) : (distance === -1 ? -8 : -4);
                transformStyle = `translateX(${shiftPx}px) scale(0.97)`;
                zIndex = 10;
              }
            }

            const animDelay = idx * 90;

            return (
              <div
                key={`${cardsReplayKey}-${srv.id}`}
                onMouseEnter={() => setHoveredCardId(srv.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onMouseMove={handleCardMouseMove}
                onClick={() => openBooking()}
                style={{
                  transform: transformStyle,
                  zIndex,
                  animationDelay: `${animDelay}ms`,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease-out',
                }}
                className={`group relative rounded-3xl p-[1px] flex flex-col origin-center transform-gpu cursor-pointer select-none ${shadowClass} animate-in fade-in slide-in-from-bottom-6 duration-600 fill-mode-both ease-out`}
              >
                {/* Spotlight Border Glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background:
                      'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.35), transparent 70%)',
                  }}
                />

                {/* Base Card Shell */}
                <div className="relative z-10 w-full h-full p-5 rounded-[23px] bg-white border border-slate-200/90 group-hover:border-transparent transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  {/* TOP: Header Icon + Category + Title + Desc */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                        <IconComponent size={22} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {srv.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug min-h-[2.75rem]">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[3.25rem]">
                      {srv.desc}
                    </p>
                  </div>

                  {/* Feature Highlight Pill */}
                  <div className="mt-3 mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-brand-600 shrink-0">
                      <MicroIcon size={15} />
                    </span>
                    <span className="truncate">{srv.highlight}</span>
                  </div>

                  {/* BOTTOM: Price, Duration & CTA */}
                  <div className="mt-auto pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{srv.guarantee}</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 tracking-tight">
                          {srv.price}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">/ visit</span>
                      </div>
                      <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
                        {srv.deposit}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{srv.duration} (+15m buffer)</span>
                    </div>

                    {/* Book Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBooking();
                      }}
                      className="group/btn w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
                    >
                      <span>Reserve Treatment Slot</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* The Upgraded 3-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        lang="en"
        preselectedServiceId={selectedServiceId}
        preselectedDoctorId={selectedDoctorId}
        tenantSlug="zenith-dental"
      />
    </div>
  );
}
