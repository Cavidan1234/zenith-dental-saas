'use client';

import React from 'react';

interface ZenithLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  light?: boolean;
}

/**
 * Zenith Dental Luxury Monogram Logo (Concept 1: Z-Monogram & Diamond Faceted Tooth Crown)
 * Swiss precision vector emblem crafted for Zenith Dental Marylebone / Harley Street London.
 */
export function ZenithLogo({
  size = 36,
  className = '',
  showText = false,
  light = false,
}: ZenithLogoProps) {
  const primaryColor = light ? '#ffffff' : '#1d4ed8';
  const secondaryColor = light ? '#93c5fd' : '#1e3a8a';
  const facetColor = light ? '#60a5fa' : '#2563eb';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 transform-gpu group-hover:scale-105"
      >
        <defs>
          <linearGradient id="zenithPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={facetColor} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>

        {/* 1. Main 'Z' Monogram Spine (Bold Architectural Strokes) */}
        {/* Top Horizontal Bar */}
        <path
          d="M 22 36 L 52 36 L 47 43 L 26 43 Z"
          fill="url(#zenithPrimaryGrad)"
        />

        {/* Main Diagonal Spire */}
        <path
          d="M 52 36 L 24 74 L 33 74 L 59 39 Z"
          fill="url(#zenithPrimaryGrad)"
        />

        {/* Bottom Horizontal Base */}
        <path
          d="M 24 74 L 62 74 L 60 80 L 16 80 L 22 72 Z"
          fill="url(#zenithPrimaryGrad)"
        />

        {/* 2. Diamond-Faceted Dental Tooth Crown (Upper & Right Contours) */}
        {/* Left Crown Cusp */}
        <path
          d="M 24 29 L 36 21 L 52 27 L 46 36 L 26 36 Z"
          fill="none"
          stroke="url(#zenithPrimaryGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Crown Cusp & Apex */}
        <path
          d="M 52 27 L 68 21 L 78 33 L 64 56 L 52 36 Z"
          fill="none"
          stroke="url(#zenithPrimaryGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Facet Diagonal Connector Lines */}
        <path
          d="M 36 21 L 52 36 L 68 21"
          stroke="url(#zenithPrimaryGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 52 36 L 78 33"
          stroke="url(#zenithPrimaryGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 44 48 L 64 56 L 48 64"
          stroke="url(#zenithPrimaryGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 64 56 L 58 74"
          stroke="url(#zenithPrimaryGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Subtle Diamond Sparkle Pip at Crown Peak */}
        <circle cx="68" cy="21" r="2.2" fill={light ? '#ffffff' : '#38bdf8'} />
      </svg>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black text-lg sm:text-xl tracking-tight leading-none ${
              light ? 'text-white' : 'text-slate-900'
            }`}
          >
            Zenith Dental
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5 ${
              light ? 'text-blue-200' : 'text-slate-400'
            }`}
          >
            Marylebone · London
          </span>
        </div>
      )}
    </div>
  );
}
