'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    id: 'doc-leyla',
    name: 'Dr. Leyla Mammadova',
    role: 'Lead Aesthetic Dentist & Orthodontist',
    suite: 'Harley Street Suite A · Owner',
    email: 'admin@zenithdental.com',
    password: 'Zenith2026!',
    avatar: '/images/dental/doctor-leyla.jpg',
  },
  {
    id: 'doc-rashad',
    name: 'Dr. Rashad Aliyev',
    role: 'Oral & Maxillofacial Surgeon',
    suite: 'Harley Street Suite B · Specialist',
    email: 'rashad.aliyev@zenithdental.com',
    password: 'Zenith2026!',
    avatar: '/images/dental/doctor-rashad.jpg',
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@zenithdental.com');
  const [password, setPassword] = useState('Zenith2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('doc-leyla');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectDemo = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setSelectedDemoId(account.id);
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error while connecting to clinical authentication server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#f8fafc] text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900 relative flex flex-col justify-between select-none">
      {/* Subtle Architectural Micro-Dot Grid & Ambient Aurora (Layer 2) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 18% 20%, rgba(56, 189, 248, 0.10), transparent 45%), radial-gradient(circle at 85% 80%, rgba(37, 99, 235, 0.08), transparent 45%)',
        }}
      />

      {/* Top Compact Clinical Header (Matches Public & Dashboard Header) */}
      <header className="relative z-20 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md h-[66px] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/b/zenith-dental"
              className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 transition-transform duration-200 hover:scale-105 active:scale-95 border border-slate-200/80"
              title="Return to Public Clinic Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/b/zenith-dental" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200/80 shadow-2xs p-1 transition-transform duration-200 group-hover:scale-105">
                <ZenithLogo size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                  Zenith Dental
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Marylebone · London
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PostgreSQL Surgery Node Online</span>
            </div>
            <Link
              href="/b/zenith-dental"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 transition-colors"
            >
              <span>Public Clinic</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Centered Split Container — Fits Exact Remaining Viewport Height */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-0 py-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT PANEL: Royal Blue Studio Identity & Quick Specialist Switcher */}
          <div className="hidden lg:flex lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#1e40af] via-[#1d4ed8] to-[#1e3a8a] text-white p-8 xl:p-9 flex-col justify-between relative overflow-hidden shadow-xl border border-blue-800/40">
            {/* Ambient Corner Luster Bubbles (Pure GPU, Zero Lag) */}
            <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-400/10 to-transparent border border-white/20 pointer-events-none" />
            <div className="absolute -bottom-14 -right-14 w-52 h-52 rounded-full bg-gradient-to-tl from-cyan-300/15 via-blue-300/10 to-transparent border border-white/15 pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 border border-white/20 text-cyan-200 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Harley Street Clinical OS · Staff Portal</span>
              </div>

              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.18]">
                Precision Practice{' '}
                <span className="relative inline-block text-cyan-300">
                  Command Center.
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-cyan-400 pointer-events-none overflow-visible"
                    viewBox="0 0 250 16"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 3 11 C 55 4, 135 3, 246 8"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-sm text-blue-100/90 leading-relaxed font-normal max-w-md">
                Access real-time 3D chair occupancy, patient surgical dossiers, sterilization buffers, and walk-in scheduling synchronized with our clinical database.
              </p>
            </div>

            {/* One-Click Specialist Account Selector */}
            <div className="relative z-10 space-y-3 my-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200">
                  Quick Specialist Selection (1-Click Fill)
                </span>
                <span className="text-[11px] text-cyan-300 font-medium">Active Database Staff</span>
              </div>

              <div className="space-y-2.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = selectedDemoId === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-slate-900 border-white shadow-lg scale-[1.01]'
                          : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className={`w-11 h-11 rounded-xl object-cover object-top shrink-0 border ${
                            isSelected ? 'border-brand-200' : 'border-white/30'
                          }`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-bold truncate ${
                                isSelected ? 'text-slate-900' : 'text-white'
                              }`}
                            >
                              {acc.name}
                            </p>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                                Selected
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs truncate ${
                              isSelected ? 'text-slate-500 font-medium' : 'text-blue-200'
                            }`}
                          >
                            {acc.role}
                          </p>
                          <p
                            className={`text-[11px] font-mono truncate mt-0.5 ${
                              isSelected ? 'text-brand-600' : 'text-cyan-200/90'
                            }`}
                          >
                            {acc.email}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-white/15 text-white/70'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Security Footer */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
              <span className="inline-flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-300" />
                <span>15-Min Sterilization Lock Active</span>
              </span>
              <span className="font-mono text-[11px] text-cyan-200">ISO-27001 · GDC Registered</span>
            </div>
          </div>

          {/* RIGHT PANEL: Clean White Architectural Login Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-8 xl:p-9 flex flex-col justify-between">
            <div>
              {/* Top Form Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Authorized Staff Sign-In</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Surgery Dashboard
                  </h2>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              {/* Mobile-Only Quick Specialist Pills */}
              <div className="lg:hidden mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Quick Fill Specialist Account:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedDemoId === acc.id
                          ? 'bg-brand-50/80 border-brand-500 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{acc.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{acc.email}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="clinical-email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Clinical Staff Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="clinical-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@zenithdental.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="clinical-password"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Security Passkey
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Default: Zenith2026!
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="clinical-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit CTA matching Dashboard & Public Site */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-md shadow-brand-600/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Verifying Clinical Session...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Surgery Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Info Card */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Protected by HttpOnly Session & Edge Middleware</span>
              </div>
              <Link
                href="/b/zenith-dental"
                className="font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap"
              >
                ← Patient Booking
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Bottom Bar */}
      <footer className="relative z-10 w-full py-2.5 px-4 text-center text-[11px] text-slate-400 border-t border-slate-200/60 bg-white/60 shrink-0">
        Zenith Dental Studio · 42 Harley Street, Marylebone, London, W1G 9PR · Clinical OS v2.4
      </footer>
    </div>
  );
}
