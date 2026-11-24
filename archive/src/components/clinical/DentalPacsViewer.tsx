'use client';

import React, { useState, useRef } from 'react';
import {
  Scan,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Ruler,
  Maximize2,
  Crosshair,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface DentalPacsViewerProps {
  patientName: string;
  patientId: string;
  hasSensitivity?: boolean;
}

export function DentalPacsViewer({
  patientName,
  patientId,
  hasSensitivity = true,
}: DentalPacsViewerProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(120);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'panorex' | 'bitewing' | 'cbct'>('panorex');
  const [caliperMode, setCaliperMode] = useState<boolean>(false);
  const [caliperPoints, setCaliperPoints] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>({
    x1: 280,
    y1: 95,
    x2: 280,
    y2: 175,
  });
  const [showAiAnalysis, setShowAiAnalysis] = useState<boolean>(true);

  // Reset adjustments
  const handleReset = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(120);
    setIsInverted(false);
  };

  // Measured length in mm (scale approx 10px = 2.6mm)
  const caliperDistanceMm = caliperPoints
    ? Math.round(Math.hypot(caliperPoints.x2 - caliperPoints.x1, caliperPoints.y2 - caliperPoints.y1) * 0.26 * 10) / 10
    : 20.8;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 text-white overflow-hidden shadow-lg select-none">
      {/* PACS Radiography Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Scan className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Digital OPG Panorex &amp; CBCT PACS
              </span>
              <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                DICOM 3.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Scan ID: PX-{patientId} • Patient: {patientName} • kVp: 74 • mA: 12 • 0.08mm Voxel
            </p>
          </div>
        </div>

        {/* Layer Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveLayer('panorex')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'panorex'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Panoramic
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('bitewing')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'bitewing'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bitewing
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('cbct')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'cbct'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D CBCT Arch
          </button>
        </div>
      </div>

      {/* PACS Radiograph Toolbar */}
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
            onClick={handleReset}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset All Image Settings"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Radiograph Canvas Area */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden flex items-center justify-center bg-slate-950 p-2">
        {/* Dynamic Scan Viewport */}
        <div
          style={{
            transform: `scale(${zoom})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%) ${
              isInverted ? 'invert(1) hue-rotate(180deg)' : ''
            }`,
            transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
          }}
          className="relative w-full h-full max-w-xl max-h-64 flex items-center justify-center"
        >
          {/* Panoramic Dental Arch SVG Simulation */}
          <svg
            viewBox="0 0 600 240"
            className="w-full h-full drop-shadow-2xl overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Anatomical Radiopacity Gradient */}
            <rect width="600" height="240" rx="16" fill="#030712" />

            {/* Mandibular & Maxillary Trabecular Bone Cloud (Simulated radiopacity) */}
            <path
              d="M 30,120 Q 300,60 570,120 Q 300,180 30,120"
              fill="url(#boneGradient)"
              opacity="0.35"
            />
            <path
              d="M 60,60 Q 300,10 540,60 L 520,110 Q 300,75 80,110 Z"
              fill="url(#alveolarGradient)"
              opacity="0.4"
            />
            <path
              d="M 60,180 Q 300,230 540,180 L 520,130 Q 300,165 80,130 Z"
              fill="url(#alveolarGradient)"
              opacity="0.4"
            />

            {/* Upper Teeth Arches (Maxilla 1-16) */}
            {Array.from({ length: 16 }).map((_, i) => {
              const cx = 55 + i * 32.5;
              const isCenter = i >= 6 && i <= 9;
              const toothHeight = isCenter ? 46 : 38;
              const rootLength = isCenter ? 32 : 44;
              const isWatchTooth = i === 13; // Tooth #14 (index 13)

              return (
                <g key={`max-${i}`} className="transition-opacity">
                  {/* Root structure into alveolar bone */}
                  <path
                    d={`M ${cx - 6},80 Q ${cx},${80 - rootLength} ${cx + 6},80 Z`}
                    fill="#475569"
                    opacity="0.85"
                  />
                  {/* Pulp Canal */}
                  <line
                    x1={cx}
                    y1={80}
                    x2={cx}
                    y2={80 - rootLength + 8}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Enamel Crown */}
                  <rect
                    x={cx - 10}
                    y={80}
                    width={20}
                    height={toothHeight}
                    rx={isCenter ? 3 : 5}
                    fill={isWatchTooth ? '#cbd5e1' : '#94a3b8'}
                    stroke="#e2e8f0"
                    strokeWidth="1.2"
                    opacity="0.95"
                  />
                  {/* Dentin outline */}
                  <rect
                    x={cx - 6}
                    y={84}
                    width={12}
                    height={toothHeight - 8}
                    rx="3"
                    fill="#334155"
                    opacity="0.6"
                  />
                  {/* Tooth number marker */}
                  <text
                    x={cx}
                    y="72"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}

            {/* Lower Teeth Arches (Mandible 17-32) */}
            {Array.from({ length: 16 }).map((_, i) => {
              const cx = 55 + i * 32.5;
              const isCenter = i >= 6 && i <= 9;
              const toothHeight = isCenter ? 44 : 36;
              const rootLength = isCenter ? 30 : 42;

              return (
                <g key={`man-${i}`}>
                  {/* Root structure down into mandible */}
                  <path
                    d={`M ${cx - 6},155 Q ${cx},${155 + rootLength} ${cx + 6},155 Z`}
                    fill="#475569"
                    opacity="0.85"
                  />
                  {/* Pulp Canal */}
                  <line
                    x1={cx}
                    y1={155}
                    x2={cx}
                    y2={155 + rootLength - 8}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Enamel Crown */}
                  <rect
                    x={cx - 9.5}
                    y={155 - toothHeight}
                    width={19}
                    height={toothHeight}
                    rx={isCenter ? 3 : 5}
                    fill="#94a3b8"
                    stroke="#cbd5e1"
                    strokeWidth="1.2"
                    opacity="0.95"
                  />
                  {/* Dentin */}
                  <rect
                    x={cx - 6}
                    y={155 - toothHeight + 4}
                    width={12}
                    height={toothHeight - 8}
                    rx="3"
                    fill="#334155"
                    opacity="0.6"
                  />
                  {/* Tooth number marker */}
                  <text
                    x={cx}
                    y="170"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {32 - i}
                  </text>
                </g>
              );
            })}

            {/* AI Pathology Reticle over Tooth #14 */}
            {showAiAnalysis && hasSensitivity && (
              <g className="animate-fade-in">
                {/* Periapical Radiolucency Circle (Simulating bone rarefaction) */}
                <circle
                  cx="478"
                  cy="42"
                  r="14"
                  fill="#f59e0b"
                  fillOpacity="0.25"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx="478" cy="42" r="3" fill="#f59e0b" />
                {/* AI Detection Pill Callout */}
                <rect
                  x="420"
                  y="12"
                  width="118"
                  height="18"
                  rx="9"
                  fill="#78350f"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                <text
                  x="479"
                  y="24"
                  textAnchor="middle"
                  fill="#fef3c7"
                  fontSize="7.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  ⚡ #14 Apical Radiolucency (1.8mm)
                </text>
              </g>
            )}

            {/* Digital Measurement Caliper Overlay */}
            {caliperMode && caliperPoints && (
              <g className="cursor-crosshair">
                <line
                  x1={caliperPoints.x1}
                  y1={caliperPoints.y1}
                  x2={caliperPoints.x2}
                  y2={caliperPoints.y2}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                {/* Point 1 (Crest) */}
                <circle cx={caliperPoints.x1} cy={caliperPoints.y1} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                {/* Point 2 (Apex) */}
                <circle cx={caliperPoints.x2} cy={caliperPoints.y2} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                {/* Distance Label Badge */}
                <rect
                  x={(caliperPoints.x1 + caliperPoints.x2) / 2 + 8}
                  y={(caliperPoints.y1 + caliperPoints.y2) / 2 - 10}
                  width="72"
                  height="18"
                  rx="6"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="1"
                />
                <text
                  x={(caliperPoints.x1 + caliperPoints.x2) / 2 + 44}
                  y={(caliperPoints.y1 + caliperPoints.y2) / 2 + 2}
                  textAnchor="middle"
                  fill="#ecfdf5"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {caliperDistanceMm} mm
                </text>
              </g>
            )}

            {/* Gradients */}
            <defs>
              <radialGradient id="boneGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
              </radialGradient>
              <linearGradient id="alveolarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Anatomical Orientation Crosshairs & Grid */}
        <div className="absolute top-2 left-3 text-[9px] font-mono text-cyan-400/80 font-bold pointer-events-none">
          RIGHT (R)
        </div>
        <div className="absolute top-2 right-3 text-[9px] font-mono text-cyan-400/80 font-bold pointer-events-none">
          LEFT (L)
        </div>
        <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-500 pointer-events-none">
          Matrix: 2048x1024 • 16-Bit Grayscale
        </div>
        <div className="absolute bottom-2 right-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold pointer-events-none">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>GDC Calibrated</span>
        </div>
      </div>

      {/* PACS Bottom Diagnostic Finding Summary */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span className="truncate">
            <strong className="text-white">Radiographic Impression:</strong> Tooth #14 distal bone loss with mild periapical lucency. No visible caries on anterior crowns.
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-3">
          FOV: 16x10 cm
        </span>
      </div>
    </div>
  );
}
