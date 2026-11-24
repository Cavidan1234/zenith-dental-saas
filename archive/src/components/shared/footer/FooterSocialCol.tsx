'use client';

import React from 'react';
import { Globe, MessageCircle, Camera, Link2, ShieldCheck, Award } from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';

interface FooterSocialColProps {
  entranceDirection?: 'up' | 'down';
}

export function FooterSocialCol({ entranceDirection = 'up' }: FooterSocialColProps) {
  return (
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

      {/* 4 Social Media Icons with 3D Magnetic Lift */}
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
  );
}
