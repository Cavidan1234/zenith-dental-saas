"use client"

import * as React from "react"
import { stickerArt, StickerKind } from "./sticker-footer-art"

export function StickerSvg({ kind, text }: { kind: StickerKind; text?: string }) {
  const id = "ssf" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const { shape, art } = stickerArt(kind, text)
  return (
    <svg viewBox="-6 -6 132 132" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id + "c"}>{shape}</clipPath>
        <linearGradient id={id + "g"} x1="0" x2="1" y1="0" y2="0">
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".65" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="#fff" stroke="#fff" strokeWidth="11" strokeLinejoin="round">
        {shape}
      </g>
      {art}
      <g clipPath={"url(#" + id + "c)"}>
        <g transform="rotate(20 60 60)">
          <rect className="ssf-sheen" x="-30" y="-30" width="180" height="180" fill={"url(#" + id + "g)"} />
        </g>
      </g>
    </svg>
  )
}
