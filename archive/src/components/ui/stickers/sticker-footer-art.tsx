"use client"

import * as React from "react"
import { starPath, layoutScript, round, type StickerKind } from "./sticker-script-engine"
import { STROKE } from "./sticker-footer-css"

export type { StickerKind }

export type StickerSpec =
  | StickerKind
  | {
      kind?: StickerKind
      node?: React.ReactNode
      label?: string
      text?: string
      x?: number
      y?: number
      size?: number
      rotate?: number
    }

export type SocialKind = "linkedin" | "instagram" | "tiktok" | "x" | "youtube" | "dribbble"
export type Social = { kind: SocialKind; href: string; label?: string }
export type Job = { title: string; href?: string }
export type Credit = { role: string; name: string }

export const LABELS: Record<StickerKind, string> = {
  burst: "Wow burst sticker",
  smiley: "Smiley sticker",
  heart: "Heart sticker",
  bubble: "Speech bubble sticker",
  daisy: "Daisy sticker",
  camera: "Camera sticker",
  bolt: "Lightning bolt sticker",
}

export const BURST = starPath(13, 54, 39, 60, 60, 0.2, 4)
export const BOLT = "M70 8L26 66H55L44 112L94 48H64Z"
export const HEART = "M60 100C22 76 10 56 18 38C26 20 50 18 60 38C70 18 94 20 102 38C110 56 98 76 60 100Z"
export const BUBBLE = "M24 22H96A14 14 0 0 1 110 36V70A14 14 0 0 1 96 84H56L34 102L38 84H24A14 14 0 0 1 10 70V36A14 14 0 0 1 24 22Z"

export const sparkle = (cx: number, cy: number, r: number) =>
  "M" + cx + " " + (cy - r) + "Q" + cx + " " + cy + " " + (cx + r) + " " + cy + "Q" + cx + " " + cy + " " + cx + " " + (cy + r) + "Q" + cx + " " + cy + " " + (cx - r) + " " + cy + "Q" + cx + " " + cy + " " + cx + " " + (cy - r) + "Z"

export function ScriptText({ text, cx, cy, w, color, stroke = STROKE }: { text: string; cx: number; cy: number; w: number; color: string; stroke?: number }) {
  const { main, extra, width, top } = React.useMemo(() => layoutScript(text), [text])
  if (!width) return null
  const s = w / (width + stroke)
  const h = (-top + 1) * s
  return (
    <g transform={"translate(" + round(cx - (width * s) / 2) + " " + round(cy + h / 2 - s) + ") scale(" + round(s) + ")"}>
      <path d={main + extra.join("")} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

export const stickerArt = (kind: StickerKind, text?: string): { shape: React.ReactNode; art: React.ReactNode } => {
  switch (kind) {
    case "burst":
      return {
        shape: <path d={BURST} />,
        art: (
          <>
            <path d={BURST} fill="#2563eb" />
            <path d={starPath(13, 44, 33, 60, 60, 0.2, 4)} fill="#3b82f6" />
            <ScriptText text={text ?? "wow"} cx={60} cy={58} w={62} color="#ffffff" stroke={3.4} />
          </>
        ),
      }
    case "smiley":
      return {
        shape: <circle cx="60" cy="60" r="50" />,
        art: (
          <>
            <circle cx="60" cy="60" r="50" fill="#60a5fa" />
            <circle cx="60" cy="60" r="40" fill="none" stroke="#fff" strokeWidth="3" opacity=".9" />
            <ellipse cx="47" cy="50" rx="4" ry="7.5" fill="#fff" />
            <ellipse cx="73" cy="50" rx="4" ry="7.5" fill="#fff" />
            <path d="M36 66Q60 92 84 66M32 63L39 69M88 63L81 69" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </>
        ),
      }
    case "heart":
      return {
        shape: (
          <>
            <path d={HEART} />
            <path d={sparkle(100, 20, 14)} />
            <path d={sparkle(18, 92, 10)} />
          </>
        ),
        art: (
          <>
            <path d={HEART} fill="#1d4ed8" />
            <path d="M30 42Q32 30 45 29" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" opacity=".9" />
            <path d={sparkle(100, 20, 14)} fill="#bfdbfe" />
            <path d={sparkle(18, 92, 10)} fill="#bfdbfe" />
          </>
        ),
      }
    case "bubble":
      return {
        shape: <path d={BUBBLE} />,
        art: (
          <>
            <path d={BUBBLE} fill="#93c5fd" />
            <ScriptText text={text ?? "hi!"} cx={60} cy={53} w={text ? 76 : 44} color="#1e3a8a" stroke={3.6} />
          </>
        ),
      }
    case "daisy": {
      const petals = Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx="60" cy="31" rx="13" ry="22" transform={"rotate(" + i * 40 + " 60 60)"} />
      ))
      return {
        shape: <>{petals}</>,
        art: (
          <>
            <g fill="#bfdbfe">{petals}</g>
            <circle cx="60" cy="60" r="19" fill="#2563eb" />
            <circle cx="53.5" cy="57" r="2.6" fill="#ffffff" />
            <circle cx="66.5" cy="57" r="2.6" fill="#ffffff" />
            <path d="M53 65Q60 71 67 65" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          </>
        ),
      }
    }
    case "camera":
      return {
        shape: (
          <>
            <rect x="12" y="36" width="96" height="66" rx="16" />
            <rect x="38" y="24" width="36" height="20" rx="6" />
          </>
        ),
        art: (
          <>
            <rect x="12" y="36" width="96" height="66" rx="16" fill="#1e293b" />
            <rect x="38" y="24" width="36" height="20" rx="6" fill="#1e293b" />
            <circle cx="60" cy="70" r="24" fill="#fff" />
            <circle cx="60" cy="70" r="17" fill="#1e293b" />
            <circle cx="60" cy="70" r="11" fill="#3b82f6" />
            <circle cx="55" cy="65" r="4" fill="#fff" />
            <rect x="86" y="46" width="12" height="7" rx="3" fill="#60a5fa" />
            <path d="M22 50H30" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".5" />
          </>
        ),
      }
    case "bolt":
    default:
      return {
        shape: <path d={BOLT} />,
        art: (
          <>
            <path d={BOLT} fill="#3b82f6" />
            <path d="M66 20L38 58" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".75" />
          </>
        ),
      }
  }
}

export const ICONS: Record<SocialKind, React.ReactNode> = {
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="M8 10.5V16.5M12 16.5V10.5M12 13.2C12 11.6 13.1 10.4 14.6 10.4C16.1 10.4 17 11.4 17 13.1V16.5" />
      <path className="ssf-dot" d="M8 7.4L8 7.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5.2" />
      <circle cx="12" cy="12" r="3.8" />
      <path className="ssf-dot" d="M16.9 7.1L16.9 7.2" />
    </>
  ),
  tiktok: <path d="M13.6 4V15A3.3 3.3 0 1 1 10.3 11.7M13.6 4C14 6.6 15.8 8.2 18.4 8.4" />,
  x: <path d="M5 4.5H8.8L19 19.5H15.2ZM18.6 4.5L13.3 10.5M5.4 19.5L10.7 13.5" />,
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12.4" rx="4" />
      <path d="M10.4 9.6L14.6 12.2L10.4 14.8Z" />
    </>
  ),
  dribbble: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M7.4 4.9C11 9 13.6 14 15 20.2M3.6 10.6C9 11 14 9.6 18 6.2M5.6 17.6C8.6 14 13 12.6 20.4 13.4" />
    </>
  ),
}
