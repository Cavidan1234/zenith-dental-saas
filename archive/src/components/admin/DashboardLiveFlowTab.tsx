'use client';

import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { BookingRecord } from './PatientDossierDrawer';
import { playSuccessPing, playLuxuryChime, playHapticTick } from '@/lib/soundscapes';
import { LiveFlowColumn } from './flow/LiveFlowColumn';
import { LiveTelemetryAuditFeed } from './flow/LiveTelemetryAuditFeed';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface DashboardLiveFlowTabProps {
  bookings: BookingRecord[];
  onUpdateStatus: (id: string, newStatus: any) => void;
  onSelectBooking: (booking: BookingRecord) => void;
  onOpenRxModal: (patientName: string) => void;
  onOpenWhatsApp: (booking: BookingRecord) => void;
  isDarkMode?: boolean;
}

export function DashboardLiveFlowTab({
  bookings,
  onUpdateStatus,
  onSelectBooking,
  onOpenRxModal,
  onOpenWhatsApp,
  isDarkMode: _isDarkMode = false,
}: DashboardLiveFlowTabProps) {
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter bookings by doctor and search query
  const filtered = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const matchesDoc =
      selectedDoctorFilter === 'all'
        ? true
        : selectedDoctorFilter === 'doc-leyla'
        ? b.doctor.includes('Leyla')
        : b.doctor.includes('Rashad');
    const matchesSearch =
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDoc && matchesSearch;
  });

  const upcomingList = filtered.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const arrivedList = filtered.filter((b) => (b.status as any) === 'arrived');
  const inSurgeryList = filtered.filter((b) => b.status === 'in_surgery');
  const completedList = filtered.filter((b) => b.status === 'completed');

  const handleMarkArrived = (id: string) => {
    playHapticTick();
    onUpdateStatus(id, 'arrived');
  };

  const handleCallToChair = (id: string) => {
    playLuxuryChime();
    onUpdateStatus(id, 'in_surgery');
  };

  const handleDischarge = (b: BookingRecord) => {
    playSuccessPing();
    onUpdateStatus(b.id, 'completed');
    onOpenRxModal(b.patientName);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls & Live Practice Metrics */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Surgery Corridor &amp; Waiting Lounge Flow
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time patient transit: Reception Check-In &rarr; Waiting Lounge &rarr; Operatory Chair &rarr; Clinical Discharge.
            </p>
          </div>

          {/* Doctor Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-500 transition-all w-36 sm:w-48"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedDoctorFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedDoctorFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Doctors
              </button>
              <button
                type="button"
                onClick={() => setSelectedDoctorFilter('doc-leyla')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedDoctorFilter === 'doc-leyla'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dr. Leyla
              </button>
              <button
                type="button"
                onClick={() => setSelectedDoctorFilter('doc-rashad')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedDoctorFilter === 'doc-rashad'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dr. Rashad
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Stage Summary Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Expected Today</span>
            <span className="text-xl font-black text-slate-800">
              <AnimatedNumber value={upcomingList.length} duration={800} />
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <span className="text-[11px] font-semibold text-amber-700 block">Waiting in Lounge</span>
            <span className="text-xl font-black text-amber-900">
              <AnimatedNumber value={arrivedList.length} duration={800} />
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-brand-50/70 border border-brand-200/80">
            <span className="text-[11px] font-semibold text-brand-700 block">In Operatory Chair</span>
            <span className="text-xl font-black text-brand-900">
              <AnimatedNumber value={inSurgeryList.length} duration={800} />
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <span className="text-[11px] font-semibold text-emerald-700 block">Discharged &amp; Post-Op</span>
            <span className="text-xl font-black text-emerald-900">
              <AnimatedNumber value={completedList.length} duration={800} />
            </span>
          </div>
        </div>
      </div>

      {/* 4-COLUMN KANBAN WORKFLOW CORRIDOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <LiveFlowColumn
          title="1. Expected Today"
          count={upcomingList.length}
          indicatorColor="bg-slate-400"
          columnBg="bg-slate-50/90"
          columnBorder="border border-slate-200"
          emptyText="All scheduled patients have checked in."
          bookings={upcomingList}
          stage="expected"
          onSelectBooking={onSelectBooking}
          onMarkArrived={handleMarkArrived}
        />
        <LiveFlowColumn
          title="2. Waiting Lounge"
          count={arrivedList.length}
          indicatorColor="bg-amber-500 animate-pulse"
          columnBg="bg-amber-50/40"
          columnBorder="border border-amber-200/80"
          emptyText="No patients currently in reception waiting lounge."
          bookings={arrivedList}
          stage="waiting"
          onSelectBooking={onSelectBooking}
          onCallToChair={handleCallToChair}
        />
        <LiveFlowColumn
          title="3. In Operatory Chair"
          count={inSurgeryList.length}
          indicatorColor="bg-brand-600 animate-ping"
          columnBg="bg-brand-50/40"
          columnBorder="border border-brand-200/80"
          emptyText="Chairs currently idle / undergoing UV-C disinfection."
          bookings={inSurgeryList}
          stage="in_surgery"
          onSelectBooking={onSelectBooking}
          onDischarge={handleDischarge}
        />
        <LiveFlowColumn
          title="4. Completed Today"
          count={completedList.length}
          indicatorColor="bg-emerald-500"
          columnBg="bg-emerald-50/40"
          columnBorder="border border-emerald-200/80"
          emptyText="No procedures discharged yet today."
          bookings={completedList}
          stage="completed"
          onSelectBooking={onSelectBooking}
          onOpenWhatsApp={onOpenWhatsApp}
          onOpenRxModal={onOpenRxModal}
        />
      </div>

      {/* 5. REAL-TIME CLINICAL TELEMETRY & AUDIT STREAM */}
      <LiveTelemetryAuditFeed />
    </div>
  );
}
