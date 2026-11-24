'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { playHapticTick } from '@/lib/soundscapes';

interface RotatingSealBadgeProps {
  label?: string;
  size?: number;
  className?: string;
}

export function RotatingSealBadge({
  label = "✦ 3-YEAR CLINICAL GUARANTEE ✦ HARLEY STREET EXCELLENCE ",
  size = 120,
  className = "",
}: RotatingSealBadgeProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Rotates proportionally with scroll position
          setRotation(window.scrollY * 0.2);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-label="Official Guarantee Seal"
      onMouseEnter={() => playHapticTick()}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Rotating Circular Text Ring */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full pointer-events-none transform-gpu will-change-transform transition-transform duration-100 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <path
            id="sealCirclePath"
            d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
          />
        </defs>
        <text className="text-[11px] font-mono font-bold uppercase fill-brand-700 tracking-[0.22em]">
          <textPath href="#sealCirclePath" startOffset="0%">
            {label}
          </textPath>
        </text>
      </svg>

      {/* Inner Central Gold/Emerald Crest */}
      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-white flex flex-col items-center justify-center shadow-lg shadow-brand-600/30 border-2 border-white group-hover:scale-110 transition-transform duration-300">
        <ShieldCheck className="w-5 h-5 text-white" />
        <span className="text-[9px] font-black tracking-tighter leading-none mt-0.5">3Y</span>
      </div>
    </div>
  );
}
