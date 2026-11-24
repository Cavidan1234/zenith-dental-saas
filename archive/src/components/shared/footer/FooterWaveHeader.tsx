'use client';

import React from 'react';

export function FooterWaveHeader() {
  return (
    <div className="relative w-full overflow-hidden bg-white select-none pointer-events-none leading-none -mb-1">
      <svg
        className="relative w-full h-24 sm:h-32 md:h-40 block"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="zenith-wave-path"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="waves-parallax">
          {/* Layer 1 (Back): Ultra-soft ambient wave */}
          <use
            href="#zenith-wave-path"
            xlinkHref="#zenith-wave-path"
            x="48"
            y="0"
            fill="rgba(186, 230, 253, 0.75)"
            className="wave-layer-back"
          />
          {/* Layer 2 (Middle): Fluid translucent wave */}
          <use
            href="#zenith-wave-path"
            xlinkHref="#zenith-wave-path"
            x="48"
            y="2"
            fill="rgba(125, 211, 252, 0.85)"
            className="wave-layer-front"
          />
          {/* Layer 3 (Base): Zenith Brand Sky Blue (#38bdf8) */}
          <use
            href="#zenith-wave-path"
            xlinkHref="#zenith-wave-path"
            x="48"
            y="4"
            fill="#38bdf8"
            className="wave-layer-base"
          />
        </g>
      </svg>
    </div>
  );
}
