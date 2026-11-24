'use client';

import React from 'react';
import { MessageCircle, Eye, RefreshCw, Check, Zap } from 'lucide-react';
import { BookingRecord } from './PatientDossierDrawer';

export interface RecallRecord {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  lastVisitDate: string;
  recallDueDate: string;
  treatment: string;
  doctor: string;
  status: string;
  contacted: boolean;
}

interface DashboardRecallTabProps {
  filteredRecalls: RecallRecord[];
  dispatchedRecalls: Record<string, boolean>;
  onTriggerRecallNotice: (patientName: string, id: string) => void;
  onPreviewRecall: (rec: RecallRecord) => void;
  onOpenWhatsAppModal: (booking: BookingRecord) => void;
}

export function DashboardRecallTab({
  filteredRecalls,
  dispatchedRecalls,
  onTriggerRecallNotice,
  onPreviewRecall,
  onOpenWhatsAppModal,
}: DashboardRecallTabProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Automated 6-Month Oral Health Recall</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Proactive reminders dispatched exactly 180 days post-treatment.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
          Retention Engine Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 border-b border-slate-200 uppercase tracking-wider text-slate-600 font-bold">
            <tr>
              <th className="py-3.5 px-6">Patient</th>
              <th className="py-3.5 px-6">Prior Treatment</th>
              <th className="py-3.5 px-6">Last Visit</th>
              <th className="py-3.5 px-6">6-Month Due Date</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Dispatch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecalls.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No recall patients scheduled for the selected specialist.
                </td>
              </tr>
            ) : (
              filteredRecalls.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{rec.patientName}</div>
                    <div className="text-[11px] text-slate-500">{rec.email} · {rec.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {rec.treatment}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600">
                    {rec.lastVisitDate}
                  </td>
                  <td className="py-4 px-6 font-bold text-amber-700">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                      {rec.recallDueDate}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rec.contacted
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWhatsAppModal({
                            id: `ZD-REC-${rec.id}`,
                            patientName: rec.patientName,
                            phone: rec.phone,
                            service: `${rec.treatment} (6-Month Preventive Recall)`,
                            doctor: rec.doctor,
                            date: rec.recallDueDate,
                            time: '10:00',
                            depositAmount: 50,
                            status: 'confirmed',
                            depositStatus: 'paid',
                            duration: 45,
                            email: rec.email,
                          })
                        }
                        title="Send WhatsApp Recall Message"
                        className="px-2.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onPreviewRecall(rec)}
                        title="Preview Automated Recall Template"
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        disabled={rec.contacted || dispatchedRecalls[rec.id]}
                        onClick={() => onTriggerRecallNotice(rec.patientName, rec.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                          rec.contacted
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : dispatchedRecalls[rec.id]
                            ? 'bg-brand-500 text-white'
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 hover:scale-105'
                        }`}
                      >
                        {dispatchedRecalls[rec.id] ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching...</span>
                          </>
                        ) : rec.contacted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-slate-400" />
                            <span>Dispatched</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Send 1-Click Recall</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
