'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import { ZenithLogo } from '@/components/shared/ZenithLogo';

interface ManageHeaderAndSearchProps {
  notification: string | null;
  onDismissNotification: () => void;
  searchRef: string;
  onSearchRefChange: (val: string) => void;
  onSearch: (refToFind: string) => void;
}

export function ManageHeaderAndSearch({
  notification,
  onDismissNotification,
  searchRef,
  onSearchRefChange,
  onSearch,
}: ManageHeaderAndSearchProps) {
  return (
    <>
      {/* Top Navbar */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/b/zenith-dental" className="flex items-center gap-2 group">
            <ZenithLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block">ZENITH DENTAL</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Patient Concierge Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/b/zenith-dental"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clinic</span>
            </Link>

            <Link
              href="/dashboard"
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-semibold hidden sm:inline"
            >
              Admin Surgery Radar
            </Link>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-brand-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={onDismissNotification}
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Lookup / Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:flex-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Lookup Appointment by Booking Reference or Phone
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchRef}
              onChange={(e) => onSearchRefChange(e.target.value)}
              placeholder="e.g., ZD-829104, ZD-669849, or +44 7700..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-500 text-xs font-mono text-white placeholder-slate-500 uppercase"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSearch(searchRef)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-600/30 shrink-0"
        >
          <span>Search Records</span>
        </button>
      </div>
    </>
  );
}
