'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  bufferMinutes: number;
  priceCents: number;
  depositCents: number;
  description: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatarUrl: string;
}

interface Step1ServiceDoctorProps {
  doctors: DoctorItem[];
  services: ServiceItem[];
  selectedDoctor: DoctorItem | null;
  selectedService: ServiceItem | null;
  onSelectDoctor: (doctor: DoctorItem) => void;
  onSelectService: (service: ServiceItem) => void;
  onContinue: () => void;
}

export function Step1ServiceDoctor({
  doctors,
  services,
  selectedDoctor,
  selectedService,
  onSelectDoctor,
  onSelectService,
  onContinue,
}: Step1ServiceDoctorProps) {
  return (
    <div className="space-y-4 step-view-enter">
      {/* Specialist Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            1. Select Your Specialist Doctor
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {doctors.map((doc) => {
            const isSelected = selectedDoctor?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc)}
                className={`group relative p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 shadow-sm shadow-brand-500/10'
                    : 'border-slate-200 hover:border-brand-300 bg-white hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {doc.name}
                      </h5>
                      {isSelected ? (
                        <span className="text-[10px] font-extrabold text-white bg-brand-600 px-2 py-0.5 rounded-full shrink-0">
                          Selected
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-brand-600 shrink-0">
                          Choose →
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-brand-700 truncate mt-0.5">
                      {doc.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {doc.specialization}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Treatment Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            2. Choose Treatment
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {services.map((srv) => {
            const isSelected = selectedService?.id === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => onSelectService(srv)}
                className={`group relative p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 shadow-sm shadow-brand-500/10'
                    : 'border-slate-200 hover:border-brand-300 bg-white hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {srv.category}
                    </span>
                    <span className="text-sm font-black text-brand-700">
                      ${srv.priceCents / 100}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">
                    {srv.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100/90 mt-2 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-brand-600" />
                    {srv.durationMinutes}m (+{srv.bufferMinutes}m)
                  </span>
                  <span className="text-brand-700 font-extrabold">
                    ${srv.depositCents / 100} Deposit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1 Action Button */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          disabled={!selectedDoctor || !selectedService}
          onClick={onContinue}
          className="px-8 sm:px-12 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-600/30 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Available Slots</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
