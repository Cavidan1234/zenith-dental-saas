'use client';

import React from 'react';
import { DentalPacsUpperArch } from './DentalPacsUpperArch';
import { DentalPacsLowerArch } from './DentalPacsLowerArch';
import { DentalPacsCaliperOverlay } from './DentalPacsCaliperOverlay';

interface DentalPacsArchSvgProps {
  showAiAnalysis: boolean;
  hasSensitivity: boolean;
  caliperMode: boolean;
  caliperPoints: { x1: number; y1: number; x2: number; y2: number } | null;
  caliperDistanceMm: number;
}

export function DentalPacsArchSvg({
  showAiAnalysis,
  hasSensitivity,
  caliperMode,
  caliperPoints,
  caliperDistanceMm,
}: DentalPacsArchSvgProps) {
  return (
    <svg
      viewBox="0 0 600 240"
      className="w-full h-full drop-shadow-2xl overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Anatomical Radiopacity Gradient */}
      <rect width="600" height="240" rx="16" fill="#030712" />

      {/* Mandibular & Maxillary Trabecular Bone Cloud */}
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
      <DentalPacsUpperArch />

      {/* Lower Teeth Arches (Mandible 17-32) */}
      <DentalPacsLowerArch />

      {/* AI Pathology Reticle over Tooth #14 */}
      {showAiAnalysis && hasSensitivity && (
        <g className="animate-fade-in">
          {/* Periapical Radiolucency Circle */}
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
        <DentalPacsCaliperOverlay
          caliperPoints={caliperPoints}
          caliperDistanceMm={caliperDistanceMm}
        />
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
  );
}
