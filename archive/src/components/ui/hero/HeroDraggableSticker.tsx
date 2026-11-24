"use client"

import * as React from "react"
import { StickerKind } from "../stickers/sticker-script-engine"
import { HeroStickerArt } from "./hero-sticker-art"

export interface HeroStickerItem {
  i: number
  kind: StickerKind | "badge" | "tooth"
  text?: string
  label: string
  home: { x: number; y: number }
  at: { x: number; y: number }
  rotate: number
}

interface HeroDraggableStickerProps {
  s: HeroStickerItem
  idx: number
  animReady: boolean
  activeDragId: number | null
  order: number[]
  onDown: (e: React.PointerEvent<HTMLButtonElement>, i: number) => void
  onMove: (e: React.PointerEvent<HTMLButtonElement>) => void
  onUp: (e: React.PointerEvent<HTMLButtonElement>) => void
  goHome: (i: number) => void
}

export function HeroDraggableSticker({
  s,
  idx,
  animReady,
  activeDragId,
  order,
  onDown,
  onMove,
  onUp,
  goHome,
}: HeroDraggableStickerProps) {
  const { shape, art } = HeroStickerArt(s.kind, s.text)
  const stickerId = `bg-hero-st-${s.i}`
  const slapDelay = `${0.65 + idx * 0.14}s`
  const isDragging = activeDragId === s.i

  return (
    <div
      key={s.i}
      className={`absolute select-none touch-none -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group z-20 ${
        animReady ? "sticker-initial-slap" : "opacity-0"
      }`}
      style={{
        left: s.at.x + "%",
        top: s.at.y + "%",
        width: "clamp(56px, 11cqw, 82px)",
        zIndex: 20 + Math.max(0, order.indexOf(s.i) + 1),
        rotate: `calc(${s.rotate}deg + var(--tilt, 0deg))`,
        animationDelay: slapDelay,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 2-3 Bold Falling Lines */}
      <div
        className={`absolute -inset-x-1 -inset-y-3 pointer-events-none transition-all duration-300 -z-10 flex items-center justify-center ${
          isDragging ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        <svg viewBox="0 0 100 115" className="w-full h-full overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]" fill="none">
          <path d="M 28 6 L 28 108" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" className="continuous-drop-1" />
          <path d="M 52 -2 L 52 116" stroke="#38bdf8" strokeWidth="7.5" strokeLinecap="round" className="continuous-drop-2" />
          <path d="M 74 14 L 74 98" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" className="continuous-drop-3" />
        </svg>
      </div>

      <button
        type="button"
        className="w-full h-full block focus:outline-none transition-transform duration-200 group-hover:scale-115 active:scale-105"
        onPointerDown={(e) => onDown(e, s.i)}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={(e) => onUp(e)}
        onDoubleClick={() => goHome(s.i)}
        title={`${s.label} — Drag anywhere or double-click to snap home`}
      >
        <div className="relative filter drop-shadow-[0_8px_16px_rgba(10,16,60,0.45)] group-hover:drop-shadow-[0_16px_28px_rgba(0,0,0,0.55)] transition-all">
          <svg viewBox="-6 -6 132 132" className="w-full h-auto overflow-visible">
            <defs>
              <clipPath id={`${stickerId}-clip`}>{shape}</clipPath>
              <linearGradient id={`${stickerId}-grad`} x1="0" x2="1" y1="0" y2="0">
                <stop offset=".25" stopColor="#fff" stopOpacity="0" />
                <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
                <stop offset=".75" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>

            <g fill="#ffffff" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round">
              {shape}
            </g>

            {art}

            <g clipPath={`url(#${stickerId}-clip)`}>
              <g transform="rotate(25 60 60)">
                <rect
                  className="sticker-sheen"
                  x="-40"
                  y="-40"
                  width="200"
                  height="200"
                  fill={`url(#${stickerId}-grad)`}
                />
              </g>
            </g>
          </svg>
        </div>
      </button>
    </div>
  )
}
