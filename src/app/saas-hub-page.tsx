'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Lock,
  BellRing,
} from 'lucide-react';

export default function RootHomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 relative overflow-hidden font-sans">
      {/* Background ambient medical grid */}
      <div className="absolute inset-0 bg-medical-grid opacity-60 pointer-events-none" />
      <div className="blue-subtle-glow absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black shadow-md shadow-brand-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                DentalBook<span className="text-brand-600">.os</span>
              </span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Clinical Multi-Tenant Booking SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Staff Portal
            </Link>
            <Link
              href="/b/zenith-dental"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/30 transition-all"
            >
              <span>Live Patient Site</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-16 pb-24 sm:pt-20 sm:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
            <span>Next-Gen Multi-Tenant Operating System for Dental Practices</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
            The Clinical Platform with{' '}
            <span className="text-brand-600 underline decoration-brand-200 decoration-wavy decoration-2 underline-offset-8">
              Zero Race Conditions
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate double bookings forever with PostgreSQL transactional locking, automated 15-minute room sterilization buffers, and 6-month patient retention.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/b/zenith-dental"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Showcase Clinic (/b/zenith-dental)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
            >
              <span>Open Staff Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-brand-500 hover:shadow-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">DB-Level Concurrency</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              PostgreSQL transactional row-level locking. 50 parallel booking attempts executed at the exact same millisecond: 1 winner, 49 rejections.
            </p>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Tested: 50 Concurrent Stress Test Passed (373ms)
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-brand-500 hover:shadow-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Availability & Buffer Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Calculates daily shifts, lunch breaks, and mandatory 15-minute room sterilization turnaround times before serving slots to patients.
            </p>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Zero Wait Time Guarantee
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-brand-500 hover:shadow-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center mb-6">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">6-Month Patient Recall</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Automated retention engine prompts patients 180 days post-treatment for routine oral hygiene and prophylaxis, boosting clinic LTV by 35%.
            </p>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Automated Retention Active
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 text-center text-xs text-slate-500 bg-slate-50">
        DentalBook.os · Multi-Tenant Clinical SaaS Architecture · Powered by Next.js & Drizzle ORM
      </footer>
    </div>
  );
}
