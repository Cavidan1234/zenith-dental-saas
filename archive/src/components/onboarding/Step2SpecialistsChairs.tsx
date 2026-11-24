'use client';

import React from 'react';
import { Stethoscope } from 'lucide-react';
import { OnboardingClinicData } from './types';

interface Step2SpecialistsChairsProps {
  formData: OnboardingClinicData;
  onChange: (data: Partial<OnboardingClinicData>) => void;
}

export function Step2SpecialistsChairs({
  formData,
  onChange,
}: Step2SpecialistsChairsProps) {
  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
          <span>Step 2 of 4: Specialists &amp; Operating Rooms</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Add doctors &amp; chair capacities
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Each doctor gets a synchronized time-grid with automated sterilization buffers.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Lead Dental Surgeon / Medical Director *
          </label>
          <input
            type="text"
            value={formData.primaryDoctorName}
            onChange={(e) => onChange({ primaryDoctorName: e.target.value })}
            placeholder="e.g. Dr. Alistair Sterling"
            className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Specialization &amp; License Number
          </label>
          <input
            type="text"
            value={formData.primaryDoctorTitle}
            onChange={(e) => onChange({ primaryDoctorTitle: e.target.value })}
            placeholder="e.g. Lead Prosthodontist & Oral Surgeon (GDC #294012)"
            className="w-full h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Surgery Chairs Available
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 5].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onChange({ chairsCount: cnt })}
                  className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.chairsCount === cnt
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'Chair' : 'Chairs'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Post-Op Sterilization Buffer
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onChange({ bufferMinutes: mins })}
                  className={`h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.bufferMinutes === mins
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  +{mins} mins
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
