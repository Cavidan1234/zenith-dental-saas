'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface TreatmentPlanFinancialSummaryProps {
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  depositAmount: number;
  netBalanceDue: number;
  monthlyEstimate: number;
}

export function TreatmentPlanFinancialSummary({
  subtotal,
  discountPct,
  discountAmount,
  depositAmount,
  netBalanceDue,
  monthlyEstimate,
}: TreatmentPlanFinancialSummaryProps) {
  return (
    <>
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
    </>
  );
}
