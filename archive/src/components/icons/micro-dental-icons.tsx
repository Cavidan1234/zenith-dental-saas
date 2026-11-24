'use client';

import React from 'react';
import type { AnimatedIconProps } from './hero-animated-icons';

/* -------------------------------------------------------------------------- */
/* 2. DIVERSE PROCEDURE-SPECIFIC MICRO-SVGS                                   */
/* -------------------------------------------------------------------------- */

export function MicroScanReticleIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect strokeDasharray="80" strokeDashoffset="0" x="3" y="3" width="18" height="18" rx="5">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="80;0" />
      </rect>
      <circle strokeDasharray="30" strokeDashoffset="0" cx="12" cy="12" r="4">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.25s" values="30;0" />
      </circle>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function MicroSonicWaveIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="60" strokeDashoffset="0" d="M12 2.5C12 2.5 6 9 6 13.5a6 6 0 0 0 12 0C18 9 12 2.5 12 2.5Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="60;0" />
      </path>
      <path strokeDasharray="20" strokeDashoffset="0" d="M9.5 14a2.5 2.5 0 0 0 5 0">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.2s" values="20;0" />
      </path>
    </svg>
  );
}

export function MicroAuditChartIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect strokeDasharray="70" strokeDashoffset="0" x="4" y="3" width="16" height="18" rx="3">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="70;0" />
      </rect>
      <path strokeDasharray="14" strokeDashoffset="0" d="m8 10 2 2 4-4">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="14;0" />
      </path>
      <path strokeDasharray="16" strokeDashoffset="0" d="M8 16h8">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" values="16;0" />
      </path>
    </svg>
  );
}

export function MicroToothBiteIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle strokeDasharray="70" strokeDashoffset="0" cx="12" cy="12" r="9">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="70;0" />
      </circle>
      <path strokeDasharray="30" strokeDashoffset="0" d="M3 12h18M12 3v18">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.25s" values="30;0" />
      </path>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function MicroLaserRayIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="75" strokeDashoffset="0" d="M13 2 4 14h7l-2 8 11-12h-7L13 2Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="75;0" />
      </path>
    </svg>
  );
}

export function MicroEnamelShieldIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="70" strokeDashoffset="0" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="70;0" />
      </path>
      <path strokeDasharray="14" strokeDashoffset="0" d="m9 11.5 2 2 4-4">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.2s" values="14;0" />
      </path>
    </svg>
  );
}

export function MicroGumBarrierIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect strokeDasharray="70" strokeDashoffset="0" x="3" y="6" width="18" height="12" rx="4">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="70;0" />
      </rect>
      <path strokeDasharray="24" strokeDashoffset="0" d="M3 12h18">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="24;0" />
      </path>
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function MicroHomeKitIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect strokeDasharray="70" strokeDashoffset="0" x="3" y="7" width="18" height="14" rx="3">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="70;0" />
      </rect>
      <path strokeDasharray="20" strokeDashoffset="0" d="M8 7V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="20;0" />
      </path>
      <path strokeDasharray="16" strokeDashoffset="0" d="M12 11v6M9 14h6">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" values="16;0" />
      </path>
    </svg>
  );
}

export function MicroSmileCurveIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle strokeDasharray="70" strokeDashoffset="0" cx="12" cy="12" r="9">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="70;0" />
      </circle>
      <path strokeDasharray="20" strokeDashoffset="0" d="M8 13.5s1.5 3 4 3 4-3 4-3">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.2s" values="20;0" />
      </path>
      <circle cx="9" cy="9.5" r="1.2" fill="currentColor" />
      <circle cx="15" cy="9.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function MicroCeramicLayersIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="60" strokeDashoffset="0" d="M6 3h12l4 6-10 12L2 9Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="60;0" />
      </path>
      <path strokeDasharray="24" strokeDashoffset="0" d="M2 9h20">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.2s" values="24;0" />
      </path>
    </svg>
  );
}

export function MicroDentalMirrorIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle strokeDasharray="50" strokeDashoffset="0" cx="15" cy="7" r="5">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="50;0" />
      </circle>
      <path strokeDasharray="30" strokeDashoffset="0" d="m11.5 10.5-8 8a1.5 1.5 0 0 0 2.1 2.1l8-8">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.25s" values="30;0" />
      </path>
      <path strokeDasharray="10" strokeDashoffset="0" d="m13.5 6 3 2">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.15s" values="10;0" />
      </path>
    </svg>
  );
}

export function MicroShadeGuideIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect strokeDasharray="36" strokeDashoffset="0" x="4" y="4" width="6" height="16" rx="2">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="36;0" />
      </rect>
      <rect strokeDasharray="36" strokeDashoffset="0" x="14" y="4" width="6" height="16" rx="2">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.15s" dur="0.3s" values="36;0" />
      </rect>
      <path strokeDasharray="12" strokeDashoffset="0" d="M4 11h6M14 11h6">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.15s" values="12;0" />
      </path>
    </svg>
  );
}

export function MicroVolumetricCubeIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="80" strokeDashoffset="0" d="M12 2 3 7v10l9 5 9-5V7l-9-5Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="80;0" />
      </path>
      <path strokeDasharray="40" strokeDashoffset="0" d="M12 12v10M12 12 3 7M12 12l9-5">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.25s" values="40;0" />
      </path>
    </svg>
  );
}

export function MicroSurgicalGuideIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle strokeDasharray="60" strokeDashoffset="0" cx="12" cy="12" r="8">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="60;0" />
      </circle>
      <path strokeDasharray="24" strokeDashoffset="0" d="M12 2v4M12 18v4M2 12h4M18 12h4">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="24;0" />
      </path>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function MicroImplantPostIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="60" strokeDashoffset="0" d="M7 3h10v3l-1.5 2.5v9.5l-3.5 3-3.5-3V8.5L7 6V3Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="60;0" />
      </path>
      <path strokeDasharray="24" strokeDashoffset="0" d="M8 11h8M8 14h8M9 17h6">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.2s" values="24;0" />
      </path>
    </svg>
  );
}

export function MicroSafetyRadarIcon({ size = 13, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="70" strokeDashoffset="0" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="70;0" />
      </path>
      <path strokeDasharray="20" strokeDashoffset="0" d="M7 11c2.5-3 7.5-3 10 0M9 14c1.5-1.5 4.5-1.5 6 0">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.2s" values="20;0" />
      </path>
    </svg>
  );
}
