'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { OnboardingClinicData } from './types';

interface Step1PracticeIdentityProps {
  formData: OnboardingClinicData;
  onChange: (data: Partial<OnboardingClinicData>) => void;
  onNameChange: (name: string) => void;
  onSlugify: (name: string) => string;
}

export function Step1PracticeIdentity({
  formData,
  onChange,
  onNameChange,
  onSlugify,
}: Step1PracticeIdentityProps) {
  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 1 of 4: Practice Identity</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Name your dental practice &amp; URL
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          DentalBook.os provisions an enterprise-grade booking storefront with zero double bookings.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Clinic Official Name *
          </label>
          <input
            type="text"
            value={formData.clinicName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Mayfair Esthetic Surgery"
            className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Storefront Dedicated Slug (Subdomain)
          </label>
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden text-xs font-mono shadow-inner">
            <span className="px-3.5 text-slate-500 select-none border-r border-slate-800">
              dentalbook.os/b/
            </span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => onChange({ slug: onSlugify(e.target.value) })}
              className="flex-1 h-12 px-3 bg-transparent text-cyan-300 font-bold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="e.g. 24 Berkeley Square"
              className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              City &amp; Postal Code
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="e.g. London, W1J 6HE"
              className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Concierge Reception Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+44 20 7946 0912"
              className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Billing Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => onChange({ currency: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner cursor-pointer"
            >
              <option value="GBP (£)">British Pound — GBP (£)</option>
              <option value="USD ($)">United States Dollar — USD ($)</option>
              <option value="EUR (€)">Euro — EUR (€)</option>
              <option value="AZN (₼)">Azerbaijani Manat — AZN (₼)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
