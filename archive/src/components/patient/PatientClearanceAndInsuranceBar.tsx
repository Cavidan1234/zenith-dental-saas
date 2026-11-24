'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Calendar,
  Download,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { ManagedBooking } from '@/data/seedBookings';

interface PatientClearanceAndInsuranceBarProps {
  booking: ManagedBooking;
  onOpenIntake: () => void;
  onOpenInsurance: () => void;
  onOpenGoogleCalendar: () => void;
  onDownloadIcs: () => void;
  onOpenReschedule: () => void;
  onOpenCancel: () => void;
}

export function PatientClearanceAndInsuranceBar({
  booking,
  onOpenIntake,
  onOpenInsurance,
  onOpenGoogleCalendar,
  onDownloadIcs,
  onOpenReschedule,
  onOpenCancel,
}: PatientClearanceAndInsuranceBarProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl divide-y divide-white/10">
      {/* Pre-Op Medical Triage & Clinical Clearance Section */}
      <div className="p-4 sm:p-5 bg-white/[0.03]">
        {booking.medicalIntake ? (
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Pre-Op Clinical Clearance Verified</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Fast-Track Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Anxiety: <span className="text-slate-200 capitalize font-medium">{booking.medicalIntake.anxietyLevel}</span>
                  {booking.medicalIntake.allergies &&
                    booking.medicalIntake.allergies.length > 0 &&
                    !booking.medicalIntake.allergies.includes('None') && (
                      <> · Allergies: <span className="text-rose-300 font-medium">{booking.medicalIntake.allergies.join(', ')}</span></>
                    )}
                  {booking.medicalIntake.sedationRequested && (
                    <> · <span className="text-cyan-300 font-medium">Nitrous Sedation Requested</span></>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenIntake}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all cursor-pointer active:scale-95"
            >
              Update Triage
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Fast-Track Surgery Check-In Required</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Pending Clearance
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Complete your 2-minute pre-op questionnaire (allergies, medical conditions, anxiety level).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenIntake}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-sm shadow-amber-600/30 transition-all cursor-pointer active:scale-95"
            >
              Complete Medical Triage
            </button>
          </div>
        )}
      </div>

      {/* Private Dental Insurance & Co-Pay Verification Section */}
      <div className="p-4 sm:p-5 bg-white/[0.02]">
        {booking.insurancePolicy ? (
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    Private Insurance Pre-Authorised: {booking.insurancePolicy.providerName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    {booking.insurancePolicy.coveragePct}% Coverage
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Policy: <span className="text-slate-200 font-semibold">{booking.insurancePolicy.policyNumber}</span> · Auth Ref: <span className="text-emerald-400 font-bold">{booking.insurancePolicy.preAuthCode}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenInsurance}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 transition-all cursor-pointer active:scale-95"
            >
              Update Policy
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/25 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Private Dental Insurance Verification</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                    Direct Billing
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bupa, AXA Health, Aviva, Cigna or Denplan? Verify now for cashless reception check-in.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenInsurance}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
            >
              Verify Insurance Policy
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="p-4 sm:p-5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenGoogleCalendar}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>Google Calendar</span>
          </button>

          <button
            type="button"
            onClick={onDownloadIcs}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download .ics</span>
          </button>
        </div>

        {booking.status !== 'cancelled' && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onOpenReschedule}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-sm shadow-brand-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reschedule Slot</span>
            </button>

            <button
              type="button"
              onClick={onOpenCancel}
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
