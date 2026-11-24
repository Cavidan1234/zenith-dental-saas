'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { InsuranceProviderConfig } from './insuranceProviders';

interface InsuranceSettlementCardProps {
  currentProvider: InsuranceProviderConfig;
  coveragePercentage: number;
  estimatedFee: number;
  insurerCoverageAmount: number;
  patientCoPay: number;
  isVerified: boolean;
  authCode: string;
}

export function InsuranceSettlementCard({
  currentProvider,
  coveragePercentage,
  estimatedFee,
  insurerCoverageAmount,
  patientCoPay,
  isVerified,
  authCode,
}: InsuranceSettlementCardProps) {
  return (
    <div className="space-y-4">
      {/* Real-Time Co-Pay Calculator Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/80 space-y-3 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
          <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">
            Real-Time Settlement Breakdown
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 font-bold">
            Direct Electronic Billing Active
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Standard Harley St. Surgery Fee:</span>
            <span className="font-mono font-bold text-white">${estimatedFee}.00</span>
          </div>

          <div className="flex items-center justify-between text-emerald-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentProvider.name} Direct Claim ({coveragePercentage}%):
            </span>
            <span className="font-mono font-bold">-${insurerCoverageAmount}.00</span>
          </div>

          <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-white text-sm block">Patient Out-Of-Pocket Co-Pay:</span>
              <span className="text-[10px] text-slate-400">Zero surcharge at reception desk</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-emerald-400">
                ${patientCoPay}.00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Badge & Pre-Auth Code */}
      {isVerified && authCode && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs">Direct Claim Pre-Authorisation Issued</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              INSTANT APPROVAL
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-emerald-500/20">
            <div>
              <span className="text-[9px] font-mono text-slate-400 block uppercase">
                Authorization Reference
              </span>
              <span className="font-mono font-extrabold text-white text-sm tracking-wider">
                {authCode}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              ✓ Transmitted to Clinic EMR
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
