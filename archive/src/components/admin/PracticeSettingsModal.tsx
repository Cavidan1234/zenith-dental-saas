'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  X,
  Check,
} from 'lucide-react';

export interface PracticeSettings {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  bufferMinutes: number;
  depositAmount: number;
  cancellationWindowHours: number;
  recallIntervalDays: number;
}

interface PracticeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PracticeSettings;
  onSave: (newSettings: PracticeSettings) => void;
}

export function PracticeSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: PracticeSettingsModalProps) {
  const [draftSettings, setDraftSettings] = useState<PracticeSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setDraftSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draftSettings);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 shadow-xs">
              <Sliders className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Practice Configuration &amp; Protocols</h3>
              <p className="text-xs text-slate-500">
                Clinical buffers, deposit policies, contact credentials and recall cadence.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Practice Identity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Practice Identity &amp; Concierge
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Clinic Legal &amp; Trading Name
                </label>
                <input
                  type="text"
                  value={draftSettings.clinicName}
                  onChange={(e) => setDraftSettings({ ...draftSettings, clinicName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium text-slate-800 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Surgery Address (Harley St. / Suite)
                </label>
                <input
                  type="text"
                  value={draftSettings.address}
                  onChange={(e) => setDraftSettings({ ...draftSettings, address: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reception Phone</label>
                <input
                  type="text"
                  value={draftSettings.phone}
                  onChange={(e) => setDraftSettings({ ...draftSettings, phone: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Concierge Email</label>
                <input
                  type="email"
                  value={draftSettings.email}
                  onChange={(e) => setDraftSettings({ ...draftSettings, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium text-slate-800 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Protocols & Buffer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Surgery Disinfection &amp; Turn-around Buffer
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Chair Turnaround Disinfection Interval</p>
                  <p className="text-[11px] text-slate-500">
                    Sanitization and sterile tray replenishment buffer automatically reserved after every patient.
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200/60">
                  {draftSettings.bufferMinutes} min buffer
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {[10, 15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDraftSettings({ ...draftSettings, bufferMinutes: mins })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      draftSettings.bufferMinutes === mins
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/30'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Financial Protection & Deposit */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Financial Protection &amp; Cancellation Rules
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mandatory Deposit */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Booking Deposit</span>
                  <span className="text-xs font-bold text-emerald-600">${draftSettings.depositAmount}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Prepaid deposit required from new patients to secure clinical surgery slots.
                </p>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[25, 50, 75, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDraftSettings({ ...draftSettings, depositAmount: amt })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                        draftSettings.depositAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cancellation Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Cancellation Cutoff</span>
                  <span className="text-xs font-bold text-amber-600">{draftSettings.cancellationWindowHours}h window</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Minimum advance notice window required for full deposit refund or reschedule.
                </p>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[12, 24, 48].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setDraftSettings({ ...draftSettings, cancellationWindowHours: hrs })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                        draftSettings.cancellationWindowHours === hrs
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {hrs}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Automated 6-Month Recall Cycle */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Automated Preventive Hygiene Cadence
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Routine Prophylaxis &amp; Recall Notice Interval</p>
                  <p className="text-[11px] text-slate-500">
                    Default timer after completed treatments before the patient enters the Recall Radar.
                  </p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-bold text-xs border border-cyan-200/60">
                  {draftSettings.recallIntervalDays} Days
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { days: 90, label: '3 Months (Perio)' },
                  { days: 180, label: '6 Months (Standard)' },
                  { days: 365, label: '12 Months (Annual)' },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => setDraftSettings({ ...draftSettings, recallIntervalDays: item.days })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      draftSettings.recallIntervalDays === item.days
                        ? 'bg-cyan-700 text-white border-cyan-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const defaults: PracticeSettings = {
                  clinicName: 'Zenith Dental & Esthetics',
                  address: '14 Harley Street, Marylebone, London W1G 9PR',
                  phone: '+44 20 7946 0991',
                  email: 'concierge@zenithdental.co.uk',
                  bufferMinutes: 15,
                  depositAmount: 50,
                  cancellationWindowHours: 24,
                  recallIntervalDays: 180,
                };
                setDraftSettings(defaults);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Reset to Studio Defaults
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Protocols</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
