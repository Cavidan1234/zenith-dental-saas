'use client';

import React, { useState } from 'react';
import {
  Mail,
  Smartphone,
  X,
  Sparkles,
  ArrowUpRight,
  Send,
} from 'lucide-react';

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

interface RecallPreviewModalProps {
  previewRecall: RecallRecord | null;
  onClose: () => void;
  onDispatch: (patientName: string, id: string) => void;
  isDispatched: boolean;
}

export function RecallPreviewModal({
  previewRecall,
  onClose,
  onDispatch,
  isDispatched,
}: RecallPreviewModalProps) {
  const [previewChannel, setPreviewChannel] = useState<'email' | 'sms'>('email');

  if (!previewRecall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Automated 6-Month Oral Health Recall
              </h3>
              <p className="text-xs text-slate-300">
                Recipient: <span className="font-semibold text-white">{previewRecall.patientName}</span> ({previewRecall.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => setPreviewChannel('email')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'email'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Letterhead</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewChannel('sms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                previewChannel === 'sms'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS Instant Ping</span>
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-500">
            Due Date: <span className="text-amber-700 font-bold">{previewRecall.recallDueDate}</span>
          </span>
        </div>

        {/* Template Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
          {previewChannel === 'email' ? (
            /* Email Mockup */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-xl mx-auto space-y-5">
              {/* Clinic Brand Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
                    Z
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 tracking-tight block">ZENITH DENTAL STUDIO</span>
                    <span className="text-[10px] text-slate-400">Harley Street Clinic, London</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Preventive Advisory
                </span>
              </div>

              {/* Email Message Content */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <p className="font-bold text-slate-900 text-sm">
                  Dear {previewRecall.patientName},
                </p>
                <p>
                  It has been 6 months since your last visit on <span className="font-semibold text-slate-900">{previewRecall.lastVisitDate}</span> for <span className="font-semibold text-brand-700">{previewRecall.treatment}</span> with <span className="font-semibold text-slate-900">{previewRecall.doctor}</span>.
                </p>
                <p>
                  Routine ultrasonic prophylaxis and our 12-point periodontal exam are essential to safeguard enamel stability and maintain long-term oral vitality.
                </p>

                {/* Highlight Box */}
                <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100 flex items-start gap-3 my-3">
                  <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-brand-950">
                    <span className="font-bold block">Priority Reserved Slots Active</span>
                    <span>We have prioritized early morning &amp; weekend slots for returning studio patients.</span>
                  </div>
                </div>

                {/* Call to Action Button */}
                <div className="pt-2 pb-1 text-center">
                  <a
                    href={`/recall?token=zd_${previewRecall.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
                  >
                    <span>Claim 6-Month Recall Slot</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Sign-off */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 block">{previewRecall.doctor}</span>
                  <span>Zenith Dental Clinical Team</span>
                </div>
                <div className="text-right">
                  <span>Tel: +44 20 7946 0991</span>
                </div>
              </div>
            </div>
          ) : (
            /* SMS Mockup (iPhone-style bubble) */
            <div className="max-w-sm mx-auto bg-white rounded-3xl border border-slate-300 p-4 shadow-md space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold mx-auto flex items-center justify-center text-xs">
                  ZD
                </div>
                <span className="text-xs font-bold text-slate-800 block mt-1">Zenith Dental</span>
                <span className="text-[10px] text-slate-400">{previewRecall.phone}</span>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-center text-slate-400 font-medium">Today · Automated Dispatch</div>
                <div className="p-3.5 bg-brand-600 text-white rounded-2xl rounded-br-xs text-xs leading-relaxed shadow-xs">
                  <p>
                    Hi {previewRecall.patientName}, it&apos;s time for your 6-month dental checkup with {previewRecall.doctor} at Zenith Dental!
                  </p>
                  <p className="mt-2">
                    <a
                      href={`/recall?token=zd_${previewRecall.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-100 underline font-medium hover:text-white transition-colors"
                    >
                      dentalbook.co/recall?token=zd_{previewRecall.id}
                    </a>
                  </p>
                  <span className="text-[9px] text-brand-200 block text-right mt-1.5">Delivered via SMS Gateway</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Close Preview
          </button>

          <button
            type="button"
            disabled={previewRecall.contacted || isDispatched}
            onClick={() => {
              onDispatch(previewRecall.patientName, previewRecall.id);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{previewRecall.contacted ? 'Already Dispatched' : 'Dispatch Notice Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
