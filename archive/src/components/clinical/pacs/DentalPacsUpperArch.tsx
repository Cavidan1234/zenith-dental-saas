'use client';

import React from 'react';

export function DentalPacsUpperArch() {
  return (
    <>
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
    </>
  );
}
