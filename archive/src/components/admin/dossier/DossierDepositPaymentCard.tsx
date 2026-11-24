'use client';

import React from 'react';
import { BookingRecord } from '../PatientDossierDrawer';

interface DossierDepositPaymentCardProps {
  booking: BookingRecord;
}

export function DossierDepositPaymentCard({ booking }: DossierDepositPaymentCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-emerald-900">Prepaid Reservation Deposit</span>
        <span className="font-black text-emerald-800 text-sm">${booking.depositAmount}.00</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-emerald-700">
        <span>Payment Gateway:</span>
        <span className="font-semibold">
          {booking.paymentLabel ||
            (booking.paymentMethod === 'google_pay'
              ? 'Google Pay (Sandbox)'
              : booking.paymentMethod === 'apple_pay'
              ? 'Apple Pay'
              : booking.paymentMethod === 'in_clinic'
              ? 'In-Clinic Walk-in'
              : 'Credit Card')}
        </span>
      </div>
      <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-600 font-mono">
        <span>Status: Deposit Paid</span>
        <span>Ref: {booking.id}</span>
      </div>
    </div>
  );
}
