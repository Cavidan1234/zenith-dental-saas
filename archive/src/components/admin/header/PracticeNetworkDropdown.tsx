'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
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

interface PracticeNetworkDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClinicSettings;
  onUpdateSettings: (updater: (prev: ClinicSettings) => ClinicSettings) => void;
  customTenants: Record<string, any>;
  onSetNotification: (msg: string) => void;
}

export function PracticeNetworkDropdown({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  customTenants,
  onSetNotification,
}: PracticeNetworkDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
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
            onClose();
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
              onClose();
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
  );
}
