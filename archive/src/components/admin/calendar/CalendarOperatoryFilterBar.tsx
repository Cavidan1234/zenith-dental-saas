'use client';

import React from 'react';

interface CalendarOperatoryFilterBarProps {
  selectedDoctorFilter: string;
  onSelectDoctorFilter: (filter: string) => void;
  showLeyla: boolean;
  showRashad: boolean;
  slotColSpan: string;
}

export function CalendarOperatoryFilterBar({
  selectedDoctorFilter,
  onSelectDoctorFilter,
  showLeyla,
  showRashad,
  slotColSpan,
}: CalendarOperatoryFilterBarProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Filter Operatory View:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectDoctorFilter('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedDoctorFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
          >
            All Specialists (2)
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectDoctorFilter(selectedDoctorFilter === 'doc-leyla' ? 'all' : 'doc-leyla')
            }
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedDoctorFilter === 'doc-leyla'
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm ring-2 ring-brand-300'
                : 'text-brand-800 bg-brand-50 border-brand-200 hover:bg-brand-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                selectedDoctorFilter === 'doc-leyla' ? 'bg-white' : 'bg-brand-600'
              }`}
            />
            Dr. Leyla (Aesthetics)
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectDoctorFilter(selectedDoctorFilter === 'doc-rashad' ? 'all' : 'doc-rashad')
            }
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              selectedDoctorFilter === 'doc-rashad'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                : 'text-blue-900 bg-blue-50 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                selectedDoctorFilter === 'doc-rashad' ? 'bg-white' : 'bg-blue-600'
              }`}
            />
            Dr. Rashad (Implants)
          </button>
        </div>
      </div>

      {/* Column Labels */}
      <div className="grid grid-cols-12 gap-3 px-3.5 pt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-2">Time Slot</div>
        {showLeyla && (
          <div className={`${slotColSpan} text-brand-700 flex items-center gap-1.5`}>
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            Dr. Leyla Mammadova {showRashad ? '· Surgery Room 1' : '· Surgery Room 1 (Orthodontics & Aesthetics)'}
          </div>
        )}
        {showRashad && (
          <div className={`${slotColSpan} text-blue-700 flex items-center gap-1.5`}>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Dr. Rashad Aliyev {showLeyla ? '· Surgery Room 2' : '· Surgery Room 2 (Oral Surgery & Implants)'}
          </div>
        )}
      </div>
    </>
  );
}
