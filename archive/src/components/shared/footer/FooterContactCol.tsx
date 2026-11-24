'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';

interface FooterContactColProps {
  entranceDirection?: 'up' | 'down';
}

export function FooterContactCol({ entranceDirection = 'up' }: FooterContactColProps) {
  return (
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
      
      {/* Contact list with subtle scale on hover */}
      <div className="space-y-3 text-xs text-slate-800 font-medium">
        {/* 1. Address */}
        <a
          href="https://maps.google.com/?q=14+Harley+Street+Marylebone+London+W1G+9PQ"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-2.5 transition-all duration-200 hover:scale-[1.03] hover:text-slate-950 origin-left cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-slate-900 shrink-0 mt-0.5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
          <span className="leading-snug">14 Harley Street, Marylebone, London, W1G 9PQ</span>
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

      {/* Surgery Hours */}
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
  );
}
