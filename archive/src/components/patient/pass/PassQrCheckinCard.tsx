'use client';

import React from 'react';
import { Smartphone } from 'lucide-react';
import { playHapticTick } from '@/lib/soundscapes';

interface PassQrCheckinCardProps {
  onOpenWallet: () => void;
}

export function PassQrCheckinCard({ onOpenWallet }: PassQrCheckinCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
      {/* High-Tech SVG QR Code Pattern with Laser Scan Beam */}
      <div className="relative p-3 rounded-2xl bg-white shadow-xl overflow-hidden group">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rounded"
        >
          {/* Top-left position pattern */}
          <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
          <rect x="11" y="11" width="16" height="16" rx="2" fill="white" />
          <rect x="15" y="15" width="8" height="8" rx="1" fill="#2563eb" />

          {/* Top-right position pattern */}
          <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
          <rect x="73" y="11" width="16" height="16" rx="2" fill="white" />
          <rect x="77" y="15" width="8" height="8" rx="1" fill="#2563eb" />

          {/* Bottom-left position pattern */}
          <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
          <rect x="11" y="73" width="16" height="16" rx="2" fill="white" />
          <rect x="15" y="77" width="8" height="8" rx="1" fill="#2563eb" />

          {/* Data Dots & Matrix */}
          <rect x="40" y="8" width="6" height="6" rx="1" fill="#0f172a" />
          <rect x="50" y="12" width="6" height="6" rx="1" fill="#2563eb" />
          <rect x="44" y="22" width="8" height="6" rx="1" fill="#0f172a" />
          <rect x="56" y="24" width="6" height="6" rx="1" fill="#0f172a" />

          <rect x="10" y="42" width="6" height="6" rx="1" fill="#0f172a" />
          <rect x="22" y="46" width="6" height="6" rx="1" fill="#2563eb" />
          <rect x="42" y="42" width="16" height="16" rx="3" fill="#2563eb" />
          <rect x="66" y="40" width="8" height="6" rx="1" fill="#0f172a" />
          <rect x="80" y="46" width="6" height="6" rx="1" fill="#0f172a" />

          <rect x="40" y="68" width="6" height="6" rx="1" fill="#0f172a" />
          <rect x="52" y="72" width="6" height="6" rx="1" fill="#2563eb" />
          <rect x="68" y="66" width="8" height="8" rx="1" fill="#0f172a" />
          <rect x="82" y="72" width="8" height="6" rx="1" fill="#0f172a" />
          <rect x="46" y="84" width="8" height="6" rx="1" fill="#0f172a" />
          <rect x="74" y="84" width="10" height="6" rx="1" fill="#2563eb" />
        </svg>

        {/* Animated Cybernetic Scan Indicator */}
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse pointer-events-none top-1/2 -translate-y-1/2" />
      </div>

      <div>
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
          Express Reception Pass
        </span>
        <span className="text-[11px] font-bold text-white">
          Scan at 14 Harley St. Concierge
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          playHapticTick();
          onOpenWallet();
        }}
        className="mt-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
      >
        <Smartphone className="w-3.5 h-3.5 text-brand-400" />
        <span>Add to Wallet ( / GPay)</span>
      </button>
    </div>
  );
}
