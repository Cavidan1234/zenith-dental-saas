'use client';

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { PassPreOpChecklist } from './pass/PassPreOpChecklist';
import { PassQrCheckinCard } from './pass/PassQrCheckinCard';

export interface ManagedBookingData {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_surgery';
  depositStatus: 'paid' | 'unpaid';
  depositAmount: number;
  paymentMethod?: string;
  paymentLabel?: string;
  notes?: string;
  internalNotes?: string;
}

interface DigitalSurgeryPassCardProps {
  booking: ManagedBookingData;
  onOpenWallet: () => void;
}

export function DigitalSurgeryPassCard({
  booking,
  onOpenWallet,
}: DigitalSurgeryPassCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl">
      {/* Pass Header Band */}
      <div className="p-6 bg-gradient-to-r from-brand-900/60 via-slate-900 to-blue-900/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-brand-300 uppercase block">
              OFFICIAL SURGERY PASS
            </span>
            <h2 className="text-lg font-black text-white tracking-tight">
              {booking.service}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              booking.status === 'confirmed'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : booking.status === 'cancelled'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            ● {booking.status.toUpperCase()}
          </span>

          <span className="font-mono text-xs font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {booking.id}
          </span>
        </div>
      </div>

      {/* Pass Main Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Details (2 cols) */}
        <div className="md:col-span-2 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Patient
              </span>
              <span className="text-sm font-extrabold text-white block mt-0.5">
                {booking.patientName}
              </span>
              <span className="text-[11px] text-slate-400">{booking.phone}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Specialist Surgeon
              </span>
              <span className="text-sm font-extrabold text-brand-300 block mt-0.5">
                {booking.doctor}
              </span>
              <span className="text-[11px] text-slate-400">Suite A · 14 Harley St.</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Appointment Slot
              </span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono block mt-0.5">
                {booking.date}
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {booking.time} ({booking.duration} mins)
              </span>
            </div>
          </div>

          {/* Prepaid Deposit Guarantee */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Prepaid Deposit Guarantee Verified</span>
                <span className="text-[11px] text-emerald-200">
                  ${booking.depositAmount}.00 USD pre-authorized · Zero extra booking fees
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono text-xs">
              PAID
            </span>
          </div>

          {/* Patient Chief Complaint Notes */}
          {booking.notes && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Registered Consultation Note</span>
              </span>
              <p className="text-slate-300 italic">&ldquo;{booking.notes}&rdquo;</p>
            </div>
          )}

          {/* Harley Street Studio Directions */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
            <span>
              Zenith Dental &amp; Esthetics, 14 Harley Street, Marylebone, London W1G 9PR
            </span>
          </div>

          {/* Tailored Pre-Op Clinical Preparation Checklist */}
          <PassPreOpChecklist service={booking.service} />
        </div>

        {/* QR Code / Digital Check-in Pass (1 col) */}
        <PassQrCheckinCard onOpenWallet={onOpenWallet} />
      </div>
    </div>
  );
}
