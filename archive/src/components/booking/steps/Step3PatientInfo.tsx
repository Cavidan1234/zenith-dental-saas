'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ServiceItem, DoctorItem } from './Step1ServiceDoctor';

interface Step3PatientInfoProps {
  selectedDoctor: DoctorItem | null;
  selectedService: ServiceItem | null;
  selectedDate: string;
  selectedSlot: string | null;
  fullName: string;
  onChangeFullName: (name: string) => void;
  email: string;
  onChangeEmail: (email: string) => void;
  phone: string;
  onChangePhone: (phone: string) => void;
  notes: string;
  onChangeNotes: (notes: string) => void;
  gdprConsent: boolean;
  onChangeGdprConsent: (consent: boolean) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function Step3PatientInfo({
  selectedDoctor,
  selectedService,
  selectedDate,
  selectedSlot,
  fullName,
  onChangeFullName,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  notes,
  onChangeNotes,
  gdprConsent,
  onChangeGdprConsent,
  onBack,
  onSubmit,
}: Step3PatientInfoProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 step-view-enter">
      {/* Summary Bar */}
      <div className="bg-brand-50/90 p-3.5 sm:p-4 rounded-2xl border border-brand-200/90 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block mb-0.5">
            Confirmed Time Slot
          </span>
          <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            {selectedDate} at {selectedSlot} with {selectedDoctor?.name || 'Selected Specialist'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-500 block">Required Deposit</span>
          <p className="text-lg sm:text-xl font-black text-brand-700">
            ${selectedService ? selectedService.depositCents / 100 : 50} USD
          </p>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Smith"
            value={fullName}
            onChange={(e) => onChangeFullName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 bg-white shadow-2xs transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="john.smith@example.com"
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 bg-white shadow-2xs transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+44 7911 123456"
              value={phone}
              onChange={(e) => onChangePhone(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 bg-white shadow-2xs transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
            Special notes or symptoms (Optional)
          </label>
          <input
            type="text"
            placeholder="E.g. tooth sensitivity, first time consultation"
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100 bg-white shadow-2xs transition-all"
          />
        </div>

        {/* GDPR Consent Card */}
        <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
          <input
            type="checkbox"
            checked={gdprConsent}
            onChange={(e) => onChangeGdprConsent(e.target.checked)}
            className="mt-0.5 w-4.5 h-4.5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer shrink-0"
          />
          <span className="text-xs text-slate-700 leading-relaxed font-medium">
            I agree to Zenith Dental recording my contact details solely for appointment confirmation and preventive 6-month hygiene reminders in compliance with GDPR. No medical PHI is stored on public servers.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3.5 mt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="group/back inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-extrabold text-slate-700 hover:text-brand-700 bg-white hover:bg-brand-50/70 border-2 border-slate-200/90 hover:border-brand-300 shadow-xs hover:shadow-md hover:shadow-brand-500/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer select-none"
        >
          <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/back:bg-brand-100 flex items-center justify-center text-slate-500 group-hover/back:text-brand-600 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
          </div>
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="group/cont inline-flex items-center gap-2 px-8 sm:px-10 py-3 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-600/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          <span>Continue to Payment &amp; Deposit</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/cont:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
