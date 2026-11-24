'use client';

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  Check,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { ZenithLogo } from '@/components/shared/ZenithLogo';
import { playSuccessPing, playHapticTick, playLuxuryChime } from '@/lib/soundscapes';

interface DigitalWalletPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  bookingRef: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
}

export function DigitalWalletPassModal({
  isOpen,
  onClose,
  patientName,
  bookingRef,
  service,
  doctor,
  date,
  time,
}: DigitalWalletPassModalProps) {
  const [walletType, setWalletType] = useState<'apple' | 'google'>('apple');
  const [isNfcSimulated, setIsNfcSimulated] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleSimulateNfc = () => {
    playHapticTick();
    setIsNfcSimulated(true);
    setTimeout(() => {
      playSuccessPing();
      setIsNfcSimulated(false);
    }, 2200);
  };

  const handleSaveToDevice = () => {
    playLuxuryChime();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Digital Surgery Pass</h3>
              <p className="text-[11px] text-slate-400">Harley Street Express Concierge Wallet</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet Format Switcher */}
        <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              playHapticTick();
              setWalletType('apple');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              walletType === 'apple'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
             Apple Wallet (.pkpass)
          </button>
          <button
            type="button"
            onClick={() => {
              playHapticTick();
              setWalletType('google');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              walletType === 'google'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Wallet Pass
          </button>
        </div>

        {/* LUXURY WALLET PASS CARD */}
        <div
          className={`relative rounded-3xl p-5 overflow-hidden transition-all duration-300 border shadow-2xl ${
            walletType === 'apple'
              ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-black border-white/20 text-white'
              : 'bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 border-brand-500/30 text-white'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Pass Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ZenithLogo className="w-6 h-6 text-brand-400" />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-300 block">
                  Zenith Dental
                </span>
                <span className="text-xs font-black tracking-tight">Surgery Reception Pass</span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
              {bookingRef}
            </span>
          </div>

          {/* Pass Main Info */}
          <div className="py-4 space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Patient</span>
              <span className="text-base font-extrabold text-white tracking-tight">{patientName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Procedure</span>
                <span className="text-xs font-bold text-brand-200 truncate block">{service}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Specialist</span>
                <span className="text-xs font-bold text-slate-200 truncate block">{doctor}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Date &amp; Slot</span>
                <span className="text-xs font-bold text-white font-mono">{date} @ {time}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Location</span>
                <span className="text-xs font-semibold text-slate-300 truncate block">14 Harley St, W1G</span>
              </div>
            </div>
          </div>

          {/* Pass Barcode / Aztec Strip */}
          <div className="pt-3 border-t border-white/10 flex flex-col items-center justify-center space-y-2">
            <div className="p-2 bg-white rounded-xl shadow-inner">
              {/* High-Contrast 2D QR / Aztec Scanner */}
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" className="rounded">
                <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
                <rect x="15" y="15" width="8" height="8" rx="1" fill="#2563eb" />
                <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
                <rect x="77" y="15" width="8" height="8" rx="1" fill="#2563eb" />
                <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
                <rect x="15" y="77" width="8" height="8" rx="1" fill="#2563eb" />
                <rect x="40" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                <rect x="50" y="12" width="6" height="6" rx="1" fill="#2563eb" />
                <rect x="42" y="42" width="16" height="16" rx="3" fill="#2563eb" />
                <rect x="68" y="66" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="46" y="84" width="8" height="8" rx="1" fill="#0f172a" />
              </svg>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400">
              SCAN AT SURGERY KIOSK
            </span>
          </div>
        </div>

        {/* NFC Tap Simulation & Save Actions */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleSimulateNfc}
            className={`w-full py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
              isNfcSimulated
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/30'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
          >
            <Radio className={`w-4 h-4 ${isNfcSimulated ? 'animate-ping text-emerald-400' : 'text-brand-400'}`} />
            <span>
              {isNfcSimulated
                ? '✓ Contactless NFC Handshake Verified!'
                : 'Simulate Reception NFC Tap'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSaveToDevice}
            className="w-full py-2.5 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Pass Saved to Wallet Device!</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span>
                  {walletType === 'apple' ? 'Add to Apple Wallet' : 'Save to Google Wallet'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
