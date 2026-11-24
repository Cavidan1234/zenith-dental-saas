'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  RefreshCw,
  Sun,
  Moon,
  Radio,
  Volume2,
  VolumeX,
  Settings,
  ArrowUpRight,
} from 'lucide-react';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import { playHapticTick } from '@/lib/soundscapes';

interface ClinicSettings {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  bufferMinutes: number;
  depositAmount: number;
  cancellationWindowHours: number;
  recallIntervalDays: number;
}

interface DashboardHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  settings: ClinicSettings;
  onUpdateSettings: (updater: (prev: ClinicSettings) => ClinicSettings) => void;
  customTenants: Record<string, any>;
  isSyncing: boolean;
  onManualSync: () => void;
  soundActive: boolean;
  onToggleSound: () => void;
  onOpenComms: () => void;
  onOpenSettings: () => void;
  onSetNotification: (msg: string) => void;
}

export function DashboardHeader({
  isDarkMode,
  onToggleTheme,
  settings,
  onUpdateSettings,
  customTenants,
  isSyncing,
  onManualSync,
  soundActive,
  onToggleSound,
  onOpenComms,
  onOpenSettings,
  onSetNotification,
}: DashboardHeaderProps) {
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  return (
    <header
      className={`border-b ${
        isDarkMode
          ? 'border-white/10 bg-slate-900/95 text-white'
          : 'border-slate-200/80 bg-white/90 text-slate-900'
      } backdrop-blur-md sticky top-0 z-30 shadow-xs transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <Link
            href="/b/zenith-dental"
            className={`p-2 sm:p-2.5 rounded-xl ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-slate-200'
                : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
            } transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs shrink-0`}
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <Link
              href="/b/zenith-dental"
              className="shrink-0 flex items-center group transition-transform duration-200 hover:scale-105"
              title="Zenith Dental Studio"
            >
              <ZenithLogo size={36} />
            </Link>
            <div className="min-w-0 relative">
              <button
                type="button"
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center gap-1.5 text-left group cursor-pointer"
                title="Switch Active Dental Practice"
              >
                <h1
                  className={`font-extrabold text-sm sm:text-base ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  } tracking-tight truncate group-hover:text-brand-600 transition-colors`}
                >
                  {settings.clinicName}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-colors shrink-0" />
              </button>
              <p
                className={`text-[11px] sm:text-xs ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                } font-medium truncate`}
              >
                {settings.address.split(',')[0]} · Practice Management
              </p>

              {/* Tenant Switcher Popover Dropdown */}
              {tenantDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setTenantDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50 text-slate-900 animate-in fade-in duration-150">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 px-3 py-1.5 block tracking-wider">
                      Practice Network
                    </span>

                    {/* Default Zenith Clinic */}
                    <button
                      type="button"
                      onClick={() => {
                        playHapticTick();
                        onUpdateSettings(() => ({
                          clinicName: 'Zenith Dental & Esthetics',
                          address: '14 Harley Street, Marylebone, London W1G 9PR',
                          phone: '+44 20 7946 0991',
                          email: 'concierge@zenithdental.co.uk',
                          bufferMinutes: 15,
                          depositAmount: 50,
                          cancellationWindowHours: 24,
                          recallIntervalDays: 180,
                        }));
                        setTenantDropdownOpen(false);
                        onSetNotification('Switched practice to Zenith Dental (Harley St.)');
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        settings.clinicName.includes('Zenith')
                          ? 'bg-brand-50 border border-brand-200 text-brand-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">Zenith Dental &amp; Esthetics</span>
                        <span className="text-[10px] text-slate-500">14 Harley St., London W1G</span>
                      </div>
                      {settings.clinicName.includes('Zenith') && (
                        <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </button>

                    {/* Custom Registered Clinics */}
                    {Object.values(customTenants).map((t: any) => (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => {
                          playHapticTick();
                          onUpdateSettings((prev) => ({
                            ...prev,
                            clinicName: t.clinicName,
                            address: `${t.address}, ${t.city}`,
                            phone: t.phone,
                            depositAmount: t.depositAmount || 50,
                            bufferMinutes: t.bufferMinutes || 15,
                          }));
                          setTenantDropdownOpen(false);
                          onSetNotification(`Switched practice to ${t.clinicName}`);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          settings.clinicName === t.clinicName
                            ? 'bg-brand-50 border border-brand-200 text-brand-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{t.clinicName}</span>
                          <span className="text-[10px] text-slate-500">
                            {t.address}, {t.city}
                          </span>
                        </div>
                        {settings.clinicName === t.clinicName && (
                          <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </button>
                    ))}

                    {/* Onboard New Practice Link */}
                    <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                      <Link
                        href="/onboarding"
                        className="w-full p-2.5 rounded-xl text-xs font-bold text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50/80 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-600" />
                        <span>+ Onboard New Dental Practice</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sync Button */}
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className={`inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold ${
              isDarkMode
                ? 'text-slate-200 bg-white/10 hover:bg-white/15 border-white/10'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            } border transition-all active:scale-95 cursor-pointer`}
            title="Sync appointments & cache"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} ${
                isSyncing ? 'animate-spin text-brand-400' : ''
              }`}
            />
            <span className="hidden md:inline">Sync Radar</span>
          </button>

          {/* Dark / Light Studio Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold ${
              isDarkMode
                ? 'text-amber-400 bg-white/10 hover:bg-white/15 border-white/10'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            } border transition-all active:scale-95 cursor-pointer`}
            title={isDarkMode ? 'Switch to Clinical Daylight Mode' : 'Switch to Studio Obsidian Night Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span className="hidden lg:inline">{isDarkMode ? 'Daylight' : 'Night'}</span>
          </button>

          {/* Outbound Comms Radar Button */}
          <button
            onClick={onOpenComms}
            className={`inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold ${
              isDarkMode
                ? 'text-slate-200 bg-white/10 hover:bg-white/15 border-white/10'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            } border transition-all active:scale-95 cursor-pointer`}
            title="Outbound Comms, Twilio SMS & Telephony Audit"
          >
            <Radio className={`w-3.5 h-3.5 ${isDarkMode ? 'text-cyan-400' : 'text-brand-600'}`} />
            <span className="hidden xl:inline">Comms</span>
          </button>

          {/* Sensory Soundscape Toggle */}
          <button
            onClick={onToggleSound}
            className={`inline-flex items-center p-2 rounded-xl text-xs font-semibold ${
              soundActive
                ? isDarkMode
                  ? 'text-emerald-400 bg-white/10 border-white/10'
                  : 'text-emerald-600 bg-emerald-50 border-emerald-200'
                : isDarkMode
                ? 'text-slate-500 bg-white/5 border-white/5'
                : 'text-slate-400 bg-slate-100 border-slate-200'
            } border transition-all active:scale-95 cursor-pointer`}
            title={soundActive ? 'Mute Sensory Soundscapes' : 'Enable Sensory Audio Chimes'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold ${
              isDarkMode
                ? 'text-slate-200 bg-white/10 hover:bg-white/15 border-white/10'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            } border transition-all active:scale-95 cursor-pointer`}
            title="Practice Configuration & Protocols"
          >
            <Settings className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Public Page Link */}
          <Link
            href="/b/zenith-dental"
            target="_blank"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <span className="hidden xs:inline">Public Site</span>
            <span className="xs:hidden">Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
