'use client';

import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { ServiceItem, DoctorItem } from './Step1ServiceDoctor';

interface Step2DateSlotProps {
  selectedDoctor: DoctorItem | null;
  selectedService: ServiceItem | null;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableSlots: Array<{ time: string; available: boolean; bufferMinutes?: number }>;
  loadingSlots: boolean;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function Step2DateSlot({
  selectedDoctor,
  selectedService,
  selectedDate,
  onSelectDate,
  availableSlots,
  loadingSlots,
  selectedSlot,
  onSelectSlot,
  onBack,
  onContinue,
}: Step2DateSlotProps) {
  return (
    <div className="space-y-4 step-view-enter">
      {/* Doctor & Service Mini Summary Banner */}
      <div className="bg-brand-50/70 p-3 sm:p-3.5 rounded-2xl border border-brand-100 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          {selectedDoctor && (
            <img
              src={selectedDoctor.avatarUrl}
              alt={selectedDoctor.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
            />
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Selected Specialist:
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {selectedDoctor?.name}
            </p>
            <p className="text-[11px] text-brand-700 font-medium truncate">
              {selectedService?.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-brand-700 hover:text-brand-900 underline shrink-0 cursor-pointer"
        >
          Change
        </button>
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-1.5">
          Select Appointment Date
        </label>
        <div className="flex items-center gap-3">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 bg-white shadow-2xs"
          />
          <span className="text-xs text-slate-500 font-medium">
            Clinic hours: Mon–Fri 09:00 - 18:00
          </span>
        </div>
      </div>

      {/* Time Slots Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Available Time Slots
          </label>
          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
            15 min Room Sterilization Applied
          </span>
        </div>

        <div className="min-h-[168px] relative flex flex-col justify-center">
          {loadingSlots ? (
            <div className="h-full flex flex-col items-center justify-center py-8 text-slate-500">
              <Clock className="w-7 h-7 text-brand-600 animate-spin mb-2" />
              <span className="text-xs font-bold">Synchronizing Doctor&apos;s Schedule...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map(({ time, available }) => {
                const isSelected = selectedSlot === time;
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={!available}
                    onClick={() => onSelectSlot(time)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 select-none cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-500 scale-[1.02]'
                        : available
                        ? 'bg-white hover:bg-brand-50 text-slate-800 border border-slate-200 hover:border-brand-300 shadow-2xs active:scale-95'
                        : 'bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Step 2 Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          ‹ Back
        </button>

        <button
          type="button"
          disabled={!selectedSlot || loadingSlots}
          onClick={onContinue}
          className="px-6 sm:px-8 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md shadow-brand-600/25 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Continue to Patient Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
