'use client';

import React from 'react';
import { Printer, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { downloadIcsFile } from '@/lib/calendarExport';
import type { BookingRecord } from '../PatientDossierDrawer';

interface DossierFooterActionsProps {
  booking: BookingRecord;
  onClose: () => void;
  onOpenRxModal: (booking: BookingRecord) => void;
}

export function DossierFooterActions({
  booking,
  onClose,
  onOpenRxModal,
}: DossierFooterActionsProps) {
  const handleExportIcs = () => {
    downloadIcsFile({
      refId: booking.id,
      serviceName: booking.service,
      doctorName: booking.doctor,
      patientName: booking.patientName,
      date: booking.date,
      time: booking.time,
      durationMinutes: booking.duration || 45,
      location: 'Zenith Dental Studio, 14 Harley Street, Marylebone, London W1G 9PR',
      notes: booking.notes || 'Routine Clinical Consultation',
    });
  };

  return (
    <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2.5">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5 text-slate-500" />
        <span>Print Dossier</span>
      </button>

      <button
        type="button"
        onClick={handleExportIcs}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
        title="Download Calendar .ics Invitation"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-brand-600" />
        <span>Export .ics</span>
      </button>

      <button
        type="button"
        onClick={() => onOpenRxModal(booking)}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
        title="Generate Official Clinical Discharge Protocol & Rx Prescription"
      >
        <FileText className="w-3.5 h-3.5 text-brand-600" />
        <span>Clinical Rx &amp; Discharge</span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md shadow-brand-600/20 active:scale-95 text-center cursor-pointer"
      >
        Close Dossier
      </button>
    </div>
  );
}
