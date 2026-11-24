'use client';

import React, { useState } from 'react';
import {
  Download,
  Calendar,
  PieChart,
  ShieldCheck,
  Award,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

interface BookingRecord {
  id: string;
  patientName: string;
  phone?: string;
  email?: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  depositAmount: number;
  paymentMethod?: string;
  paymentLabel?: string;
  status: string;
}

interface DashboardAnalyticsTabProps {
  bookings: BookingRecord[];
}

type Period = 'this_week' | 'last_30_days' | 'quarter';

export function DashboardAnalyticsTab({ bookings }: DashboardAnalyticsTabProps) {
  const [period, setPeriod] = useState<Period>('this_week');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Play subtle sound using Web Audio API
  const playExportChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable
    }
  };

  // Period-dependent metrics
  const periodData = {
    this_week: {
      label: 'Live Week Roster',
      depositVolume: '$7,870',
      depositGrowth: '+24% vs last wk',
      surgeriesText: 'Captured across 68 confirmed surgeries',
      noShowRate: '1.8%',
      noShowRecovered: 'Recovered ~$3,120 in lost chair time',
      averageYield: '$115.80',
      recallRate: '84.2%',
      chartBars: [
        { label: 'Mon', full: 'Monday', amount: 1150, height: '63%', appts: 14 },
        { label: 'Tue', full: 'Tuesday', amount: 1420, height: '78%', appts: 17 },
        { label: 'Wed', full: 'Wednesday', amount: 980, height: '54%', appts: 12 },
        { label: 'Thu', full: 'Thursday', amount: 1650, height: '90%', appts: 19 },
        { label: 'Fri', full: 'Friday', amount: 1820, height: '100%', appts: 21 },
        { label: 'Sat', full: 'Saturday', amount: 850, height: '47%', appts: 10 },
      ],
      doctorLeylaHours: '38.5 surgery hours / 42 hrs capacity',
      doctorRashadHours: '34.0 surgery hours / 40 hrs capacity',
    },
    last_30_days: {
      label: 'Past 30 Days (Rolling)',
      depositVolume: '$31,480',
      depositGrowth: '+18.4% MoM',
      surgeriesText: 'Captured across 272 confirmed surgeries',
      noShowRate: '1.5%',
      noShowRecovered: 'Recovered ~$12,480 in lost chair time',
      averageYield: '$118.40',
      recallRate: '86.1%',
      chartBars: [
        { label: 'Wk 1', full: 'Week 1 (Oct 01-07)', amount: 6900, height: '77%', appts: 62 },
        { label: 'Wk 2', full: 'Week 2 (Oct 08-14)', amount: 7450, height: '83%', appts: 67 },
        { label: 'Wk 3', full: 'Week 3 (Oct 15-21)', amount: 8230, height: '92%', appts: 73 },
        { label: 'Wk 4', full: 'Week 4 (Oct 22-28)', amount: 8900, height: '100%', appts: 79 },
      ],
      doctorLeylaHours: '154.0 surgery hours / 168 hrs capacity',
      doctorRashadHours: '136.0 surgery hours / 160 hrs capacity',
    },
    quarter: {
      label: 'Q1 Comprehensive Audit',
      depositVolume: '$94,440',
      depositGrowth: '+31.2% YoY',
      surgeriesText: 'Captured across 816 confirmed surgeries',
      noShowRate: '1.4%',
      noShowRecovered: 'Recovered ~$37,440 in lost chair time',
      averageYield: '$122.10',
      recallRate: '88.5%',
      chartBars: [
        { label: 'Jan', full: 'January 2026', amount: 28500, height: '84%', appts: 251 },
        { label: 'Feb', full: 'February 2026', amount: 32100, height: '95%', appts: 279 },
        { label: 'Mar', full: 'March 2026', amount: 33840, height: '100%', appts: 286 },
      ],
      doctorLeylaHours: '462.0 surgery hours / 504 hrs capacity',
      doctorRashadHours: '408.0 surgery hours / 480 hrs capacity',
    },
  }[period];

  // CSV Generation Function
  const exportFinancialAuditCSV = () => {
    playExportChime();

    const headers = [
      'Transaction_Reference',
      'Patient_Name',
      'Phone',
      'Email',
      'Clinical_Service',
      'Lead_Specialist',
      'Surgery_Date',
      'Slot_Time',
      'Deposit_Amount_USD',
      'Payment_Method',
      'Status',
      'Audit_Period',
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.patientName}"`,
      `"${b.phone || '+44 7700 900077'}"`,
      `"${b.email || 'patient@zenithdental.co'}"`,
      `"${b.service}"`,
      `"${b.doctor}"`,
      `"${b.date}"`,
      `"${b.time}"`,
      `"${b.depositAmount}"`,
      `"${b.paymentLabel || b.paymentMethod || 'Credit Card'}"`,
      `"${b.status}"`,
      `"${period}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `DentalBook_Financial_Audit_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Financial Audit CSV exported successfully (${bookings.length} transactions included)`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-slide-up text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar & Export Actions */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Financial Reporting Period:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(
              [
                { id: 'this_week', label: 'This Week' },
                { id: 'last_30_days', label: 'Last 30 Days' },
                { id: 'quarter', label: 'Quarter-to-Date' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPeriod(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={exportFinancialAuditCSV}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Financial Audit (CSV)</span>
          <Download className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Top KPI Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Deposit Volume
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {periodData.depositVolume}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {periodData.depositGrowth}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{periodData.surgeriesText}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            No-Show Mitigation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">
              {periodData.noShowRate}
            </span>
            <span className="text-xs font-bold text-slate-400 line-through">22% avg</span>
          </div>
          <p className="text-[11px] text-slate-400">{periodData.noShowRecovered}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Average Surgery Yield
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-600 tracking-tight">
              {periodData.averageYield}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">/ hour</span>
          </div>
          <p className="text-[11px] text-slate-400">Optimized with 15m room sterilization</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            6-Month Recall Efficiency
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 tracking-tight">
              {periodData.recallRate}
            </span>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              High Retention
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Patients returning within 180 days</p>
        </div>
      </div>

      {/* Middle Section: Bar Chart & Specialist Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Bar Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Deposit &amp; Surgery Volume Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prepaid deposits collected during {period.replace('_', ' ')}
              </p>
            </div>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              {periodData.label}
            </span>
          </div>

          {/* Interactive Bar Visualization */}
          <div className="pt-4 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 pb-3">
              {periodData.chartBars.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-10">
                    {item.full}: ${item.amount.toLocaleString()} ({item.appts} visits)
                  </div>

                  <div className="w-full flex justify-center items-end h-36">
                    <div
                      style={{ height: item.height }}
                      className="w-full max-w-[42px] rounded-xl bg-gradient-to-t from-brand-600 to-blue-500 group-hover:from-brand-500 group-hover:to-blue-400 transition-all duration-300 shadow-2xs"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-brand-600 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specialist Chair Utilization (1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Chair Utilization by Doctor</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time surgery occupancy vs operational capacity
            </p>
          </div>

          <div className="space-y-5 my-auto">
            {/* Doctor 1: Dr. Leyla */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Dr. Leyla Mammadova</span>
                  <span className="text-[11px] text-slate-500">Suite A · Aesthetics &amp; Aligners</span>
                </div>
                <span className="font-mono font-extrabold text-brand-600 text-sm">91.2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: '91.2%' }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block text-right">
                {periodData.doctorLeylaHours}
              </span>
            </div>

            {/* Doctor 2: Dr. Rashad */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Dr. Rashad Aliyev</span>
                  <span className="text-[11px] text-slate-500">Suite B · 3D Implants &amp; Surgery</span>
                </div>
                <span className="font-mono font-extrabold text-blue-600 text-sm">86.4%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: '86.4%' }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block text-right">
                {periodData.doctorRashadHours}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Both suites operating at peak Tier-1 clinical efficiency.</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Treatment Contribution & No-Show ROI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Treatment Contribution Matrix */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Treatment Revenue Contribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Volume &amp; revenue share by clinical category</p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Porcelain Veneer Smile Design', share: '38%', rev: '$3,400', count: '14 visits', color: 'bg-brand-500' },
              { label: 'Dental Implant Consultation & 3D CBCT', share: '23%', rev: '$2,100', count: '8 visits', color: 'bg-blue-500' },
              { label: 'Laser Teeth Whitening (In-Office)', share: '21%', rev: '$1,850', count: '16 visits', color: 'bg-emerald-500' },
              { label: 'Comprehensive 3D Exam & Prophylaxis', share: '18%', rev: '$1,600', count: '24 visits', color: 'bg-amber-500' },
            ].map((proc, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${proc.color} shrink-0`} />
                  <div>
                    <span className="font-bold text-slate-900 block">{proc.label}</span>
                    <span className="text-[11px] text-slate-400">{proc.count}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">{proc.rev}</span>
                  <span className="text-[11px] text-slate-500 block font-mono">{proc.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No-Show Mitigation Architecture */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Financial Protection System</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Prepaid Deposit Impact: {periodData.noShowRecovered.replace(' in lost chair time', '')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              Traditional dental practices lose an average of 22% of revenue to same-day no-shows. By requiring an upfront prepaid deposit, DentalBook achieves a 98.2% attendance rate.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Before DentalBook</span>
              <span className="text-xl font-black text-rose-400">22% Missed</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">~$3,400 monthly loss</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
              <span className="text-emerald-300 text-[10px] font-bold uppercase block mb-1">With $50 Deposit</span>
              <span className="text-xl font-black text-emerald-400">98.2% Show</span>
              <span className="text-[10px] text-emerald-200 block mt-0.5">Zero empty chairs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
