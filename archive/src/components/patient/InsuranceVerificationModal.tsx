'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  Percent,
  Check,
  Sparkles,
  ExternalLink,
  Info,
  Clock,
  Printer,
} from 'lucide-react';

export interface InsurancePolicy {
  provider: 'bupa' | 'axa' | 'aviva' | 'cigna' | 'denplan' | 'wpa';
  providerName: string;
  policyNumber: string;
  groupNumber?: string;
  tier: 'standard' | 'comprehensive' | 'executive';
  status: 'verified' | 'pending' | 'unverified';
  coveragePct: number;
  preAuthCode?: string;
  verifiedAt?: string;
}

interface InsuranceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  bookingRef: string;
  serviceName: string;
  estimatedFee: number;
  onApplyInsurance: (policy: InsurancePolicy) => void;
  existingPolicy?: InsurancePolicy;
}

const PROVIDERS = [
  {
    id: 'bupa' as const,
    name: 'Bupa Dental Care',
    code: 'BUPA-UK',
    logo: '🛡️',
    badge: 'Direct Settlement',
    accent: 'border-blue-500 bg-blue-50/10 text-blue-400',
    coverage: { standard: 60, comprehensive: 80, executive: 100 },
  },
  {
    id: 'axa' as const,
    name: 'AXA Health Direct',
    code: 'AXA-PPP',
    logo: '🏛️',
    badge: 'Direct Settlement',
    accent: 'border-rose-500 bg-rose-50/10 text-rose-400',
    coverage: { standard: 50, comprehensive: 75, executive: 90 },
  },
  {
    id: 'aviva' as const,
    name: 'Aviva Dental Solutions',
    code: 'AVIVA-HQ',
    logo: '🌿',
    badge: 'Electronic Claim',
    accent: 'border-amber-500 bg-amber-50/10 text-amber-400',
    coverage: { standard: 50, comprehensive: 70, executive: 85 },
  },
  {
    id: 'cigna' as const,
    name: 'Cigna Global Dental',
    code: 'CGNA-NET',
    logo: '🌐',
    badge: 'Worldwide Direct',
    accent: 'border-cyan-500 bg-cyan-50/10 text-cyan-400',
    coverage: { standard: 60, comprehensive: 80, executive: 95 },
  },
  {
    id: 'denplan' as const,
    name: 'Simplyhealth / Denplan',
    code: 'DNPLN-PREM',
    logo: '💎',
    badge: 'Capitation Scheme',
    accent: 'border-purple-500 bg-purple-50/10 text-purple-400',
    coverage: { standard: 70, comprehensive: 85, executive: 100 },
  },
  {
    id: 'wpa' as const,
    name: 'WPA Healthcare Partner',
    code: 'WPA-EXCL',
    logo: '🦅',
    badge: 'Fast-Track Pre-Auth',
    accent: 'border-emerald-500 bg-emerald-50/10 text-emerald-400',
    coverage: { standard: 55, comprehensive: 75, executive: 90 },
  },
];

export function InsuranceVerificationModal({
  isOpen,
  onClose,
  patientName,
  bookingRef,
  serviceName,
  estimatedFee,
  onApplyInsurance,
  existingPolicy,
}: InsuranceVerificationModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<'bupa' | 'axa' | 'aviva' | 'cigna' | 'denplan' | 'wpa'>(
    existingPolicy?.provider || 'bupa'
  );
  const [policyNumber, setPolicyNumber] = useState(existingPolicy?.policyNumber || 'BUP-829104-E');
  const [groupNumber, setGroupNumber] = useState(existingPolicy?.groupNumber || 'LON-CORP-440');
  const [tier, setTier] = useState<'standard' | 'comprehensive' | 'executive'>(
    existingPolicy?.tier || 'comprehensive'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(Boolean(existingPolicy?.status === 'verified'));
  const [authCode, setAuthCode] = useState(existingPolicy?.preAuthCode || '');

  if (!isOpen) return null;

  const currentProvider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];
  const coveragePercentage = currentProvider.coverage[tier];
  const insurerCoverageAmount = Math.round((estimatedFee * coveragePercentage) / 100);
  const patientCoPay = Math.max(0, estimatedFee - insurerCoverageAmount);

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const generatedAuth = `AUTH-${currentProvider.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setAuthCode(generatedAuth);
      setIsVerified(true);
      setIsVerifying(false);

      const policy: InsurancePolicy = {
        provider: selectedProvider,
        providerName: currentProvider.name,
        policyNumber,
        groupNumber,
        tier,
        status: 'verified',
        coveragePct: coveragePercentage,
        preAuthCode: generatedAuth,
        verifiedAt: new Date().toISOString(),
      };

      onApplyInsurance(policy);

      // Play chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch (_) {}
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold block">
                Harley Street Clinical Concierge
              </span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Private Dental Insurance &amp; Co-Pay Verification
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs">
          {/* Patient & Procedure Context */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient &amp; Surgery</span>
              <span className="text-sm font-extrabold text-white">{patientName}</span>
              <span className="text-slate-400 block text-[11px]">{serviceName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Standard Clinic Fee</span>
              <span className="text-base font-black font-mono text-emerald-400">${estimatedFee}.00</span>
              <span className="text-[10px] text-slate-400 block font-mono">Ref: {bookingRef}</span>
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Select Private Health Insurer
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PROVIDERS.map((prov) => {
                const isSelected = selectedProvider === prov.id;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => {
                      setSelectedProvider(prov.id);
                      setIsVerified(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? `${prov.accent} bg-white/[0.06] border-brand-500 shadow-md ring-1 ring-brand-500`
                        : 'border-slate-800 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{prov.logo}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-bold">
                        {prov.code}
                      </span>
                    </div>
                    <span className="font-bold text-white block text-xs truncate">{prov.name}</span>
                    <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                      {prov.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Policy & Membership Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Membership / Policy ID
              </label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value.toUpperCase())}
                placeholder="e.g. BUP-884920-X"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Corporate Group ID (Optional)
              </label>
              <input
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value.toUpperCase())}
                placeholder="e.g. LON-CORP-440"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Tier Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Policy Benefit Tier
              </label>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {coveragePercentage}% Coverage Applied
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard' as const, label: 'Standard (60%)', desc: 'Routine preventative' },
                { id: 'comprehensive' as const, label: 'Comprehensive (80%)', desc: 'Restorative & hygiene' },
                { id: 'executive' as const, label: 'Executive Diamond (100%)', desc: 'Full surgical & cosmetic' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    tier === t.id
                      ? 'border-brand-500 bg-brand-500/20 text-white font-bold ring-1 ring-brand-500'
                      : 'border-slate-800 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="block text-xs font-bold text-white">{t.label}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

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

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!isVerified ? (
              <button
                type="button"
                onClick={handleSimulateVerification}
                disabled={isVerifying}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/30 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying with {currentProvider.name}...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Policy &amp; Issue Pre-Auth Pass</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/30 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Pre-Authorization Applied to Pass</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
