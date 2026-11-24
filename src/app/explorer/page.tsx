'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import {
  Database,
  Terminal,
  Layers,
  RefreshCw,
  Search,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Calendar,
  Users,
  Briefcase,
  Clock,
  Sparkles,
  Server,
  Activity,
} from 'lucide-react';

interface TableMeta {
  key: string;
  label: string;
  icon: any;
  description: string;
}

const TABLE_CONFIGS: TableMeta[] = [
  { key: 'bookings', label: 'Bookings (Appointments)', icon: Calendar, description: 'Clinical patient reservations, status lifecycle, deposit payments, and doctor assignments' },
  { key: 'staff', label: 'Staff & Specialists', icon: Users, description: 'Medical doctors, credentials, bios, avatars, and clinical specializations' },
  { key: 'services', label: 'Services & Treatments', icon: Sparkles, description: 'Treatment catalog with duration, prices in GBP (£), deposit requirements, and sterilization buffers' },
  { key: 'users', label: 'Clinical Users & Auth', icon: ShieldCheck, description: 'Staff logins, owners, email credentials, and bcrypt password security hashes' },
  { key: 'staffSchedules', label: 'Doctor Working Schedules', icon: Clock, description: 'Day-of-week operating hours, lunch break windows, and availability configurations' },
  { key: 'tenants', label: 'Tenants (Clinics)', icon: Briefcase, description: 'Multi-tenant clinic entity: Zenith Dental Studio branding, timezone, currency, and defaults' },
  { key: 'recallReminders', label: '6-Month Recalls', icon: Activity, description: 'Automated patient hygiene recall scheduling queue' },
  { key: 'webhookEvents', label: 'Stripe Webhook Events', icon: Server, description: 'Idempotency ledger for incoming payment webhook payloads' },
];

interface ApiEndpointConfig {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  category: 'Availability' | 'Bookings' | 'Authentication' | 'Notifications' | 'Webhooks';
  defaultParams?: Record<string, string>;
  defaultBody?: any;
}

const API_ENDPOINTS: ApiEndpointConfig[] = [
  {
    id: 'get-availability',
    name: 'Get Doctor Time Slots',
    method: 'GET',
    path: '/api/v1/availability',
    category: 'Availability',
    description: 'Calculates real-time available time slots based on working hours, lunch breaks, 15-min buffers, and existing bookings.',
    defaultParams: {
      staffId: 'doc-leyla',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      duration: '45',
    },
  },
  {
    id: 'get-bookings',
    name: 'List All Bookings',
    method: 'GET',
    path: '/api/v1/bookings',
    category: 'Bookings',
    description: 'Retrieves all persisted bookings joined with staff profiles and service details from PostgreSQL.',
    defaultParams: {},
  },
  {
    id: 'post-booking',
    name: 'Create New Reservation',
    method: 'POST',
    path: '/api/v1/bookings',
    category: 'Bookings',
    description: 'Creates a patient appointment with row-level concurrency lock. Rejects collisions with 409 Conflict.',
    defaultBody: {
      tenantSlug: 'zenith-dental',
      staffId: 'doc-leyla',
      serviceId: 'srv-checkup',
      customerName: 'Marcus Aurelius',
      customerEmail: 'marcus@example.com',
      customerPhone: '+44 7700 900555',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '15:00',
      paymentMethod: 'card',
      depositStatus: 'deposit_paid',
      notes: 'Initial consultation and 3D digital scan',
    },
  },
  {
    id: 'patch-booking',
    name: 'Update Booking Status & Notes',
    method: 'PATCH',
    path: '/api/v1/bookings',
    category: 'Bookings',
    description: 'Updates clinical lifecycle status (confirmed, in_surgery, completed, cancelled) and internal doctor notes.',
    defaultBody: {
      id: 'ZD-829104',
      status: 'in_surgery',
      internalNotes: 'Patient seated in Surgery Room 1. Ultrasonic scaling complete.',
    },
  },
  {
    id: 'post-login',
    name: 'Staff Clinical Login',
    method: 'POST',
    path: '/api/v1/auth/login',
    category: 'Authentication',
    description: 'Validates staff email and bcrypt password hash against PostgreSQL users table, issuing an HMAC-SHA256 session cookie.',
    defaultBody: {
      email: 'admin@zenithdental.com',
      password: 'Zenith2026!',
    },
  },
  {
    id: 'get-me',
    name: 'Get Current Session User',
    method: 'GET',
    path: '/api/v1/auth/me',
    category: 'Authentication',
    description: 'Reads the HttpOnly session cookie and verifies its cryptographic signature on Edge runtime.',
    defaultParams: {},
  },
  {
    id: 'post-logout',
    name: 'Staff Sign-Out',
    method: 'POST',
    path: '/api/v1/auth/logout',
    category: 'Authentication',
    description: 'Clears the clinical session cookie.',
    defaultBody: {},
  },
  {
    id: 'get-email-preview',
    name: 'Get Email JSON & HTML Template',
    method: 'GET',
    path: '/api/v1/system/email-preview',
    category: 'Notifications',
    description: 'Generates the high-fidelity responsive HTML confirmation email with patient details and .ics calendar metadata.',
    defaultParams: {
      format: 'json',
      patient: 'Sarah Jenkins',
      service: 'Comprehensive 3D Exam & Prophylaxis',
      doctor: 'Dr. Leyla Mammadova',
      time: '14:45',
      code: 'ZD-749201',
    },
  },
  {
    id: 'post-send-email',
    name: 'Send Patient Confirmation Email',
    method: 'POST',
    path: '/api/v1/system/email-preview',
    category: 'Notifications',
    description: 'Dispatches or simulates the booking confirmation email with attached .ics iCalendar file. Uses real Gmail SMTP when credentials are provided.',
    defaultBody: {
      to: 'sarah.jenkins@example.com',
      patientName: 'Sarah Jenkins',
      bookingCode: 'ZD-749201',
    },
  },
];

export default function VisualExplorerPage() {
  const [activeTab, setActiveTab] = useState<'database' | 'apis' | 'erd'>('database');
  const [selectedTable, setSelectedTable] = useState<string>('bookings');
  const [dbData, setDbData] = useState<any>(null);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(true);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [viewFormat, setViewFormat] = useState<'table' | 'json'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // API Playground State
  const [selectedApiId, setSelectedApiId] = useState<string>('get-availability');
  const [apiParams, setApiParams] = useState<Record<string, string>>({});
  const [apiBody, setApiBody] = useState<string>('');
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    data: any;
  } | null>(null);

  // Load Database Data
  const fetchDbData = async () => {
    setIsLoadingDb(true);
    try {
      const res = await fetch('/api/v1/system/db');
      if (res.ok) {
        const json = await res.json();
        setDbData(json);
      }
    } catch (err) {
      console.error('Failed to load DB explorer data:', err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  // Sync API playground inputs on endpoint change
  const currentEndpoint = API_ENDPOINTS.find((e) => e.id === selectedApiId) || API_ENDPOINTS[0];

  useEffect(() => {
    const endpoint = API_ENDPOINTS.find((e) => e.id === selectedApiId) || API_ENDPOINTS[0];
    if (endpoint.defaultParams) {
      setApiParams(endpoint.defaultParams);
    } else {
      setApiParams({});
    }
    if (endpoint.defaultBody) {
      setApiBody(JSON.stringify(endpoint.defaultBody, null, 2));
    } else {
      setApiBody('');
    }
    setApiResponse(null);
  }, [selectedApiId]);

  const handleExecuteApi = async () => {
    setIsCallingApi(true);
    setApiResponse(null);
    const startTime = performance.now();

    try {
      let url = currentEndpoint.path;
      if (Object.keys(apiParams).length > 0) {
        const q = new URLSearchParams(apiParams).toString();
        url += `?${q}`;
      }

      const options: RequestInit = {
        method: currentEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (currentEndpoint.method !== 'GET' && apiBody) {
        options.body = apiBody;
      }

      const res = await fetch(url, options);
      const durationMs = Math.round(performance.now() - startTime);

      let data: any;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      setApiResponse({
        status: res.status,
        statusText: res.statusText,
        durationMs,
        data,
      });

      // Refresh DB data in background if a mutation occurred
      if (['POST', 'PATCH', 'DELETE'].includes(currentEndpoint.method)) {
        fetchDbData();
      }
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      setApiResponse({
        status: 0,
        statusText: 'Client Error',
        durationMs,
        data: { error: err.message || 'Request failed' },
      });
    } finally {
      setIsCallingApi(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentTableRows: any[] = dbData?.tables?.[selectedTable] || [];

  const filteredRows = currentTableRows.filter((row) => {
    if (!tableSearch.trim()) return true;
    return JSON.stringify(row).toLowerCase().includes(tableSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs h-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0"
              title="Return to Surgery Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-2xs p-1 shrink-0">
                <ZenithLogo size={26} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate">
                    Zenith Clinical Studio
                  </h1>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 shrink-0">
                    Database & API Explorer
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                  Engine: PostgreSQL / PGlite (WASM) · Drizzle ORM
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a
              href="/api/v1/system/email-preview"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100/80 border border-brand-200 transition-colors"
              title="View live patient confirmation email in browser"
            >
              <span>Preview Email HTML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Surgery </span>Dashboard
            </Link>
            <Link
              href="/b/zenith-dental"
              target="_blank"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-xs transition-transform active:scale-95 whitespace-nowrap"
            >
              <span><span className="hidden sm:inline">Public </span>Clinic</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 bg-slate-200/60 p-1 rounded-2xl max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'database'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>1. Live Database Tables</span>
              {dbData?.counts && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-brand-50 text-brand-700 border border-brand-200 font-mono">
                  {Number((Object.values(dbData.counts) as any[]).reduce((a, b) => a + b, 0))} Rows
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('apis')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'apis'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>2. Interactive API Playground</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                {API_ENDPOINTS.length} Routes
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('erd')}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'erd'
                  ? 'bg-white text-brand-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>3. ERD & Architecture Schema</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDbData}
              disabled={isLoadingDb}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDb ? 'animate-spin text-brand-600' : ''}`} />
              <span>Refresh State</span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: LIVE DATABASE TABLES EXPLORER                                */}
        {/* =================================================================== */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Table Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {TABLE_CONFIGS.map((t) => {
                const count = dbData?.counts?.[t.key] ?? 0;
                const isSelected = selectedTable === t.key;
                const Icon = t.icon;

                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setSelectedTable(t.key);
                      setTableSearch('');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                        : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-600'}`} />
                      <span
                        className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold truncate">{t.key}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Table Toolbar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight font-mono">
                      table: &quot;{selectedTable}&quot;
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {filteredRows.length} Records Shown
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {TABLE_CONFIGS.find((c) => c.key === selectedTable)?.description}
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[140px] sm:flex-initial">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search records..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all w-full sm:w-60"
                    />
                  </div>

                  {/* View Format Toggle */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewFormat('table')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        viewFormat === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewFormat('json')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        viewFormat === 'json' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      JSON
                    </button>
                  </div>

                  {/* Copy JSON Button */}
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(JSON.stringify(currentTableRows, null, 2), selectedTable)
                    }
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 transition-all"
                    title="Copy full table JSON"
                  >
                    {copiedId === selectedTable ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* VIEW: JSON FORMAT */}
              {viewFormat === 'json' ? (
                <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-[550px] border border-slate-800">
                  <pre>{JSON.stringify(filteredRows, null, 2)}</pre>
                </div>
              ) : (
                /* VIEW: INTERACTIVE TABLE FORMAT */
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  {filteredRows.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No records found in this table matching your search.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                          {Object.keys(filteredRows[0] || {}).map((col) => (
                            <th key={col} className="p-3 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {filteredRows.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-brand-50/40 transition-colors">
                            {Object.entries(row).map(([col, val]: any, colIdx) => {
                              // Custom styling per data type
                              let renderedVal: React.ReactNode = String(val);

                              if (val === null || val === undefined) {
                                renderedVal = <span className="text-slate-300 italic">null</span>;
                              } else if (typeof val === 'boolean') {
                                renderedVal = (
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                                      val
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                                  >
                                    {String(val)}
                                  </span>
                                );
                              } else if (col === 'status') {
                                renderedVal = (
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                      val === 'confirmed'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : val === 'in_surgery'
                                        ? 'bg-blue-100 text-blue-800'
                                        : val === 'completed'
                                        ? 'bg-slate-100 text-slate-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}
                                  >
                                    {val}
                                  </span>
                                );
                              } else if (col.includes('price') || col.includes('deposit') || col.includes('Amount')) {
                                renderedVal = (
                                  <span className="font-mono font-bold text-slate-900">
                                    {typeof val === 'number' && val > 1000 ? `$${val / 100}` : `$${val}`}
                                  </span>
                                );
                              } else if (col.includes('Time') || col.includes('At') || col.includes('Date')) {
                                renderedVal = (
                                  <span className="font-mono text-slate-600">
                                    {String(val).replace('T', ' ').substring(0, 19)}
                                  </span>
                                );
                              } else if (col.includes('id') || col.includes('Id')) {
                                renderedVal = (
                                  <span
                                    className="font-mono text-slate-500 text-[11px] truncate block max-w-[150px]"
                                    title={String(val)}
                                  >
                                    {String(val)}
                                  </span>
                                );
                              } else if (typeof val === 'object') {
                                renderedVal = (
                                  <span className="font-mono text-[10px] text-slate-500">
                                    {JSON.stringify(val)}
                                  </span>
                                );
                              }

                              return (
                                <td key={colIdx} className="p-3 text-slate-700">
                                  {renderedVal}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: INTERACTIVE API PLAYGROUND (Swagger-Style Live Tester)      */}
        {/* =================================================================== */}
        {activeTab === 'apis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Endpoint Selector Menu */}
            <div className="lg:col-span-4 min-w-0 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="px-2 pb-2 border-b border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select REST Endpoint
                </p>
              </div>

              <div className="space-y-1.5">
                {API_ENDPOINTS.map((endpoint) => {
                  const isSelected = selectedApiId === endpoint.id;
                  const methodColor =
                    endpoint.method === 'GET'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : endpoint.method === 'POST'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : endpoint.method === 'PATCH'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <button
                      key={endpoint.id}
                      type="button"
                      onClick={() => setSelectedApiId(endpoint.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-brand-50/70 border-brand-500 shadow-xs'
                          : 'bg-white border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black border ${methodColor}`}
                        >
                          {endpoint.method}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {endpoint.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {endpoint.name}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 truncate">
                        {endpoint.path}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Request Builder & Live Response Output */}
            <div className="lg:col-span-8 min-w-0 space-y-6">
              {/* Endpoint Header Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black border shrink-0 ${
                          currentEndpoint.method === 'GET'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : currentEndpoint.method === 'POST'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {currentEndpoint.method}
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900 break-all sm:break-normal">
                        {currentEndpoint.path}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentEndpoint.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteApi}
                    disabled={isCallingApi}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-md shadow-brand-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                  >
                    {isCallingApi ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Execute Live Request</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Query Parameters Section (if GET or has params) */}
                {Object.keys(apiParams).length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Query Parameters:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(apiParams).map(([paramKey, paramVal]) => (
                        <div key={paramKey} className="space-y-1">
                          <label className="text-[11px] font-mono text-slate-500 block">
                            {paramKey}
                          </label>
                          <input
                            type="text"
                            value={paramVal}
                            onChange={(e) =>
                              setApiParams((prev) => ({ ...prev, [paramKey]: e.target.value }))
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Body Editor (if POST / PATCH) */}
                {currentEndpoint.method !== 'GET' && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700">Request Body (JSON):</p>
                      <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                    </div>
                    <textarea
                      rows={7}
                      value={apiBody}
                      onChange={(e) => setApiBody(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}
              </div>

              {/* Response Viewer */}
              {apiResponse && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Live Response:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          apiResponse.status >= 200 && apiResponse.status < 300
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apiResponse.status === 409
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {apiResponse.status} {apiResponse.statusText}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {apiResponse.durationMs}ms
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(apiResponse.data, null, 2), 'api-response')
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      {copiedId === 'api-response' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-[400px] border border-slate-800">
                    <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: ERD & ARCHITECTURE SCHEMA MAP                                */}
        {/* =================================================================== */}
        {activeTab === 'erd' && (
          <div className="space-y-6">
            {/* Visual Node Diagram Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Relational Architecture Diagram (PostgreSQL Entity Relations)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  How multi-tenant isolation, clinical specialists, time scheduling, and bookings are joined.
                </p>
              </div>

              {/* Visual Flow Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* 1. Core Tenant & Auth */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span>tenants</span>
                  </div>
                  <ul className="text-xs font-mono text-slate-600 space-y-1">
                    <li className="font-bold text-slate-900">PK id (uuid)</li>
                    <li>slug (text, unique)</li>
                    <li>name (text)</li>
                    <li>brand_color (text)</li>
                    <li>timezone (text)</li>
                  </ul>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400">
                    Parent entity of all clinic data.
                  </div>
                </div>

                {/* 2. Staff & Schedules */}
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <Users className="w-4 h-4" />
                    <span>staff & schedules</span>
                  </div>
                  <ul className="text-xs font-mono text-slate-600 space-y-1">
                    <li className="font-bold text-slate-900">PK id (uuid)</li>
                    <li>FK tenant_id $\rightarrow$ tenants.id</li>
                    <li>title (text)</li>
                    <li>specializations (jsonb)</li>
                    <li>day_of_week, start_time, end_time</li>
                  </ul>
                  <div className="pt-2 border-t border-blue-200 text-[11px] text-blue-600">
                    Defines surgeon shifts & lunch breaks.
                  </div>
                </div>

                {/* 3. Bookings Engine */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>bookings</span>
                  </div>
                  <ul className="text-xs font-mono text-slate-600 space-y-1">
                    <li className="font-bold text-slate-900">PK id (uuid)</li>
                    <li>booking_code (text)</li>
                    <li>FK staff_id $\rightarrow$ staff.id</li>
                    <li>FK service_id $\rightarrow$ services.id</li>
                    <li>start_time, end_time (timestamptz)</li>
                    <li>status, payment_status, deposit_amount</li>
                    <li>internal_notes (text)</li>
                  </ul>
                  <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-600">
                    Protected by row-level lock concurrency.
                  </div>
                </div>
              </div>

              {/* Concurrency Rule Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Strict Mathematical Conflict Guard & 15-Min Sterilization Buffer</p>
                  <p className="text-amber-800">
                    Every new appointment reserves the slot + 15 minutes of clinical room sterilization. Overlapping requests on the same doctor are atomically rejected at the PostgreSQL transaction boundary with HTTP 409 (<code className="font-mono bg-white px-1 py-0.5 rounded">SLOT_ALREADY_BOOKED</code>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
