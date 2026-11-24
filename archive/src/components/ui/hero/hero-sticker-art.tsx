"use client"

import * as React from "react"
import { starPath, StickerKind } from "../stickers/sticker-script-engine"

export const STROKE = 4.2
export const SLANT = 0.1584
export const BURST = starPath(13, 54, 39, 60, 60, 0.2, 4)
export const BOLT = "M70 8L26 66H55L44 112L94 48H64Z"
export const HEART = "M60 100C22 76 10 56 18 38C26 20 50 18 60 38C70 18 94 20 102 38C110 56 98 76 60 100Z"
export const BUBBLE = "M24 22H96A14 14 0 0 1 110 36V70A14 14 0 0 1 96 84H56L34 102L38 84H24A14 14 0 0 1 10 70V36A14 14 0 0 1 24 22Z"
export const BADGE = starPath(8, 52, 42, 60, 60, 0.1, 2)
export const TOOTH = "M32 18 C16 18 10 32 10 50 C10 70 18 88 28 104 C34 114 44 112 47 96 C50 82 50 68 60 68 C70 68 70 82 73 96 C76 112 86 114 92 104 C102 88 110 70 110 50 C110 32 104 18 88 18 C76 18 68 28 60 28 C52 28 44 18 32 18 Z"

export function HeroStickerArt(kind: StickerKind | "badge" | "tooth", text?: string): { shape: React.ReactNode; art: React.ReactNode } {
  switch (kind) {
    case "tooth":
      return {
        shape: <path d={TOOTH} />,
        art: (
          <>
            <defs>
              <linearGradient id="tooth-grad-hero" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>
            <path d={TOOTH} fill="url(#tooth-grad-hero)" />
            <path d="M22 36 C18 48 20 62 26 72" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" opacity=".8" />
            <path d="M84 30 Q84 42 72 42 Q84 42 84 54 Q84 42 96 42 Q84 42 84 30 Z" fill="#0284c7" />
            <circle cx="84" cy="42" r="2.5" fill="#ffffff" />
            <text x="60" y="62" textAnchor="middle" fill="#0369a1" fontSize="13" fontWeight="900" fontFamily="sans-serif">
              {text ?? "SMILE"}
            </text>
            <text x="60" y="78" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="800" fontFamily="sans-serif">
              3D
            </text>
          </>
        ),
      }
    case "burst":
      return {
        shape: <path d={BURST} />,
        art: (
          <>
            <path d={BURST} fill="#2563eb" />
            <path d={starPath(13, 44, 33, 60, 60, 0.2, 4)} fill="#1d4ed8" />
            <text x="60" y="65" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="sans-serif">
              {text ?? "HARLEY ST"}
            </text>
          </>
        ),
      }
    case "bubble":
      return {
        shape: <path d={BUBBLE} />,
        art: (
          <>
            <path d={BUBBLE} fill="#60a5fa" />
            <text x="60" y="58" textAnchor="middle" fill="#1e3a8a" fontSize="17" fontWeight="800" fontFamily="sans-serif">
              {text ?? "3D SCAN"}
            </text>
          </>
        ),
      }
    case "heart":
      return {
        shape: <path d={HEART} />,
        art: (
          <>
            <path d={HEART} fill="#1e40af" />
            <path d="M30 42Q32 30 45 29" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
          </>
        ),
      }
    case "smiley":
      return {
        shape: <circle cx="60" cy="60" r="50" />,
        art: (
          <>
            <circle cx="60" cy="60" r="50" fill="#3b82f6" />
            <circle cx="60" cy="60" r="40" fill="none" stroke="#fff" strokeWidth="3" opacity=".9" />
            <ellipse cx="47" cy="50" rx="4" ry="7.5" fill="#fff" />
            <ellipse cx="73" cy="50" rx="4" ry="7.5" fill="#fff" />
            <path d="M36 66Q60 92 84 66M32 63L39 69M88 63L81 69" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </>
        ),
      }
    case "badge":
      return {
        shape: <path d={BADGE} />,
        art: (
          <>
            <path d={BADGE} fill="#059669" />
            <text x="60" y="56" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">
              ZERO
            </text>
            <text x="60" y="73" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">
              WAIT
            </text>
          </>
        ),
      }
    case "bolt":
    default:
      return {
        shape: <path d={BOLT} />,
        art: (
          <>
            <path d={BOLT} fill="#f59e0b" />
            <path d="M66 20L38 58" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".8" />
          </>
        ),
      }
  }
}
