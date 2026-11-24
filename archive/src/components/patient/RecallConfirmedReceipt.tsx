'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  MapPin,
  Download,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { RecallPatientData, VipSlot } from '@/data/seedBookings';
import { openGoogleCalendar, downloadIcsFile } from '@/lib/calendarExport';

interface RecallConfirmedReceiptProps {
  patientData: RecallPatientData;
  confirmedBooking: {
    id: string;
    slot: VipSlot;
  };
}

export function RecallConfirmedReceipt({
  patientData,
  confirmedBooking,
}: RecallConfirmedReceiptProps) {
  const handleOpenGoogleCalendar = () => {
    openGoogleCalendar({
      refId: confirmedBooking.id,
      serviceName: `${patientData.recommendedService} (6-Mo Recall)`,
      doctorName: patientData.doctor,
      patientName: patientData.patientName,
      date: confirmedBooking.slot.date,
      time: confirmedBooking.slot.time,
      durationMinutes: patientData.recommendedDuration || 45,
      location: 'Zenith Dental & Esthetics, 14 Harley Street, Marylebone, London W1G 9PR',
      notes: `VIP 6-Month Oral Health Recall. Prior treatment: ${patientData.treatment}.`,
    });
  };

  const handleDownloadICS = () => {
    downloadIcsFile({
      refId: confirmedBooking.id,
      serviceName: `${patientData.recommendedService} (6-Mo Recall)`,
      doctorName: patientData.doctor,
      patientName: patientData.patientName,
      date: confirmedBooking.slot.date,
      time: confirmedBooking.slot.time,
      durationMinutes: patientData.recommendedDuration || 45,
      location: 'Zenith Dental & Esthetics, 14 Harley Street, Marylebone, London W1G 9PR',
      notes: `VIP 6-Month Oral Health Recall. Prior treatment: ${patientData.treatment}.`,
    });
  };

  return (
    <div className="max-w-lg mx-auto w-full p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>

      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block mb-1">
          Recall Confirmed · Ref: {confirmedBooking.id}
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Your Recall Slot is Secured
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Thank you, {patientData.patientName}. {patientData.doctor} and the clinical team look forward to seeing you.
        </p>
      </div>

      {/* Appointment Summary Card */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-slate-400">Specialist:</span>
          <span className="font-bold text-white">{patientData.doctor}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-slate-400">Date &amp; Time:</span>
          <span className="font-bold text-brand-300 font-mono">
            {confirmedBooking.slot.dayLabel} @ {confirmedBooking.slot.time}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="text-slate-400">Treatment:</span>
          <span className="font-bold text-white">{patientData.recommendedService}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Location:</span>
          <span className="font-bold text-white flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>14 Harley Street, London</span>
          </span>
        </div>
      </div>

      {/* Calendar Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleOpenGoogleCalendar}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-brand-400" />
          <span>Google Calendar</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadICS}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Download iCal (.ics)</span>
        </button>
      </div>

      {/* Back to clinic links */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <Link
          href="/b/zenith-dental"
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Clinic Homepage</span>
        </Link>

        <Link
          href="/dashboard"
          className="text-brand-400 hover:text-brand-300 font-semibold transition-colors flex items-center gap-1"
        >
          <span>View on Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
