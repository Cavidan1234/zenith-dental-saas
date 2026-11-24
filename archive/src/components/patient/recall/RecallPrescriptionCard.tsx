'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface PatientRecallData {
  patientName: string;
  doctor: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  recommendedService: string;
  recommendedDuration: number;
}

interface RecallPrescriptionCardProps {
  patientData: PatientRecallData;
}

export function RecallPrescriptionCard({ patientData }: RecallPrescriptionCardProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <img
            src={patientData.doctorAvatar}
            alt={patientData.doctor}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/40"
          />
          <div>
            <h3 className="text-base font-bold text-white">{patientData.doctor}</h3>
            <p className="text-xs text-brand-300 font-medium">{patientData.doctorSpecialty}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Zenith Dental Suite A · Harley Street</p>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Recommended Care
          </span>
          <span className="text-sm font-extrabold text-emerald-400">
            {patientData.recommendedService}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">
            {patientData.recommendedDuration} minutes · Preventive Protocol
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-300 flex items-start gap-3">
        <Zap className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Pre-Authorized Returning Patient Benefit</span>
          <span>
            Your previous clinical records and MINA enamel sensitivity notes are already synced.
            The standard $50 reservation deposit has been credited via your practice loyalty privileges.
          </span>
        </div>
      </div>
    </div>
  );
}
