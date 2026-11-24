'use client';

import React, { useState } from 'react';
import { FileText, MessageCircle, Copy, Check } from 'lucide-react';
import { playHapticTick } from '@/lib/soundscapes';
import { BookingRecord } from './PatientDossierDrawer';

interface DashboardAppointmentsTabProps {
  filteredBookings: BookingRecord[];
  totalBookingsCount: number;
  onSelectBooking: (booking: BookingRecord) => void;
  onOpenWhatsAppModal: (booking: BookingRecord) => void;
  onUpdateStatus: (id: string, status: 'confirmed' | 'arrived' | 'pending' | 'completed' | 'cancelled' | 'in_surgery') => void;
}

export function DashboardAppointmentsTab({
  filteredBookings,
  totalBookingsCount,
  onSelectBooking,
  onOpenWhatsAppModal,
  onUpdateStatus,
}: DashboardAppointmentsTabProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    playHapticTick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      <div className="p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Registered Patient Bookings</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Includes real-time patient reservations made on the live site &amp; Google Pay tests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900 font-black">{filteredBookings.length}</span> of {totalBookingsCount} patients
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 border-b border-slate-200 uppercase tracking-wider text-slate-600 font-bold">
            <tr>
              <th className="py-3.5 px-6">Patient Name</th>
              <th className="py-3.5 px-6">Treatment</th>
              <th className="py-3.5 px-6">Doctor</th>
              <th className="py-3.5 px-6">Date &amp; Slot</th>
              <th className="py-3.5 px-6">Deposit</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No patient bookings matched the current filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => onSelectBooking(b)}
                  className={`hover:bg-brand-50/40 transition-colors duration-150 cursor-pointer group ${
                    b.isRecent ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-brand-700 transition-colors">
                        {b.patientName}
                      </span>
                      {b.isRecent && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Fresh
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {b.email} · {b.phone}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyId(e, b.id)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-brand-600 font-bold mt-0.5 hover:text-brand-800 transition-colors group/copy cursor-pointer"
                      title="Click to copy booking reference"
                    >
                      <span>{b.id}</span>
                      {copiedId === b.id ? (
                        <Check className="w-3 h-3 text-emerald-600 animate-in zoom-in-50" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400 opacity-60 group-hover/copy:opacity-100 transition-opacity" />
                      )}
                    </button>

                    {/* PATIENT NOTE BOX */}
                    {b.notes ? (
                      <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 max-w-md shadow-2xs transition-all duration-200 hover:border-amber-300">
                        <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-amber-950 leading-relaxed">
                          <span className="font-black text-amber-800 uppercase tracking-wider text-[10px] block mb-0.5">
                            Pasiyentin Qeydi:
                          </span>
                          &ldquo;{b.notes}&rdquo;
                        </div>
                      </div>
                    ) : null}
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {b.service}
                  </td>
                  <td className="py-4 px-6 text-slate-800 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                      {b.doctor}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 block">{b.date}</span>
                    <span className="text-slate-500 text-[11px] font-mono">{b.time} ({b.duration}m)</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                      ${b.depositAmount} Paid
                    </span>
                    {(b.paymentLabel || b.paymentMethod) && (
                      <div className="text-[10px] text-slate-500 font-medium mt-1">
                        {b.paymentLabel ||
                          (b.paymentMethod === 'google_pay'
                            ? 'Google Pay (TEST)'
                            : b.paymentMethod === 'apple_pay'
                            ? 'Apple Pay'
                            : 'Credit Card')}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'confirmed'
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : b.status === 'in_surgery'
                          ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 ring-2 ring-cyan-400/20'
                          : b.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-brand-600'
                            : b.status === 'in_surgery'
                            ? 'bg-cyan-500 animate-ping'
                            : b.status === 'completed'
                            ? 'bg-emerald-500'
                            : b.status === 'pending'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-rose-400'
                        }`}
                      />
                      {b.status === 'in_surgery' ? 'In Surgery' : b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenWhatsAppModal(b)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all duration-150 active:scale-95 shadow-2xs flex items-center gap-1 cursor-pointer"
                        title="Send WhatsApp Outbound Reminder"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                      <button
                        onClick={() => onSelectBooking(b)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Open Clinical Dossier"
                      >
                        Dossier
                      </button>
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => onUpdateStatus(b.id, 'cancelled')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
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
