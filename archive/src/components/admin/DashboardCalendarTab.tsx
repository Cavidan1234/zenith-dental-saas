'use client';

import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { BookingRecord } from './PatientDossierDrawer';
import { CalendarOperatoryRadar } from './calendar/CalendarOperatoryRadar';
import { CalendarOperatoryFilterBar } from './calendar/CalendarOperatoryFilterBar';

export interface ScheduleSlot {
  time: string;
  defaultLeyla: string;
  defaultRashad: string;
  isPast?: boolean;
  isCurrent?: boolean;
  isBreak?: boolean;
}

interface DashboardCalendarTabProps {
  scheduleSlots: ScheduleSlot[];
  bookings: BookingRecord[];
  selectedDoctorFilter: string;
  onSelectDoctorFilter: (filter: string) => void;
  onOpenWalkIn: (slot: { time: string; doctor: string }) => void;
  onSelectBooking: (booking: BookingRecord) => void;
}

export function DashboardCalendarTab({
  scheduleSlots,
  bookings,
  selectedDoctorFilter,
  onSelectDoctorFilter,
  onOpenWalkIn,
  onSelectBooking,
}: DashboardCalendarTabProps) {
  const showLeyla = selectedDoctorFilter === 'all' || selectedDoctorFilter === 'doc-leyla';
  const showRashad = selectedDoctorFilter === 'all' || selectedDoctorFilter === 'doc-rashad';
  const slotColSpan = showLeyla && showRashad ? 'col-span-5' : 'col-span-10';

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 space-y-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Surgery Time-Grid Schedule (Mon - Fri 09:00 - 18:00)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click on any occupied slot to open Clinical Dossier, or click &ldquo;+ Open&rdquo; to register walk-in.
          </p>
        </div>
      </div>

      {/* Real-time Operatory Chair Status & Infection Control Radar */}
      <CalendarOperatoryRadar />

      {/* Operatory Filter Buttons & Dynamic Headers */}
      <CalendarOperatoryFilterBar
        selectedDoctorFilter={selectedDoctorFilter}
        onSelectDoctorFilter={onSelectDoctorFilter}
        showLeyla={showLeyla}
        showRashad={showRashad}
        slotColSpan={slotColSpan}
      />

      {/* Time Grid Table with Smooth Hover Animation & Highlighted Active Interval */}
      <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="space-y-3 relative min-w-[580px]">
          {scheduleSlots.map((slot, idx) => {
            const leylaCustom = bookings.find(
              (b) => b.time === slot.time && b.doctor.includes('Leyla') && b.status !== 'cancelled'
            );
            const rashadCustom = bookings.find(
              (b) => b.time === slot.time && b.doctor.includes('Rashad') && b.status !== 'cancelled'
            );

            const leylaText = leylaCustom
              ? `${leylaCustom.patientName} · ${leylaCustom.service} (${leylaCustom.duration}m)`
              : slot.defaultLeyla;

            const rashadText = rashadCustom
              ? `${rashadCustom.patientName} · ${rashadCustom.service} (${rashadCustom.duration}m)`
              : slot.defaultRashad;

            const isLeylaOpen = leylaText === 'Available Slot';
            const isRashadOpen = rashadText === 'Available Slot';

            return (
              <div
                key={idx}
                className={`group relative grid grid-cols-12 gap-3 p-3.5 rounded-2xl border transition-all duration-200 text-xs hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                  slot.isCurrent
                    ? 'bg-gradient-to-r from-blue-50/95 via-sky-50/70 to-indigo-50/50 border-2 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                    : slot.isBreak
                    ? 'bg-slate-100/70 border-dashed border-slate-300 text-slate-500'
                    : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Time Slot Label with Active Coloring & Hover Micro-Motion */}
                <div className="col-span-2 font-mono font-bold flex items-center">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all duration-200 ${
                      slot.isCurrent
                        ? 'bg-brand-600 text-white shadow-xs font-black'
                        : 'text-slate-700 bg-slate-100/90 group-hover:bg-brand-50 group-hover:text-brand-700 group-hover:scale-105'
                    }`}
                  >
                    <Clock
                      className={`w-3.5 h-3.5 ${
                        slot.isCurrent ? 'text-white' : 'text-slate-500 group-hover:text-brand-600'
                      }`}
                    />
                    <span>{slot.time}</span>
                  </div>
                  {slot.isCurrent && (
                    <div className="ml-2 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-700 bg-brand-100 border border-brand-300 px-1.5 py-0.5 rounded shadow-2xs">
                        NOW
                      </span>
                    </div>
                  )}
                </div>

                {/* Doctor 1 (Leyla) Slot */}
                {showLeyla && (
                  <div
                    onClick={() => {
                      if (isLeylaOpen) {
                        onOpenWalkIn({ time: slot.time, doctor: 'Dr. Leyla Mammadova' });
                      } else if (!slot.isBreak && !leylaText.includes('Buffer')) {
                        const matched =
                          leylaCustom ||
                          bookings.find(
                            (b) =>
                              b.doctor.includes('Leyla') &&
                              (leylaText.includes(b.patientName) ||
                                b.patientName.includes('Emma') ||
                                b.patientName.includes('Richardson'))
                          );
                        if (matched) onSelectBooking(matched);
                      }
                    }}
                    className={`${slotColSpan} p-3 rounded-xl flex items-center justify-between border transition-all ${
                      slot.isBreak
                        ? 'bg-slate-50 text-slate-400 border-transparent font-medium italic'
                        : isLeylaOpen
                        ? 'bg-slate-50/80 hover:bg-brand-50/60 border-slate-200 hover:border-brand-300 text-slate-500 hover:text-brand-700'
                        : 'bg-brand-50/90 hover:bg-brand-100/90 border-brand-200/90 text-brand-900 font-semibold shadow-2xs'
                    }`}
                  >
                    <span className="truncate">{leylaText}</span>
                    {isLeylaOpen && (
                      <span className="shrink-0 flex items-center gap-1 font-bold text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded-md border border-brand-200 shadow-2xs">
                        <Plus className="w-3 h-3" /> Walk-In
                      </span>
                    )}
                  </div>
                )}

                {/* Doctor 2 (Rashad) Slot */}
                {showRashad && (
                  <div
                    onClick={() => {
                      if (isRashadOpen) {
                        onOpenWalkIn({ time: slot.time, doctor: 'Dr. Rashad Aliyev' });
                      } else if (!slot.isBreak && !rashadText.includes('Buffer')) {
                        const matched =
                          rashadCustom ||
                          bookings.find(
                            (b) =>
                              b.doctor.includes('Rashad') &&
                              (rashadText.includes(b.patientName) ||
                                b.patientName.includes('Oliver') ||
                                b.patientName.includes('Vance'))
                          );
                        if (matched) onSelectBooking(matched);
                      }
                    }}
                    className={`${slotColSpan} p-3 rounded-xl flex items-center justify-between border transition-all ${
                      slot.isBreak
                        ? 'bg-slate-50 text-slate-400 border-transparent font-medium italic'
                        : isRashadOpen
                        ? 'bg-slate-50/80 hover:bg-blue-50/60 border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-700'
                        : 'bg-blue-50/90 hover:bg-blue-100/90 border-blue-200/90 text-blue-900 font-semibold shadow-2xs'
                    }`}
                  >
                    <span className="truncate">{rashadText}</span>
                    {isRashadOpen && (
                      <span className="shrink-0 flex items-center gap-1 font-bold text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                        <Plus className="w-3 h-3" /> Walk-In
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
