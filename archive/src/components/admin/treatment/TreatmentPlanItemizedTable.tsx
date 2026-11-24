'use client';

import React from 'react';
import type { TreatmentItem } from '../ClinicalTreatmentPlanModal';

interface TreatmentPlanItemizedTableProps {
  treatmentItems: TreatmentItem[];
}

export function TreatmentPlanItemizedTable({
  treatmentItems,
}: TreatmentPlanItemizedTableProps) {
  return (
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
  );
}
