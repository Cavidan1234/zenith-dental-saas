'use client';

import React from 'react';
import { X } from 'lucide-react';

interface WalkInRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  walkInModal: { time: string; doctor: string } | null;
  form: {
    name: string;
    phone: string;
    email: string;
    service: string;
    notes: string;
  };
  onChangeForm: (newForm: {
    name: string;
    phone: string;
    email: string;
    service: string;
    notes: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WalkInRegistrationModal({
  isOpen,
  onClose,
  walkInModal,
  form,
  onChangeForm,
  onSubmit,
}: WalkInRegistrationModalProps) {
  if (!isOpen || !walkInModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 space-y-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Register Walk-in Patient</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Slot: <strong className="text-brand-600">{walkInModal.time}</strong> with{' '}
              <strong className="text-slate-800">{walkInModal.doctor}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Togrul Huseynov"
              value={form.name}
              onChange={(e) => onChangeForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+994 50 123 4567"
                value={form.phone}
                onChange={(e) => onChangeForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="patient@mail.com"
                value={form.email}
                onChange={(e) => onChangeForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Treatment / Service
            </label>
            <select
              value={form.service}
              onChange={(e) => onChangeForm({ ...form, service: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            >
              <option value="Laser Teeth Whitening (In-Office)">Laser Teeth Whitening (In-Office)</option>
              <option value="Dental Implant Consultation & 3D CBCT">Dental Implant Consultation &amp; 3D CBCT</option>
              <option value="Porcelain Veneer Smile Design">Porcelain Veneer Smile Design</option>
              <option value="Comprehensive 3D Exam & Prophylaxis">Comprehensive 3D Exam &amp; Prophylaxis</option>
              <option value="Emergency Toothache & Pain Relief">Emergency Toothache &amp; Pain Relief</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Symptoms / Immediate Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Acute pain in upper jaw; urgent walk-in"
              value={form.notes}
              onChange={(e) => onChangeForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all active:scale-95 cursor-pointer"
            >
              Confirm Walk-in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
