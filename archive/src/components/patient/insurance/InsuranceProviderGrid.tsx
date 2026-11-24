'use client';

import React from 'react';
import { PROVIDERS, InsuranceProviderConfig } from './insuranceProviders';

interface InsuranceProviderGridProps {
  selectedProvider: InsuranceProviderConfig['id'];
  onSelectProvider: (id: InsuranceProviderConfig['id']) => void;
  policyNumber: string;
  onChangePolicyNumber: (val: string) => void;
  groupNumber: string;
  onChangeGroupNumber: (val: string) => void;
  tier: 'standard' | 'comprehensive' | 'executive';
  onSelectTier: (t: 'standard' | 'comprehensive' | 'executive') => void;
  coveragePercentage: number;
}

export function InsuranceProviderGrid({
  selectedProvider,
  onSelectProvider,
  policyNumber,
  onChangePolicyNumber,
  groupNumber,
  onChangeGroupNumber,
  tier,
  onSelectTier,
  coveragePercentage,
}: InsuranceProviderGridProps) {
  return (
    <div className="space-y-4">
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
                onClick={() => onSelectProvider(prov.id)}
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
            onChange={(e) => onChangePolicyNumber(e.target.value.toUpperCase())}
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
            onChange={(e) => onChangeGroupNumber(e.target.value.toUpperCase())}
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
              onClick={() => onSelectTier(t.id)}
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
    </div>
  );
}
