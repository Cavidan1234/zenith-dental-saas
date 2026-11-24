'use client';

import React, { useState } from 'react';
import {
  Phone,
  Clock,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from './ContactSocialIcons';
import { ContactSocialCardItem } from './ContactSocialCardItem';

export function ContactDirectCards() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-0 gap-3 sm:gap-3.5">
      {/* 1. Main Reception Phone Card */}
      <BlurReveal
        direction="left"
        delay={60}
        duration={650}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="group relative overflow-hidden py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-brand-400 hover:ring-2 hover:ring-brand-500/10 transition-all duration-300 ease-out flex-1 flex flex-col justify-center before:absolute before:inset-0 before:-translate-x-full group-hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-blue-50/60 before:to-transparent before:transition-transform before:duration-700 before:pointer-events-none">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100 shadow-2xs group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                <Phone className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                  Main Clinic Reception & Bookings
                </span>
                <a
                  href="tel:+442079460991"
                  className="text-base sm:text-lg font-black text-slate-900 hover:text-brand-600 tracking-tight transition-colors leading-tight"
                >
                  +44 20 7946 0991
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToClipboard('+442079460991', 'phone')}
                title="Copy phone number"
                className="p-1.5 text-slate-400 hover:text-brand-600 hover:scale-125 hover:rotate-6 active:scale-90 transition-all duration-200 ease-out cursor-pointer flex items-center justify-center"
              >
                {copiedType === 'phone' ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <a
                href="tel:+442079460991"
                className="group/btn relative overflow-hidden px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-2xs hover:shadow-md hover:shadow-blue-500/25 hover:ring-2 hover:ring-brand-400/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:translate-y-0 transition-all duration-200 ease-out inline-flex items-center gap-1 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent before:transition-transform before:duration-500 before:ease-out"
              >
                <span className="relative z-10">Call Now</span>
                <ChevronRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 ease-out group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium flex items-center gap-1.5 relative z-10">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Monday – Friday: 08:30 – 19:30 · Dedicated patient liaison desk</span>
          </p>
        </div>
      </BlurReveal>

      {/* 2. WhatsApp Patient Concierge Card */}
      <ContactSocialCardItem
        delay={140}
        iconBgClass="bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:rotate-6"
        hoverBorderClass="hover:border-emerald-400"
        hoverRingClass="hover:ring-emerald-500/10"
        gradientShineClass="before:via-emerald-50/60"
        icon={<WhatsAppIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-emerald-600" />}
        categoryLabel="WhatsApp Patient Concierge"
        handle="+44 20 7946 0991"
        url="https://wa.me/442079460991"
        copyType="wa"
        copiedType={copiedType}
        onCopy={copyToClipboard}
        ctaText="Chat on WhatsApp"
        ctaButtonClass="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 hover:ring-emerald-400/40"
        description="Fast queries, treatment estimates, scheduling & photo consultations"
      />

      {/* 3. Official Instagram Card */}
      <ContactSocialCardItem
        delay={220}
        iconBgClass="bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white group-hover:rotate-6"
        hoverBorderClass="hover:border-pink-400"
        hoverRingClass="hover:ring-rose-500/10"
        gradientShineClass="before:via-pink-50/60"
        icon={<InstagramIcon className="w-5 h-5 text-white" />}
        categoryLabel="Official Studio Portfolio"
        handle="@zenith.dental.london"
        url="https://instagram.com"
        copyType="insta"
        copiedType={copiedType}
        onCopy={copyToClipboard}
        ctaText="View Instagram"
        ctaButtonClass="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 shadow-rose-500/30 hover:ring-rose-400/40"
        description="Smile transformations, surgical case breakdowns & clinical insights"
      />

      {/* 4. Official TikTok Card */}
      <ContactSocialCardItem
        delay={300}
        iconBgClass="bg-slate-950 text-white border border-slate-800 group-hover:-rotate-6"
        hoverBorderClass="hover:border-slate-500"
        hoverRingClass="hover:ring-slate-500/10"
        gradientShineClass="before:via-slate-100/60"
        icon={<TikTokIcon className="w-5 h-5 text-white" />}
        categoryLabel="Official TikTok Channel"
        handle="@zenith.dental"
        url="https://tiktok.com"
        copyType="tiktok"
        copiedType={copiedType}
        onCopy={copyToClipboard}
        ctaText="Watch on TikTok"
        ctaButtonClass="bg-slate-950 hover:bg-slate-900 shadow-slate-900/40 hover:ring-slate-700/60"
        description="Dental health guides, patient transformations & daily clinic reels"
      />
    </div>
  );
}
