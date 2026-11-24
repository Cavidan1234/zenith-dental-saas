'use client';

import React from 'react';

export function DentalPacsLowerArch() {
  return (
    <>
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
    </>
  );
}
