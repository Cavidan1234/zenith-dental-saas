'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  HeartHandshake,
  Globe,
  MessageCircle,
  Camera,
  Link2,
  Check,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { ZenithLogo } from './ZenithLogo';

interface ClinicFooterProps {
  onOpenBooking?: () => void;
  clinicSlug?: string;
  animationKey?: number;
  entranceDirection?: 'up' | 'down';
}

export function ClinicFooter({
  animationKey = 0,
  entranceDirection = 'up',
}: ClinicFooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4500);
  };

  return (
    <footer key={animationKey} className="relative w-full overflow-hidden select-none bg-[#38bdf8]">
      {/* ========================================================= */}
      {/* ANIMATED FLUID SVG WAVES (Multi-layered Parallax Ocean)   */}
      {/* Layer 1: White background blend                           */}
      {/* Layer 2: Light transparent blue (Soft Depth)              */}
      {/* Layer 3: Vibrant Zenith Sky Blue (#38bdf8)                */}
      {/* ========================================================= */}
      <div className="relative w-full overflow-hidden bg-white select-none pointer-events-none leading-none -mb-1">
        <svg
          className="relative w-full h-24 sm:h-32 md:h-40 block"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="zenith-wave-path"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="waves-parallax">
            {/* Layer 1 (Back): Ultra-soft ambient wave */}
            <use
              href="#zenith-wave-path"
              xlinkHref="#zenith-wave-path"
              x="48"
              y="0"
              fill="rgba(186, 230, 253, 0.75)"
              className="wave-layer-back"
            />
            {/* Layer 2 (Middle): Fluid translucent wave */}
            <use
              href="#zenith-wave-path"
              xlinkHref="#zenith-wave-path"
              x="48"
              y="2"
              fill="rgba(125, 211, 252, 0.85)"
              className="wave-layer-front"
            />
            {/* Layer 3 (Base): Zenith Brand Sky Blue (#38bdf8) */}
            <use
              href="#zenith-wave-path"
              xlinkHref="#zenith-wave-path"
              x="48"
              y="4"
              fill="#38bdf8"
              className="wave-layer-base"
            />
          </g>
        </svg>
      </div>

      {/* ========================================================= */}
      {/* FOOTER BODY (ZENITH SKY BLUE / #38bdf8)                */}
      {/* ========================================================= */}
      <div className="bg-[#38bdf8] text-slate-900 selection:bg-slate-900 selection:text-white relative overflow-hidden">
        {/* Subtle Ambient Light Shimmer */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-[250px] bg-white/20 blur-[90px] rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-[calc(4rem+env(safe-area-inset-bottom,28px))] sm:pb-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* COLUMN 1: Stay Connected & Newsletter (4 cols) */}
            <BlurReveal
              direction={entranceDirection}
              delay={60}
              duration={700}
              distance={24}
              className="lg:col-span-4 space-y-4"
            >
              <div className="flex items-center gap-2.5 group cursor-pointer select-none">
                {/* Interactive Logo Badge with 3D Pop on hover */}
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-1 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out transform-gpu">
                  <ZenithLogo size={28} />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors">
                  Stay Connected
                  <span className="text-slate-950 inline-block text-3xl font-black ml-0.5 group-hover:scale-150 group-hover:text-blue-700 transition-all duration-300 ease-out origin-center">
                    .
                  </span>
                </span>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed max-w-sm">
                Join our private Marylebone patient circle for seasonal oral health protocols, preventive care insights, and priority appointment notifications.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2 pt-1 max-w-sm">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full h-11 px-3.5 text-xs rounded-xl bg-white/90 border border-white text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/15 focus:border-slate-900 shadow-sm transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-slate-800 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>

                {/* Highly Animated Metallic Sheen Subscribe Button */}
                <button
                  type="submit"
                  className={`group relative overflow-hidden w-full h-11 rounded-xl text-xs font-bold text-white shadow-lg transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer select-none transform-gpu active:scale-[0.98] ${
                    isSubscribed
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/25 ring-2 ring-emerald-400'
                      : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/30'
                  } before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none`}
                >
                  {isSubscribed ? (
                    <div className="flex items-center gap-2 text-white font-bold animate-in fade-in zoom-in-95 duration-300">
                      <span className="p-0.5 rounded-full bg-white/20 animate-pulse">
                        <Check className="w-4 h-4 text-white" />
                      </span>
                      <span>Subscribed! Welcome to VIP Care</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <span className="tracking-wide">Subscribe to Updates</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                    </>
                  )}
                </button>
              </form>
            </BlurReveal>

            {/* COLUMN 2: Quick Links (2 cols) - 100% stable, zero clipping, zero awkward lines */}
            <BlurReveal
              direction={entranceDirection}
              delay={60}
              duration={700}
              distance={24}
              className="lg:col-span-2 space-y-3.5"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-800 font-semibold">
                {[
                  { label: 'Home', href: '#' },
                  { label: 'Specialists', href: '#doctors' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'About & Guarantee', href: '#about' },
                  { label: 'Contact & Location', href: '#contact' },
                  { label: 'FAQ', href: '#faq' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 py-0.5 text-slate-800 hover:text-slate-950 transition-colors duration-200 cursor-pointer select-none"
                    >
                      {/* Clean dot indicator that turns into an active dark beacon on hover */}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900/35 group-hover:bg-slate-950 group-hover:scale-125 transition-transform duration-200 shrink-0" />
                      
                      {/* Rock-solid text: NO translation, NO scale shift, NO line underneath - every single character 100% visible */}
                      <span className="group-hover:text-slate-950 group-hover:font-extrabold transition-all duration-200">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </BlurReveal>

            {/* COLUMN 3: Contact Us & Surgery Hours (3 cols) - Clean text & icon, no gray card boxes, no table */}
            <BlurReveal
              direction={entranceDirection}
              delay={60}
              duration={700}
              distance={24}
              className="lg:col-span-3 space-y-4"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Contact Us
              </h4>
              
              {/* Clean contact list without gray boxes, simply scales slightly on hover */}
              <div className="space-y-3 text-xs text-slate-800 font-medium">
                {/* 1. Address */}
                <a
                  href="https://maps.google.com/?q=42+Harley+Street+Marylebone+London+W1G+9PR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 transition-all duration-200 hover:scale-[1.03] hover:text-slate-950 origin-left cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-slate-900 shrink-0 mt-0.5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                  <span className="leading-snug">42 Harley Street, Marylebone, London, W1G 9PR</span>
                </a>

                {/* 2. Phone */}
                <a
                  href="tel:+442079460991"
                  className="group flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.03] hover:text-slate-950 origin-left cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-slate-900 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span className="font-bold leading-snug">+44 (0) 20 7946 0991</span>
                </a>

                {/* 3. Email */}
                <a
                  href="mailto:care@zenithdental.com"
                  className="group flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.03] hover:text-slate-950 origin-left cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-900 shrink-0 transition-transform duration-300 group-hover:scale-115" />
                  <span className="font-semibold leading-snug">care@zenithdental.com</span>
                </a>
              </div>

              {/* Surgery Hours: Clean editorial typography, no table, no card border, no 'open today' */}
              <div className="pt-2 space-y-2 border-t border-slate-900/10">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  Surgery Hours
                </h5>
                <div className="space-y-1.5 text-xs text-slate-800 font-medium">
                  <div className="group flex items-center justify-between transition-transform duration-200 hover:scale-[1.02] origin-left">
                    <span className="text-slate-700">Mon – Fri</span>
                    <span className="font-bold text-slate-900">09:00 – 18:00</span>
                  </div>
                  <div className="group flex items-center justify-between transition-transform duration-200 hover:scale-[1.02] origin-left">
                    <span className="text-slate-700">Saturday</span>
                    <span className="font-bold text-slate-900">10:00 – 15:00</span>
                  </div>
                  <div className="group flex items-center justify-between transition-transform duration-200 hover:scale-[1.02] origin-left">
                    <span className="text-slate-700">Sunday</span>
                    <span className="font-bold text-slate-950">Emergency Only</span>
                  </div>
                </div>
              </div>
            </BlurReveal>

            {/* COLUMN 4: Follow Us & Accreditations (3 cols) - Ideal as requested */}
            <BlurReveal
              direction={entranceDirection}
              delay={60}
              duration={700}
              distance={24}
              className="lg:col-span-3 space-y-3.5"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Follow Us
              </h4>

              {/* 4 Tactile Micro-Animated Social Media Icons with 3D Magnetic Lift */}
              <div className="flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Website"
                  className="group relative w-10 h-10 rounded-xl bg-white/70 hover:bg-blue-600 text-slate-900 hover:text-white border border-white/80 hover:border-blue-500 transition-all duration-300 ease-out flex items-center justify-center shadow-xs hover:shadow-md hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer transform-gpu"
                >
                  <Globe className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-300" />
                </a>

                <a
                  href="#"
                  aria-label="Direct Desk Chat"
                  className="group relative w-10 h-10 rounded-xl bg-white/70 hover:bg-emerald-600 text-slate-900 hover:text-white border border-white/80 hover:border-emerald-500 transition-all duration-300 ease-out flex items-center justify-center shadow-xs hover:shadow-md hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer transform-gpu"
                >
                  <MessageCircle className="w-4.5 h-4.5 group-hover:-rotate-12 transition-transform duration-300" />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="group relative w-10 h-10 rounded-xl bg-white/70 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-900 hover:text-white border border-white/80 hover:border-transparent transition-all duration-300 ease-out flex items-center justify-center shadow-xs hover:shadow-md hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer transform-gpu"
                >
                  <Camera className="w-4.5 h-4.5 group-hover:scale-115 transition-transform duration-300" />
                </a>

                <a
                  href="#"
                  aria-label="GDC Registry"
                  className="group relative w-10 h-10 rounded-xl bg-white/70 hover:bg-slate-950 text-slate-900 hover:text-white border border-white/80 hover:border-slate-800 transition-all duration-300 ease-out flex items-center justify-center shadow-xs hover:shadow-md hover:-translate-y-1.5 hover:scale-105 active:scale-95 cursor-pointer transform-gpu"
                >
                  <Link2 className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300" />
                </a>
              </div>

              {/* Accreditations with Smooth Hover Cards */}
              <div className="space-y-2.5 pt-1">
                <div className="group p-3 rounded-xl bg-white/60 hover:bg-white/90 backdrop-blur-xs border border-white/80 hover:border-white space-y-0.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-115 transition-transform duration-200" />
                    <span>CQC Approved Suite</span>
                  </div>
                  <p className="text-[10px] text-slate-700 leading-tight">
                    Care Quality Commission Rating: Outstanding
                  </p>
                </div>

                <div className="group p-3 rounded-xl bg-white/60 hover:bg-white/90 backdrop-blur-xs border border-white/80 hover:border-white space-y-0.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Award className="w-4 h-4 text-brand-700 group-hover:scale-115 group-hover:rotate-6 transition-transform duration-200" />
                    <span>GDC Certified Specialists</span>
                  </div>
                  <p className="text-[10px] text-slate-700 leading-tight">
                    General Dental Council Registered Surgeons
                  </p>
                </div>
              </div>
            </BlurReveal>

          </div>

          {/* ========================================================= */}
          {/* BOTTOM DISCLAIMER & COPYRIGHT                             */}
          {/* ========================================================= */}
          <BlurReveal
            direction={entranceDirection}
            delay={160}
            duration={700}
            distance={20}
            className="mt-12 pt-8 border-t border-slate-900/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-800 font-medium"
          >
            <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
              <span>© {new Date().getFullYear()} Zenith Dental & Esthetics. All rights reserved.</span>
              <span className="hidden md:inline text-slate-600">·</span>
              <span className="text-slate-800">Zero-PHI Architecture (GDPR & HIPAA Compliant)</span>
              <span className="hidden md:inline text-slate-600">·</span>
              <a
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-1 text-slate-950 font-bold hover:text-black transition-colors"
              >
                <span>Staff Portal Login</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>

            {/* HeartHandshake with beating heart micro-animation on hover */}
            <div className="group flex items-center gap-2 text-slate-800 text-[11px] font-semibold cursor-pointer select-none">
              <HeartHandshake className="w-4 h-4 text-slate-900 group-hover:text-red-700 group-hover:scale-125 transition-all duration-300" />
              <span className="group-hover:text-slate-950 transition-colors">Harley Street Dental Excellence</span>
            </div>
          </BlurReveal>
        </div>
      </div>
    </footer>
  );
}
