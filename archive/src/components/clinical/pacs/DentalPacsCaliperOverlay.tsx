'use client';

import React from 'react';

interface DentalPacsCaliperOverlayProps {
  caliperPoints: { x1: number; y1: number; x2: number; y2: number };
  caliperDistanceMm: number;
}

export function DentalPacsCaliperOverlay({
  caliperPoints,
  caliperDistanceMm,
}: DentalPacsCaliperOverlayProps) {
  return (
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
      <circle cx={caliperPoints.x1} cy={caliperPoints.y1} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx={caliperPoints.x2} cy={caliperPoints.y2} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
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
  );
}
