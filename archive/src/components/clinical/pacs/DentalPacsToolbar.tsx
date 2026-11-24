'use client';

import React from 'react';
import {
  Sun,
  Moon,
  Ruler,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Activity,
} from 'lucide-react';

interface DentalPacsToolbarProps {
  brightness: number;
  setBrightness: (val: number) => void;
  contrast: number;
  setContrast: (val: number) => void;
  isInverted: boolean;
  setIsInverted: (val: boolean) => void;
  caliperMode: boolean;
  setCaliperMode: (val: boolean) => void;
  caliperDistanceMm: number;
  showAiAnalysis: boolean;
  setShowAiAnalysis: (val: boolean) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onReset: () => void;
}

export function DentalPacsToolbar({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  isInverted,
  setIsInverted,
  caliperMode,
  setCaliperMode,
  caliperDistanceMm,
  showAiAnalysis,
  setShowAiAnalysis,
  zoom,
  setZoom,
  onReset,
}: DentalPacsToolbarProps) {
  return (
    <div className="px-4 py-2 bg-slate-900/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Sliders: Contrast & Brightness */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono text-slate-400">Bright:</span>
          <input
            type="range"
            min="50"
            max="160"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-16 h-1 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-300 w-7">{brightness}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono text-slate-400">Contrast:</span>
          <input
            type="range"
            min="80"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-16 h-1 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-300 w-7">{contrast}%</span>
        </div>
      </div>

      {/* Quick Action Tools */}
      <div className="flex items-center gap-2">
        {/* Negative Inversion */}
        <button
          type="button"
          onClick={() => setIsInverted(!isInverted)}
          title="Invert Bone Density / Film Negative"
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isInverted
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <Moon className="w-3 h-3" />
          <span>Negative Film</span>
        </button>

        {/* Caliper Mode */}
        <button
          type="button"
          onClick={() => setCaliperMode(!caliperMode)}
          title="Toggle Digital Measurement Calipers"
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            caliperMode
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
        >
          <Ruler className="w-3 h-3" />
          <span>Caliper: {caliperDistanceMm}mm</span>
        </button>

        {/* AI Enamel & Bone Density Audit */}
        <button
          type="button"
          onClick={() => setShowAiAnalysis(!showAiAnalysis)}
          title="Toggle AI Bone Density & Apex Scanner"
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            showAiAnalysis
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>AI Pathology</span>
        </button>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.2).toFixed(1))))}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-mono px-1 text-cyan-300 font-bold">{zoom}x</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(1))))}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset All Image Settings"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
