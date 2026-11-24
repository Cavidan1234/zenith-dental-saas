'use client';

import React from 'react';
import { CheckCircle2, Calendar, ExternalLink, Download, QrCode } from 'lucide-react';
import { ServiceItem, DoctorItem } from './Step1ServiceDoctor';

interface Step5ConfirmationProps {
  bookingRef: string;
  fullName: string;
  email: string;
  selectedDoctor: DoctorItem | null;
  selectedService: ServiceItem | null;
  selectedDate: string;
  selectedSlot: string | null;
  notes: string;
  paymentMethod: 'google_pay' | 'apple_pay' | 'card';
  onOpenGoogleCalendar: () => void;
  onDownloadICS: () => void;
  onClose: () => void;
}

export function Step5Confirmation({
  bookingRef,
  fullName,
  email,
  selectedDoctor,
  selectedService,
  selectedDate,
  selectedSlot,
  notes,
  paymentMethod,
  onOpenGoogleCalendar,
  onDownloadICS,
  onClose,
}: Step5ConfirmationProps) {
  return (
    <div className="text-center py-5 space-y-5 step-view-enter">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center p-3 shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          Reservation Confirmed · ID: {bookingRef}
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Appointment Booked Successfully!
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
          Confirmation and calendar invitation dispatched to{' '}
          <strong className="text-slate-900">{email}</strong>. Our sterilization suite will be sanitized
          15 minutes prior to your arrival.
        </p>
      </div>

      {/* Verified Receipt Card */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-left text-xs sm:text-sm space-y-2.5 max-w-md mx-auto shadow-2xs">
        <div className="flex justify-between py-1 border-b border-slate-200">
          <span className="font-semibold text-slate-500">Patient</span>
          <span className="font-extrabold text-slate-900">{fullName}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200">
          <span className="font-semibold text-slate-500">Specialist</span>
          <span className="font-extrabold text-brand-700">
            {selectedDoctor?.name || 'Selected Specialist'}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200">
          <span className="font-semibold text-slate-500">Service</span>
          <span className="font-extrabold text-slate-900">
            {selectedService?.name || 'Selected Procedure'}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200">
          <span className="font-semibold text-slate-500">Scheduled Date & Time</span>
          <span className="font-extrabold text-slate-900">
            {selectedDate} @ {selectedSlot}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200">
          <span className="font-semibold text-slate-500">Deposit Paid</span>
          <span className="font-extrabold text-emerald-600">
            ${selectedService ? selectedService.depositCents / 100 : 50} USD (Verified)
          </span>
        </div>
        {notes && notes.trim() && (
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500">Patient Note</span>
            <span className="font-medium text-slate-800 text-right max-w-[220px] truncate" title={notes}>
              &ldquo;{notes}&rdquo;
            </span>
          </div>
        )}
        <div className="flex justify-between py-1">
          <span className="font-semibold text-slate-500">Payment Channel</span>
          <span className="font-bold text-slate-800 capitalize">
            {paymentMethod === 'google_pay'
              ? 'Google Pay (TEST)'
              : paymentMethod === 'apple_pay'
              ? 'Apple Pay'
              : 'Credit Card (•••• 4242)'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
        <button
          type="button"
          onClick={onOpenGoogleCalendar}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Calendar className="w-4 h-4 text-brand-600" />
          <span>Add to Google Calendar</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onDownloadICS}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Download iCal (.ics)</span>
        </button>

        <a
          href={`/manage?ref=${bookingRef}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <QrCode className="w-4 h-4 text-brand-600" />
          <span>Surgery Pass & Manage</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/30 transition-all cursor-pointer active:scale-95"
        >
          Close & Done
        </button>
      </div>
    </div>
  );
}
