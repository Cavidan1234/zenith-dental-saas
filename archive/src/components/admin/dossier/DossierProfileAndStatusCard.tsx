'use client';

import React from 'react';
import { Phone, Mail, Stethoscope, Clock, AlertCircle } from 'lucide-react';
import { BookingRecord } from '../PatientDossierDrawer';

interface DossierProfileAndStatusCardProps {
  booking: BookingRecord;
  onUpdateStatus: (id: string, newStatus: BookingRecord['status']) => void;
}

export function DossierProfileAndStatusCard({
  booking,
  onUpdateStatus,
}: DossierProfileAndStatusCardProps) {
  return (
    <div className="space-y-6">
      {/* Patient Profile Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-brand-600/20">
            {booking.patientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base">{booking.patientName}</h3>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
              <a
                href={`tel:${booking.phone}`}
                className="hover:text-brand-600 flex items-center gap-1 font-medium"
              >
                <Phone className="w-3 h-3 text-slate-400" />
                {booking.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <a
            href={`mailto:${booking.email}`}
            className="text-slate-600 hover:text-brand-600 flex items-center gap-1.5 truncate max-w-[200px]"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{booking.email}</span>
          </a>
          <span className="text-[11px] font-mono text-slate-400">
            Registered: {booking.date}
          </span>
        </div>
      </div>

      {/* Treatment & Time Details */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Scheduled Session</span>
          <span className="text-brand-600 font-mono">{booking.duration} mins</span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{booking.service}</h4>
          <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
            {booking.doctor}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs font-medium text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {booking.date} at <strong className="text-slate-900">{booking.time}</strong>
          </span>
        </div>
      </div>

      {/* Clinical Status Controller */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Surgery Life-cycle Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'confirmed', label: 'Confirmed', color: 'border-brand-500 bg-brand-50 text-brand-700' },
            { key: 'in_surgery', label: 'In Surgery', color: 'border-cyan-500 bg-cyan-50 text-cyan-800 ring-2 ring-cyan-400/30' },
            { key: 'completed', label: 'Completed', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
            { key: 'cancelled', label: 'Cancelled', color: 'border-rose-500 bg-rose-50 text-rose-700' },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onUpdateStatus(booking.id, s.key as BookingRecord['status'])}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                booking.status === s.key
                  ? s.color
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {booking.status === s.key ? `✓ ${s.label}` : s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient's Note from Booking Modal */}
      {booking.notes && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Pasiyentin Bron Zamanı Qeydi (Chief Complaint)</span>
          </div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
            &ldquo;{booking.notes}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
