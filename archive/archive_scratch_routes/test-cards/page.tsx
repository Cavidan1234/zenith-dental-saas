'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SVGProps } from 'react';
import { Clock, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react';

/* ========================================================================== */
/* 21st.dev / line-md Style Self-Drawing SVG Icons (stroke-dashoffset SMIL)   */
/* ========================================================================== */

type AnimatedIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/* -------------------------------------------------------------------------- */
/* 1. TOP HERO ICONS (Untouched, as requested)                                */
/* -------------------------------------------------------------------------- */

function AnimatedScanIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path
          strokeDasharray="36"
          strokeDashoffset="36"
          d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="36;0" />
        </path>
        <path
          strokeDasharray="32"
          strokeDashoffset="32"
          d="M8.5 9c0-1.7 1.3-3 3.5-3s3.5 1.3 3.5 3c0 2.2-1 3.8-1.6 6-.3 1.1-1.1 1.1-1.9 0-.8 1.1-1.6 1.1-1.9 0C9.5 12.8 8.5 11.2 8.5 9Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.25s" dur="0.35s" values="32;0" />
        </path>
        <path strokeDasharray="20" strokeDashoffset="20" d="M4 12h16">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.25s" values="20;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedSparklesIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path
          strokeDasharray="64"
          strokeDashoffset="64"
          d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.45s" values="64;0" />
        </path>
        <path strokeDasharray="12" strokeDashoffset="12" d="M19 3v4M21 5h-4">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.25s" values="12;0" />
        </path>
        <path strokeDasharray="12" strokeDashoffset="12" d="M5 17v4M7 19H3">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.25s" values="12;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedGemIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path strokeDasharray="64" strokeDashoffset="64" d="M6 3h12l4 6-10 12L2 9Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="64;0" />
        </path>
        <path strokeDasharray="24" strokeDashoffset="24" d="M2 9h20">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.25s" values="24;0" />
        </path>
        <path strokeDasharray="44" strokeDashoffset="44" d="M11 3 8 9l4 12 4-12-3-6">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.45s" dur="0.3s" values="44;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedShieldCheckIcon({ size = 22, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path
          strokeDasharray="64"
          strokeDashoffset="64"
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.45s" values="64;0" />
        </path>
        <path strokeDasharray="16" strokeDashoffset="16" d="m9 12 2 2 4-4">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.25s" values="16;0" />
        </path>
      </g>
    </svg>
  );
}

function AnimatedHeartPulseIcon({ size = 15, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path
          strokeDasharray="64"
          strokeDashoffset="64"
          d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="64;0" />
        </path>
        <path strokeDasharray="24" strokeDashoffset="24" d="M7 12h2l1.5-3 2.5 6 1.5-3H17">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.3s" values="24;0" />
        </path>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. DIVERSE PROCEDURE-SPECIFIC MICRO-SVGS (100% Complete & Sharp at Rest)   */
/* -------------------------------------------------------------------------- */

// 1A. Digital 3D Scanner Frame with Sensor Eye (Full-Arch 3D Intraoral Scan)
function MicroScanReticleIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 1B. Ultrasonic Sonic Wave & Droplet (Swiss EMS Biofilm Therapy)
function MicroSonicWaveIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 1C. Complete Clinical Audit Checklist (12-Point Periodontal & Enamel Audit)
function MicroAuditChartIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 1D. Tooth Occlusion & Alignment Grid (Digital Bite Analysis)
function MicroToothBiteIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 2A. Focused Zoom Laser Ray (Philips Zoom & Diode Laser)
function MicroLaserRayIcon({ size = 14, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path strokeDasharray="75" strokeDashoffset="0" d="M13 2 4 14h7l-2 8 11-12h-7L13 2Z">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="75;0" />
      </path>
    </svg>
  );
}

// 2B. Enamel Armor Shield with Precision Check (Nano-Hydroxyapatite Enamel Armor)
function MicroEnamelShieldIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 2C. Gingival Barrier Shield (Gingival Barrier Protection)
function MicroGumBarrierIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 2D. Maintenance Kit Case (Custom Take-Home Maintenance Kit)
function MicroHomeKitIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 3A. Aesthetic Smile Curve with Radiance (3D Facial & Lip-Line Smile Preview)
function MicroSmileCurveIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 3B. Hand-Layered E.max Ceramic Facet (Hand-Layered Ivoclar E.max Ceramics)
function MicroCeramicLayersIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 3C. AUTHENTIC DENTAL INSPECTION MIRROR (Trial Mock-Up Before Any Tooth Prep)
// (Replaces the awkward axe/sickle shape with an unmistakably clear Dental Mirror!)
function MicroDentalMirrorIcon({ size = 14, ...props }: AnimatedIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* Circular Angled Dental Mirror Head */}
      <circle strokeDasharray="50" strokeDashoffset="0" cx="15" cy="7" r="5">
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.35s" values="50;0" />
      </circle>
      {/* Slender Dental Handle with Knurled Grip */}
      <path strokeDasharray="30" strokeDashoffset="0" d="m11.5 10.5-8 8a1.5 1.5 0 0 0 2.1 2.1l8-8">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.25s" values="30;0" />
      </path>
      {/* Mirror Glass Reflection Accent */}
      <path strokeDasharray="10" strokeDashoffset="0" d="m13.5 6 3 2">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.35s" dur="0.15s" values="10;0" />
      </path>
    </svg>
  );
}

// 3D. Color Palette & Tooth Shade Chips (Natural Translucency Shade Matching)
function MicroShadeGuideIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 4A. 3D Volumetric Bone Cube (Low-Dose 3D CBCT Bone Tomography)
function MicroVolumetricCubeIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 4B. Surgical Keyhole Guide Target (Digital Keyhole Surgical Guide Plan)
function MicroSurgicalGuideIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 4C. Swiss Titanium Dental Implant Post (Straumann Swiss Titanium & Zirconia)
function MicroImplantPostIcon({ size = 14, ...props }: AnimatedIconProps) {
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

// 4D. 3D Sinus & Nerve Safety Map (3D Nerve & Sinus Safety Mapping)
function MicroSafetyRadarIcon({ size = 14, ...props }: AnimatedIconProps) {
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

/* ========================================================================== */
/* Test Showcase Page Component                                               */
/* ========================================================================== */

export default function TestCardsPage() {
  const [globalReplayKey, setGlobalReplayKey] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [cardAnimKeys, setCardAnimKeys] = useState<Record<string, number>>({});

  const triggerCardRedraw = (id: string) => {
    setHoveredCardId(id);
    setCardAnimKeys((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const services = [
    {
      id: 'srv-checkup',
      title: 'Comprehensive 3D Exam & Prophylaxis',
      category: 'Diagnostic & Preventive',
      desc: 'Digital intraoral 3D scan, periodontal bone health check, oral cancer screening, and gentle ultrasonic cleaning.',
      highlights: [
        { text: 'Full-Arch 3D Intraoral Digital Scan', icon: MicroScanReticleIcon },
        { text: 'Swiss EMS Guided Biofilm Therapy', icon: MicroSonicWaveIcon },
        { text: '12-Point Periodontal & Enamel Audit', icon: MicroAuditChartIcon },
        { text: 'Digital Bite & Occlusion Analysis', icon: MicroToothBiteIcon },
      ],
      guarantee: '100% Pain-Free Ultrasonic Protocol',
      duration: '45 mins',
      price: '$80',
      deposit: '$25 deposit',
      icon: AnimatedScanIcon,
    },
    {
      id: 'srv-whitening',
      title: 'Laser Teeth Whitening (In-Office)',
      category: 'Cosmetic Dentistry',
      desc: 'Medical-grade diode laser activation providing up to 8 shades of whitening with zero dentin hypersensitivity.',
      highlights: [
        { text: 'Philips Zoom & Diode Laser Activation', icon: MicroLaserRayIcon },
        { text: 'Nano-Hydroxyapatite Enamel Armor', icon: MicroEnamelShieldIcon },
        { text: 'Gingival Barrier Protection Shield', icon: MicroGumBarrierIcon },
        { text: 'Custom Take-Home Maintenance Kit', icon: MicroHomeKitIcon },
      ],
      guarantee: 'Zero Sensitivity Desensitizing Gel',
      duration: '60 mins',
      price: '$250',
      deposit: '$50 deposit',
      icon: AnimatedSparklesIcon,
    },
    {
      id: 'srv-veneers',
      title: 'Porcelain Veneer Smile Design',
      category: 'Aesthetic Artistry',
      desc: 'Digital Smile Design (DSD) consultation, facial proportion mapping, and handcrafted ceramic veneers from Germany.',
      highlights: [
        { text: '3D Facial & Lip-Line Smile Preview', icon: MicroSmileCurveIcon },
        { text: 'Hand-Layered Ivoclar E.max Ceramics', icon: MicroCeramicLayersIcon },
        { text: 'Trial Mock-Up Before Any Tooth Prep', icon: MicroDentalMirrorIcon },
        { text: 'Natural Translucency Shade Matching', icon: MicroShadeGuideIcon },
      ],
      guarantee: '10-Year German Ceramic Warranty',
      duration: '45 mins',
      price: '$120',
      deposit: '$30 deposit',
      icon: AnimatedGemIcon,
    },
    {
      id: 'srv-implant',
      title: 'Dental Implant Consultation & 3D CBCT',
      category: 'Implantology & Surgery',
      desc: 'Precision 3D bone volume scan, computer-guided implant planning, and lifetime-guaranteed titanium/zirconia options.',
      highlights: [
        { text: 'Low-Dose 3D CBCT Bone Tomography', icon: MicroVolumetricCubeIcon },
        { text: 'Digital Keyhole Surgical Guide Plan', icon: MicroSurgicalGuideIcon },
        { text: 'Straumann Swiss Titanium & Zirconia', icon: MicroImplantPostIcon },
        { text: '3D Nerve & Sinus Safety Mapping', icon: MicroSafetyRadarIcon },
      ],
      guarantee: 'Lifetime Structural Implant Guarantee',
      duration: '60 mins',
      price: '$150',
      deposit: '$50 deposit',
      icon: AnimatedShieldCheckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      {/* Top Test Bar (exact 66px header alignment) */}
      <header className="h-[66px] border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/b/zenith-dental"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Zenith Dental</span>
          </Link>
          <span className="h-4 w-[1px] bg-slate-200" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Card Sandbox · Diverse Animated SVGs
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs text-slate-500">
            Hover over any card to trigger its animated micro-SVGs
          </span>
          <button
            onClick={() => setGlobalReplayKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-brand-600 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay All SVGs</span>
          </button>
        </div>
      </header>

      {/* Main 1:1 Pricing Section Viewport */}
      <section className="w-full min-h-[calc(100dvh-66px)] lg:h-[calc(100dvh-66px)] relative lg:overflow-hidden bg-white flex flex-col justify-between py-8 lg:py-5 px-4 sm:px-6 lg:px-8 select-none box-border">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full flex-1 justify-between gap-6 lg:gap-0">
          {/* Section Heading */}
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-5 sm:mb-6 shrink-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Precision Dental Treatments
            </h2>
          </div>

          {/* 4-Column Enriched Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 flex-1 lg:min-h-0 w-full items-stretch pb-1">
            {services.map((srv, idx) => {
              const IconComponent = srv.icon;
              const animInstanceKey = `${globalReplayKey}-${cardAnimKeys[srv.id] || 0}`;
              const hoveredIndex = services.findIndex((s) => s.id === hoveredCardId);
              const isHovered = hoveredCardId === srv.id;

              // Dynamic iOS Repulsion Physics (push neighbors aside + minimal shrink)
              let transformStyle = 'scale(0.97) translateY(0px)';
              let zIndex = 10;
              let opacity = 1;
              let shadowClass = 'shadow-xs';

              if (hoveredIndex !== -1) {
                if (idx === hoveredIndex) {
                  // Active Card: Pops forward with iOS spring & clean neutral shadow
                  transformStyle = 'scale(1.038) translateY(-4px)';
                  zIndex = 30;
                  opacity = 1;
                  shadowClass = 'shadow-[0_20px_40px_-10px_rgba(15,23,42,0.12),0_8px_16px_-6px_rgba(15,23,42,0.06)]';
                } else {
                  // Neighbor Cards: Primarily pushed horizontally aside, with barely 0.5% subtle shrink
                  const distance = idx - hoveredIndex;
                  const shiftPx = distance > 0 ? (distance === 1 ? 14 : 8) : (distance === -1 ? -14 : -8);
                  transformStyle = `translateX(${shiftPx}px) scale(0.965)`;
                  zIndex = 10;
                  opacity = 0.92;
                }
              }

              return (
                <div
                  key={srv.id}
                  onMouseEnter={() => triggerCardRedraw(srv.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onMouseMove={handleCardMouseMove}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    transition:
                      'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease-out, box-shadow 0.45s ease-out',
                  }}
                  className={`group relative h-full rounded-2xl sm:rounded-3xl p-[1px] flex flex-col origin-center transform-gpu will-change-transform cursor-pointer select-none ${shadowClass}`}
                >
                  {/* Spotlight Border Glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                    style={{
                      background:
                        'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(37, 99, 235, 0.45), transparent 70%)',
                    }}
                  />

                  {/* Base Card Shell (Slightly more compact padding) */}
                  <div className="relative z-10 w-full h-full p-3.5 sm:p-4 rounded-[15px] sm:rounded-[22px] bg-white border border-slate-200/90 group-hover:border-transparent transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs">

                    {/* TOP: Header Icon + Category + Title + Desc */}
                    <div className="relative z-20 shrink-0">
                      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                          <IconComponent key={`main-${animInstanceKey}`} size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {srv.category}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 leading-snug line-clamp-2 min-h-[3rem]">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 min-h-[3.6rem]">
                        {srv.desc}
                      </p>
                    </div>

                    {/* MIDDLE: Clean Open List */}
                    <div className="relative z-20 space-y-2 mt-2 mb-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-brand-600 transition-colors block">
                          Included in Visit
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {srv.highlights.map((item, i) => {
                          const ItemIcon = item.icon;
                          return (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                              <span className="text-brand-600 shrink-0 mt-0.5 p-1 rounded-md bg-brand-50/70 group-hover:bg-brand-100 transition-colors">
                                <ItemIcon key={`item-${animInstanceKey}-${i}`} size={13} />
                              </span>
                              <span className="leading-snug pt-0.5">{item.text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* BOTTOM: Prominent Price, Duration, Guarantee & Tactile CTA */}
                    <div className="mt-auto pt-3 border-t border-slate-100/90 relative z-20 space-y-2.5">
                      {/* Clinical Guarantee Row */}
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                        <span className={isHovered ? 'text-brand-600' : 'text-slate-500'}>
                          <AnimatedHeartPulseIcon key={`pulse-${animInstanceKey}`} size={14} />
                        </span>
                        <span className="truncate">{srv.guarantee}</span>
                      </div>

                      {/* Main Price & Deposit Highlight */}
                      <div className="flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {srv.price}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">/ visit</span>
                        </div>
                        <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full shadow-2xs">
                          {srv.deposit}
                        </span>
                      </div>

                      {/* Est. Duration & Sterilization Buffer */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>{srv.duration} (+15m buffer)</span>
                      </div>

                      {/* Prominent Tactile CTA Button with subtle luminous glow & hover micro-scale */}
                      <button
                        type="button"
                        className="group/btn w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 border border-brand-500 shadow-md shadow-brand-600/20 hover:shadow-[0_4px_22px_rgba(37,99,235,0.45)] hover:brightness-105 hover:scale-[1.025] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer select-none"
                      >
                        <span>Reserve Treatment Slot</span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
