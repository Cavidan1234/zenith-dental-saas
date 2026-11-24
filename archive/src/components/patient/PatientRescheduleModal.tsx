'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RescheduleOption {
  date: string;
  time: string;
  day: string;
}

interface PatientRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: RescheduleOption[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  doctorName: string;
  onConfirm: () => void;
}

export function PatientRescheduleModal({
  isOpen,
  onClose,
  options,
  selectedIndex,
  onSelectIndex,
  doctorName,
  onConfirm,
}: PatientRescheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-brand-500/40 shadow-2xl space-y-5 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-5 h-5 text-brand-400" />
          <div>
            <h3 className="text-base font-bold text-white">Select a New Appointment Slot</h3>
            <p className="text-xs text-slate-400">
              Zero reschedule fee. Same-day room sterilization buffer guaranteed.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white cursor-pointer"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectIndex(idx)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedIndex === idx
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30 scale-[1.02]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-xs font-bold">{opt.day}</div>
            <div className="text-lg font-black font-mono mt-1">{opt.time}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">With {doctorName}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
        >
          Keep Current Slot
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/30 transition-all cursor-pointer active:scale-95"
        >
          Confirm Reschedule to {options[selectedIndex]?.day}
        </button>
      </div>
    </div>
  );
}
