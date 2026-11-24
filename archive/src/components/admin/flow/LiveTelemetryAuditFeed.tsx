'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  FileCheck2,
  ShieldAlert,
  Sparkles,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { playHapticTick, isSoundEnabled } from '@/lib/soundscapes';

interface TelemetryEvent {
  id: string;
  timestamp: string;
  category: 'radiology' | 'triage' | 'billing' | 'surgery' | 'hygiene';
  title: string;
  description: string;
  refCode?: string;
  severity?: 'normal' | 'priority' | 'success';
}

const INITIAL_EVENTS: TelemetryEvent[] = [
  {
    id: 'tel-1',
    timestamp: '14:48:12',
    category: 'billing',
    title: 'AXA Healthcare Pre-Auth Verified',
    description: 'Policy #AX-9921 authorized £420.00 for Elena Rostova',
    refCode: 'ZD-829104',
    severity: 'success',
  },
  {
    id: 'tel-2',
    timestamp: '14:45:30',
    category: 'radiology',
    title: 'Dental PACS Arch Analysis',
    description: 'Dr. Leyla Aliyeva calibrated Upper Arch #11-#21 veneer margin',
    refCode: 'PACS-492',
    severity: 'normal',
  },
  {
    id: 'tel-3',
    timestamp: '14:38:15',
    category: 'hygiene',
    title: 'Infection Control Radar Cleared',
    description: 'Autoclave Chamber #2 cycle completed (134°C / 30 PSI, sterile)',
    severity: 'success',
  },
  {
    id: 'tel-4',
    timestamp: '14:29:40',
    category: 'triage',
    title: 'Digital Surgery Pass Scanned',
    description: 'Patient checked in via Apple Wallet QR at Reception Lounge',
    refCode: 'ZD-710294',
    severity: 'normal',
  },
  {
    id: 'tel-5',
    timestamp: '14:18:00',
    category: 'surgery',
    title: 'Operatory Chair Seated',
    description: 'Surgery Suite 1 engaged for Complex Crown Prep (Dr. Rashad)',
    refCode: 'OP-1',
    severity: 'priority',
  },
];

const STREAM_POOL: Omit<TelemetryEvent, 'id' | 'timestamp'>[] = [
  {
    category: 'billing',
    title: 'Google Pay Sandbox Deposit Captured',
    description: 'Instant £50.00 commitment deposit settled idempotently',
    severity: 'success',
  },
  {
    category: 'radiology',
    title: 'Panorex Radiograph Synced',
    description: 'High-definition digital sensor exposure logged to EMR record',
    severity: 'normal',
  },
  {
    category: 'triage',
    title: 'Medical Clearance Form Signed',
    description: 'Zero contraindications reported on digital medical intake',
    severity: 'success',
  },
  {
    category: 'surgery',
    title: 'Electronic Rx Discharge Signed',
    description: 'Amoxicillin 500mg & Chlorhexidine rinse prescribed',
    severity: 'priority',
  },
];

export function LiveTelemetryAuditFeed() {
  const [events, setEvents] = useState<TelemetryEvent[]>(INITIAL_EVENTS);
  const [filter, setFilter] = useState<string>('all');
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);

  // Periodic subtle telemetry ingestion
  useEffect(() => {
    if (!isLiveStreamActive) return;

    const interval = setInterval(() => {
      const randomItem = STREAM_POOL[Math.floor(Math.random() * STREAM_POOL.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
      const newEvent: TelemetryEvent = {
        ...randomItem,
        id: `tel-${Date.now()}`,
        timestamp: timeStr,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      if (isSoundEnabled()) playHapticTick();
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveStreamActive]);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.category === filter;
  });

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4">
      {/* Header with live radar indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-slate-100 flex items-center gap-2">
              Clinical Telemetry &amp; Audit Stream
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold lowercase">
                live 120fps
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Real-time audit log of surgical chair transit, radiograph PACS, and insurance pre-authorizations.
            </p>
          </div>
        </div>

        {/* Play/Pause & Status controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isLiveStreamActive
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            {isLiveStreamActive ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="hidden sm:inline">Pause Ticker</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="hidden sm:inline">Resume Ticker</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-medium">
        {(['all', 'radiology', 'triage', 'billing', 'surgery', 'hygiene'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
              filter === cat
                ? 'bg-brand-600 text-white font-bold shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-2">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 transition-all text-xs group"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0 mt-0.5">
                {evt.timestamp}
              </span>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 group-hover:text-brand-300 transition-colors">
                    {evt.title}
                  </span>
                  {evt.refCode && (
                    <span className="font-mono text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                      {evt.refCode}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate">{evt.description}</p>
              </div>
            </div>

            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize bg-slate-900 border border-slate-700 text-slate-300">
              {evt.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
