'use client';

import React, { useState } from 'react';
import { Calculator, FileText, Check, Plus, Trash2 } from 'lucide-react';

export interface TreatmentPlanItem {
  id: string;
  tooth?: number;
  procedure: string;
  cost: number;
}

interface DossierTreatmentBuilderSectionProps {
  treatmentItems: TreatmentPlanItem[];
  onAddTreatmentItem: (tooth: number, procedure: string, cost: number) => void;
  onRemoveTreatmentItem: (id: string) => void;
  insuranceDiscount: number;
  onSetInsuranceDiscount: (pct: number) => void;
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  monthlyEstimate: number;
  planCopied: boolean;
  onCopyPlan: () => void;
  onOpenPlanModal: () => void;
}

export function DossierTreatmentBuilderSection({
  treatmentItems,
  onAddTreatmentItem,
  onRemoveTreatmentItem,
  insuranceDiscount,
  onSetInsuranceDiscount,
  subtotal,
  discountAmount,
  finalTotal,
  monthlyEstimate,
  planCopied,
  onCopyPlan,
  onOpenPlanModal,
}: DossierTreatmentBuilderSectionProps) {
  const [newTooth, setNewTooth] = useState<number>(11);
  const [newProcedure, setNewProcedure] = useState('Porcelain Crown & CAD/CAM Mill');
  const [newCost, setNewCost] = useState(750);

  const handleAdd = () => {
    if (!newProcedure.trim() || newCost <= 0) return;
    onAddTreatmentItem(newTooth, newProcedure, newCost);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Treatment Plan &amp; Cost Estimator
            </h4>
            <p className="text-[10px] text-slate-400">
              Multi-phase procedure builder with 0% APR installment breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenPlanModal}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <FileText className="w-3 h-3 text-brand-600" />
            <span>Official Agreement</span>
          </button>

          <button
            type="button"
            onClick={onCopyPlan}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          >
            {planCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <FileText className="w-3 h-3" />}
            <span>{planCopied ? 'Plan Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Treatment Items List */}
      <div className="space-y-2">
        {treatmentItems.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200 text-[10px]">
                #{item.tooth}
              </span>
              <span className="font-semibold text-slate-800">{item.procedure}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-slate-900">${item.cost}</span>
              <button
                type="button"
                onClick={() => onRemoveTreatmentItem(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                title="Remove Item"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Procedure Row */}
      <div className="p-3 rounded-xl bg-slate-50/70 border border-dashed border-slate-300 space-y-2">
        <span className="text-[10px] font-bold uppercase text-slate-500 block">Add Planned Procedure</span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={newTooth}
            onChange={(e) => setNewTooth(Number(e.target.value))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-slate-700"
          >
            {Array.from({ length: 32 }, (_, i) => i + 1).map((t) => (
              <option key={t} value={t}>
                Tooth #{t}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={newProcedure}
            onChange={(e) => setNewProcedure(e.target.value)}
            placeholder="Procedure description..."
            className="flex-1 min-w-[140px] p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
          >
          </input>

          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-500">$</span>
            <input
              type="number"
              value={newCost}
              onChange={(e) => setNewCost(Number(e.target.value))}
              className="w-16 p-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-slate-800"
            />
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Insurance & Preferred Tier Selector */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-600 font-medium">Coverage / Tier:</span>
        <div className="flex items-center gap-1">
          {[
            { label: 'Private (0%)', pct: 0 },
            { label: 'Bupa / AXA (10%)', pct: 10 },
            { label: 'VIP Club (15%)', pct: 15 },
          ].map((tier) => (
            <button
              key={tier.pct}
              type="button"
              onClick={() => onSetInsuranceDiscount(tier.pct)}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                insuranceDiscount === tier.pct
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Total Summary Box */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Estimate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white">${finalTotal.toLocaleString()}</span>
            {insuranceDiscount > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold">
                (-${discountAmount})
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">0% APR (12 Mos)</span>
          <span className="text-sm font-black text-amber-300 font-mono">~${monthlyEstimate}/mo</span>
        </div>
      </div>
    </div>
  );
}
