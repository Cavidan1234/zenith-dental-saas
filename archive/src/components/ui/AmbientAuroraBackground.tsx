'use client';

import React from 'react';

export function AmbientAuroraBackground() {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes auroraFloatSlow1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(40px, -30px, 0) scale(1.08);
          }
        }
        @keyframes auroraFloatSlow2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-35px, 25px, 0) scale(0.95);
          }
        }
        .aurora-blob-1 {
          animation: auroraFloatSlow1 32s ease-in-out infinite;
          will-change: transform;
        }
        .aurora-blob-2 {
          animation: auroraFloatSlow2 28s ease-in-out infinite;
          will-change: transform;
        }
        .micro-dot-grid {
          background-image: radial-gradient(rgba(14, 165, 233, 0.12) 1.2px, transparent 1.2px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0.85) 0%, transparent 85%);
          -webkit-mask-image: radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0.85) 0%, transparent 85%);
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob-1, .aurora-blob-2 {
            animation: none;
          }
        }
      `}</style>

      {/* Lovable.dev Gaussian Radial Aurora Glows (Pure GPU Native Math, No Filter Blur Lag) */}
      <div
        className="aurora-blob-1 absolute -top-[10%] -left-[10%] w-[65vw] h-[65vw] rounded-full opacity-60 dark:opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 70%)',
        }}
      />
      <div
        className="aurora-blob-2 absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full opacity-55 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(14, 165, 233, 0.06) 50%, transparent 70%)',
        }}
      />
      <div
        className="aurora-blob-1 absolute bottom-[5%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-50 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Lovable.dev 32px Micro-Dot Grid Layer with Radial Vignette */}
      <div className="micro-dot-grid absolute inset-0 opacity-70 dark:opacity-30" />
    </div>
  );
}
