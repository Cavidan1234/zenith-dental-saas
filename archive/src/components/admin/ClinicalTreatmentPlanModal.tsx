'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Check,
  ShieldCheck,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  Send,
  Lock,
} from 'lucide-react';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import { playSuccessPing, playHapticTick } from '@/lib/soundscapes';

export interface TreatmentItem {
  id: string;
  tooth?: number;
  procedure: string;
  cost: number;
}

interface ClinicalTreatmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctor: string;
  treatmentItems: TreatmentItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  finalTotal: number;
  monthlyEstimate: number;
  depositAmount: number;
}

export function ClinicalTreatmentPlanModal({
  isOpen,
  onClose,
  bookingRef,
  patientName,
  patientPhone,
  patientEmail,
  doctor,
  treatmentItems,
  subtotal,
  discountPct,
  discountAmount,
  finalTotal,
  monthlyEstimate,
  depositAmount,
}: ClinicalTreatmentPlanModalProps) {
  const [isSigned, setIsSigned] = useState(true);
  const [sentNotice, setSentNotice] = useState(false);
  const agreementDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    playHapticTick();
    window.print();
  };

  const handleSendToPortal = () => {
    playSuccessPing();
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  const netBalanceDue = Math.max(0, finalTotal - depositAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-in print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Modal Controls Bar (Hidden during Print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Official Clinical Treatment Agreement &amp; Financial Estimate
              </h3>
              <p className="text-[11px] text-slate-400">
                GDC &amp; CQC Standard Document · Reference ZD-EST-{bookingRef}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendToPortal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {sentNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
              <span>{sentNotice ? 'Dispatched to Portal!' : 'Send to Patient'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL LETTERHEAD DOCUMENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-900 font-sans print:overflow-visible print:p-8">
          {/* Practice Header Letterhead */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ZenithLogo className="w-8 h-8 text-brand-600" />
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Zenith Dental &amp; Esthetics
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Centre for Advanced Cosmetic Dentistry &amp; Oral Rehabilitation
              </p>
              <p className="text-[11px] text-slate-400">
                14 Harley Street, Marylebone, London W1G 9PR · +44 20 7946 0991
              </p>
            </div>

            <div className="text-right space-y-0.5 text-xs">
              <span className="font-mono font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded text-[10px] inline-block">
                ESTIMATE #{bookingRef}
              </span>
              <p className="font-mono text-slate-500 text-[11px] pt-1">Date: {agreementDate}</p>
              <p className="text-[10px] text-slate-400">CQC Registration: 1-1092837482</p>
              <p className="text-[10px] text-slate-400">GDC Practice License #289410</p>
            </div>
          </div>

          {/* Patient Details & Lead Clinician Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                Patient Information
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{patientName}</h4>
              <p className="text-slate-600 text-[11px]">{patientEmail}</p>
              <p className="text-slate-600 text-[11px] font-mono">{patientPhone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                Lead Specialist Clinician
              </span>
              <h4 className="text-sm font-extrabold text-brand-800 mt-0.5">{doctor}</h4>
              <p className="text-slate-600 text-[11px]">BDS MSc (Lond) · Clinical Aesthetics</p>
              <p className="text-slate-500 text-[10px] font-mono">General Dental Council #289410</p>
            </div>
          </div>

          {/* Itemized Clinical Treatment Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Itemized Clinical Procedures &amp; Fee Schedule</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">CDT Billing Codes</span>
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-16">Tooth #</th>
                    <th className="py-2.5 px-3">Clinical Procedure Description</th>
                    <th className="py-2.5 px-3 w-28 text-right">Fee (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {treatmentItems.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-2.5 px-3 font-mono font-bold text-brand-700">
                        {item.tooth ? `#${item.tooth}` : 'General'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 font-semibold">{item.procedure}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">
                        ${item.cost.toLocaleString()}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary & 0% APR Financing Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
              <span className="text-slate-400">Total Treatment Gross:</span>
              <span className="font-mono font-bold">${subtotal.toLocaleString()}.00</span>
            </div>

            {discountPct > 0 && (
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10 text-emerald-400">
                <span>Preferred Patient Courtesy ({discountPct}%):</span>
                <span className="font-mono font-bold">-${discountAmount.toLocaleString()}.00</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10 text-emerald-400">
              <span>Prepaid Booking Deposit (Verified):</span>
              <span className="font-mono font-bold">-${depositAmount}.00</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Net Balance Due at Final Seat
                </span>
                <span className="text-xl font-black text-white font-mono">
                  ${netBalanceDue.toLocaleString()}.00
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  0% APR Monthly Plan (12 Mos)
                </span>
                <span className="text-base font-extrabold text-amber-300 font-mono">
                  ~${monthlyEstimate}/month
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Longevity Warranty & Guarantee Card */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-black uppercase text-[11px] tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Zenith Clinical Longevity Guarantee</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              All e.max porcelain veneers and labial restorations are backed by our 5-Year Structural Longevity Warranty. Titanium implant fixtures (Straumann/Nobel) carry an unconditional manufacturer lifetime osteointegration guarantee, provided bi-annual 6-month hygiene recall appointments are maintained.
            </p>
          </div>

          {/* Informed Consent & Dual Signatures Block */}
          <div className="pt-4 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Patient Informed Consent
              </span>
              <p className="text-[11px] text-slate-500 leading-snug">
                I confirm that the clinical findings, procedure alternatives, and associated financial investments have been fully explained to my satisfaction.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-serif italic text-base font-bold text-brand-900">
                  {patientName}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Electronically Signed &amp; Accepted</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Clinician Verification &amp; Stamp
              </span>
              <p className="text-[11px] text-slate-500 leading-snug">
                Certified by Lead Clinician in accordance with British Dental Association (BDA) and GDC Good Medical Practice guidelines.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-serif italic text-base font-bold text-slate-900">
                  {doctor}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  GDC Registration #289410 · 14 Harley St.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
