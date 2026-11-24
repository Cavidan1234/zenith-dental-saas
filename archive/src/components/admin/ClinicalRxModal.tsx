'use client';

import React from 'react';
import {
  FileText,
  X,
  Activity,
  Printer,
  Send,
} from 'lucide-react';
import { BookingRecord } from './PatientDossierDrawer';

interface ClinicalRxModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onDispatched: (recipient: string) => void;
}

export function ClinicalRxModal({
  booking,
  onClose,
  onDispatched,
}: ClinicalRxModalProps) {
  if (!booking) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Medical Letterhead Style) */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-950 to-brand-950 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300 shadow-xs">
              <FileText className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Clinical Discharge &amp; Prescription (Rx)</span>
                <span className="text-[10px] font-mono font-bold bg-brand-500/30 text-brand-200 px-2 py-0.5 rounded border border-brand-400/30">
                  GDC #289410
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Official post-operative regime for <strong className="text-white">{booking.patientName}</strong> · Ref: {booking.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Letterhead Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          {/* Practice & Patient Header Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">{booking.patientName}</span>
              <span className="text-[11px] text-slate-500">{booking.phone}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialist</span>
              <span className="font-extrabold text-brand-700 block mt-0.5">{booking.doctor}</span>
              <span className="text-[11px] text-slate-500">Suite A · Harley St.</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Surgery Date</span>
              <span className="font-extrabold text-slate-900 font-mono block mt-0.5">{booking.date}</span>
              <span className="text-[11px] text-slate-500 font-mono">{booking.time} (Completed)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Procedure</span>
              <span className="font-extrabold text-slate-900 block mt-0.5 truncate" title={booking.service}>
                {booking.service}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold">100% Sterilized</span>
            </div>
          </div>

          {/* Treated Teeth Site Summary */}
          <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-brand-900 text-xs">
              <Activity className="w-4 h-4 text-brand-600" />
              <span>Clinical Odontogram Site Reference</span>
            </div>
            <p className="text-brand-950 text-[11px] leading-relaxed">
              Treatment executed according to 12-point surgical protocol. Targeted anatomical areas: Maxillary Arch (Tooth #8 Restorative Aesthetic Margin &amp; Tooth #14 Enamel Sensitivity Safeguard).
            </p>
          </div>

          {/* Section 1: Prescribed Pharmacotherapy (Rx) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Prescribed Pharmacotherapy (Rx)
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="space-y-2">
              {[
                {
                  med: 'Curasept 0.20% Chlorhexidine ADS Oral Rinse (200ml)',
                  dose: 'Rinse with 10ml undiluted for 60 seconds twice daily (morning & night) after gentle brushing.',
                  duration: '7 Days Post-Op',
                },
                {
                  med: 'Ibuprofen 400mg Film-Coated Tablets (Box of 16)',
                  dose: 'Take 1 tablet every 6–8 hours with food only as needed for mild dental discomfort.',
                  duration: 'PRN (As Needed)',
                },
                {
                  med: 'GC Tooth Mousse Bio-Active Calcium Phosphate (CPP-ACP)',
                  dose: 'Apply pea-sized amount with clean finger across treated enamel surfaces before sleep; do not rinse.',
                  duration: '14 Days Nightly',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs block">{item.med}</span>
                    <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">{item.dose}</span>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Clinical Post-Op Care Guidelines */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Mandatory 48-Hour Recovery Guidelines
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">☕ 48-Hour White Diet</span>
                <p className="text-slate-500 leading-relaxed">
                  Avoid dark staining agents including coffee, black tea, red wine, turmeric, and berries to allow enamel pores to remineralize.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">🪥 Gentle Mechanical Brushing</span>
                <p className="text-slate-500 leading-relaxed">
                  Use ultra-soft manual toothbrush. Defer high-frequency sonic vibrating electric toothbrushes on treated anterior margins for 72 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Sign-off & Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-slate-900 block">{booking.doctor}</span>
              <span className="text-[11px] text-slate-500">Lead Clinician · Zenith Dental &amp; Esthetics</span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">14 Harley Street, London W1G 9PR</span>
            </div>

            <div className="text-right">
              <div className="inline-block border-2 border-brand-600/40 rounded-xl px-3 py-1.5 text-center bg-brand-50/50">
                <span className="text-[9px] font-mono font-bold tracking-widest text-brand-700 uppercase block">
                  OFFICIAL MEDICAL STAMP
                </span>
                <span className="text-xs font-black text-brand-900 tracking-tight">
                  ZENITH CLINICAL HARLEY ST.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Official Rx</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onDispatched(booking.email);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send PDF to Patient</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
