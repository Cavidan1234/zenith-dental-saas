'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PatientCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: number;
  onConfirmCancel: () => void;
}

export function PatientCancelModal({
  isOpen,
  onClose,
  depositAmount,
  onConfirmCancel,
}: PatientCancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-500/30 shadow-2xl space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
        <div>
          <h3 className="text-base font-bold text-white">Cancel Appointment &amp; Refund Deposit</h3>
          <p className="text-xs text-rose-200">
            Your cancellation meets the &gt;24-hour advance notice window. The ${depositAmount}.00 deposit will be returned in full.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
        >
          Keep Appointment
        </button>
        <button
          type="button"
          onClick={onConfirmCancel}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
        >
          Yes, Cancel Appointment &amp; Issue Refund
        </button>
      </div>
    </div>
  );
}
