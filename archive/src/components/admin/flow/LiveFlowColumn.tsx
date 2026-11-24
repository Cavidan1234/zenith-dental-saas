'use client';

import React from 'react';
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  Star,
} from 'lucide-react';
import { BookingRecord } from '../PatientDossierDrawer';

interface LiveFlowColumnProps {
  title: string;
  count: number;
  indicatorColor: string;
  columnBg: string;
  columnBorder: string;
  emptyText: string;
  bookings: BookingRecord[];
  stage: 'expected' | 'waiting' | 'in_surgery' | 'completed';
  onSelectBooking: (b: BookingRecord) => void;
  onMarkArrived?: (id: string, name: string) => void;
  onCallToChair?: (id: string, name: string) => void;
  onDischarge?: (b: BookingRecord) => void;
  onOpenWhatsApp?: (b: BookingRecord) => void;
  onOpenRxModal?: (patientName: string) => void;
}

export function LiveFlowColumn({
  title,
  count,
  indicatorColor,
  columnBg,
  columnBorder,
  emptyText,
  bookings,
  stage,
  onSelectBooking,
  onMarkArrived,
  onCallToChair,
  onDischarge,
  onOpenWhatsApp,
  onOpenRxModal,
}: LiveFlowColumnProps) {
  return (
    <div className={`p-4 rounded-3xl ${columnBg} ${columnBorder} space-y-3`}>
      <div className="flex items-center justify-between pb-2 border-b border-black/10">
        <div className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`} />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {title}
          </h4>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
          {count}
        </span>
      </div>

      <div className="space-y-3 min-h-[160px]">
        {bookings.map((b) => (
          <div
            key={b.id}
            className={`p-3.5 rounded-2xl bg-white shadow-2xs space-y-2.5 transition-all ${
              stage === 'waiting'
                ? 'border-2 border-amber-300 animate-scale-in'
                : stage === 'in_surgery'
                ? 'border-2 border-brand-500 shadow-md animate-scale-in'
                : 'border border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              {stage === 'expected' && (
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {b.id}
                </span>
              )}
              {stage === 'waiting' && (
                <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Arrived · Waiting ~3m
                </span>
              )}
              {stage === 'in_surgery' && (
                <span className="font-mono text-[10px] font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  Operatory Suite 1
                </span>
              )}
              {stage === 'completed' && (
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Discharged
                </span>
              )}

              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-700 font-bold">
                {stage === 'completed' ? (
                  <span>${b.depositAmount}.00</span>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{b.time}</span>
                  </>
                )}
              </div>
            </div>

            {/* Patient & Service */}
            <div>
              <h5 className="text-xs font-extrabold text-slate-900">{b.patientName}</h5>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{b.service}</p>
              {stage !== 'waiting' && (
                <span className="text-[10px] text-brand-700 font-semibold block mt-0.5">
                  {b.doctor}
                </span>
              )}
            </div>

            {/* Triage / Allergy Badges */}
            {stage === 'waiting' && (
              <>
                {b.medicalIntake ? (
                  <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Triage Signed
                    </span>
                    <span className="capitalize text-emerald-700 font-mono">
                      Anxiety: {b.medicalIntake.anxietyLevel}
                    </span>
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-amber-100/70 border border-amber-300 flex items-center gap-1 text-[10px] text-amber-900 font-bold">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Intake Pending on Portal</span>
                  </div>
                )}
              </>
            )}

            {stage === 'in_surgery' &&
              b.medicalIntake?.allergies &&
              b.medicalIntake.allergies.length > 0 &&
              !b.medicalIntake.allergies.includes('None') && (
                <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px] text-rose-800 font-black">
                  ⚠️ Allergy: {b.medicalIntake.allergies.join(', ')}
                </div>
              )}

            {/* Card Action Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSelectBooking(b)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {stage === 'in_surgery' ? 'PACS & SOAP' : 'Dossier'}
              </button>

              {stage === 'expected' && onMarkArrived && (
                <button
                  type="button"
                  onClick={() => onMarkArrived(b.id, b.patientName)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <span>Check-In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {stage === 'waiting' && onCallToChair && (
                <button
                  type="button"
                  onClick={() => onCallToChair(b.id, b.patientName)}
                  className="px-3 py-1 rounded-xl text-[11px] font-bold text-white bg-brand-600 hover:bg-brand-500 flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-brand-600/30 active:scale-95"
                >
                  <span>Seat in Chair</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {stage === 'in_surgery' && onDischarge && (
                <button
                  type="button"
                  onClick={() => onDischarge(b)}
                  className="px-3 py-1 rounded-xl text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-emerald-600/30 active:scale-95"
                >
                  <span>Discharge</span>
                  <CheckCircle2 className="w-3 h-3" />
                </button>
              )}

              {stage === 'completed' && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {onOpenWhatsApp && (
                    <button
                      type="button"
                      onClick={() => onOpenWhatsApp(b)}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors cursor-pointer"
                      title="WhatsApp Outbound Review & Recall"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onOpenRxModal && (
                    <button
                      type="button"
                      onClick={() => onOpenRxModal(b.patientName)}
                      className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      title="GDC #289410 Prescription Letterhead"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <a
                    href={`/review?ref=${b.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors"
                    title="5★ Google Reputation Funnel"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400 italic">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}
