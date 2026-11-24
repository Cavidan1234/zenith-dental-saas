'use client';

import React from 'react';
import { Search, Download, BarChart3 } from 'lucide-react';

export type DashboardTabType = 'calendar' | 'live_flow' | 'bookings' | 'recall' | 'analytics';

interface DashboardTabsNavProps {
  activeTab: DashboardTabType;
  onSelectTab: (tab: DashboardTabType) => void;
  filteredBookingsCount: number;
  filteredRecallsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExportCSV: () => void;
  selectedDoctorFilter: string;
  onDoctorFilterChange: (doc: string) => void;
}

export function DashboardTabsNav({
  activeTab,
  onSelectTab,
  filteredBookingsCount,
  filteredRecallsCount,
  searchQuery,
  onSearchChange,
  onExportCSV,
  selectedDoctorFilter,
  onDoctorFilterChange,
}: DashboardTabsNavProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => onSelectTab('calendar')}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Schedule (Time-Grid)</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('live_flow')}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
            activeTab === 'live_flow'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>Surgery Flow &amp; Lounge</span>
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'live_flow'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('bookings')}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>All Bookings</span>
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'bookings'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {filteredBookingsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('recall')}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
            activeTab === 'recall'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>6-Month Recall</span>
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'recall'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {filteredRecallsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('analytics')}
          className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Practice Analytics</span>
          </span>
        </button>
      </div>

      {/* Controls: Search, CSV Export & Doctor Filter */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5">
        {activeTab === 'bookings' && (
          <>
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by name, email..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all w-full sm:w-52 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={onExportCSV}
              title="Export Filtered Bookings to CSV"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-700 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </>
        )}

        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <span className="text-slate-500 font-bold hidden sm:inline">Specialist:</span>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => onDoctorFilterChange(e.target.value)}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all shadow-2xs cursor-pointer max-w-[170px] sm:max-w-none truncate"
          >
            <option value="all">All Specialists (2)</option>
            <option value="doc-leyla">Dr. Leyla (Aesthetics)</option>
            <option value="doc-rashad">Dr. Rashad (Surgery)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
