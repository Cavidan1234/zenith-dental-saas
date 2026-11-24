'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { VIP_SLOTS, VipSlot } from '@/data/seedBookings';

interface RecallSlotSelectorProps {
  selectedSlot: string;
  onSelectSlot: (slotId: string) => void;
  recommendedDuration: number;
}

export function RecallSlotSelector({
  selectedSlot,
  onSelectSlot,
  recommendedDuration,
}: RecallSlotSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-brand-400" />
          <span>Choose Your Reserved Recall Slot</span>
        </h2>
        <span className="text-xs text-emerald-400 font-semibold">Priority Locked</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {VIP_SLOTS.map((slot: VipSlot) => {
          const isSelected = selectedSlot === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelectSlot(slot.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg shadow-brand-500/20 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {slot.period}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                )}
              </div>

              <div className="font-bold text-sm text-white">{slot.dayLabel}</div>
              <div className="text-xl font-extrabold text-brand-300 font-mono mt-1">{slot.time}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{recommendedDuration} mins</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
