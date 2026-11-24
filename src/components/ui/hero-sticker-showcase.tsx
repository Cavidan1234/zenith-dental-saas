"use client"

import * as React from "react"
import { layoutScript, starPath, round, clamp, StickerKind } from "./sticker-slap-footer"
import {
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react"

const STROKE = 4.2
const SLANT = 0.1584
const BURST = starPath(13, 54, 39, 60, 60, 0.2, 4)
const BOLT = "M70 8L26 66H55L44 112L94 48H64Z"
const HEART = "M60 100C22 76 10 56 18 38C26 20 50 18 60 38C70 18 94 20 102 38C110 56 98 76 60 100Z"
const BUBBLE = "M24 22H96A14 14 0 0 1 110 36V70A14 14 0 0 1 96 84H56L34 102L38 84H24A14 14 0 0 1 10 70V36A14 14 0 0 1 24 22Z"
const BADGE = starPath(8, 52, 42, 60, 60, 0.1, 2)
// Custom Stylized 3D Molar Tooth Path
const TOOTH = "M32 18 C16 18 10 32 10 50 C10 70 18 88 28 104 C34 114 44 112 47 96 C50 82 50 68 60 68 C70 68 70 82 73 96 C76 112 86 114 92 104 C102 88 110 70 110 50 C110 32 104 18 88 18 C76 18 68 28 60 28 C52 28 44 18 32 18 Z"

function HeroStickerArt(kind: StickerKind | "badge" | "tooth", text?: string): { shape: React.ReactNode; art: React.ReactNode } {
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
            {/* Specular enamel reflection */}
            <path d="M22 36 C18 48 20 62 26 72" fill="none" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" opacity=".8" />
            {/* 4-point sparkle diamond in upper right */}
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
            <path d="M36 66Q60 92 84 66" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
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

interface HeroStudioProps {
  onOpenBooking: (serviceId?: string, doctorId?: string) => void
  lang?: 'en' | 'az' | 'ru'
}

export default function HeroStickerShowcase({ onOpenBooking }: HeroStudioProps) {
  const [mounted, setMounted] = React.useState(false)
  const [animReady, setAnimReady] = React.useState(false)
  const [run, setRun] = React.useState(0)
  const [activeDragId, setActiveDragId] = React.useState<number | null>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const wordmark = "zenith"
  const word = React.useMemo(() => layoutScript(wordmark), [wordmark])

  const pad = STROKE / 2 + 0.6
  const vbX = -1.4 - pad
  const vbY = word.top - pad
  const vbW = Math.max(word.width, 1) + 2.8 + pad * 2 - word.top * SLANT
  const vbH = word.bottom + pad - vbY

  // Stickers scattered cleanly along LEFT and RIGHT flanks away from central text/buttons
  const rawStickers = [
    { kind: "tooth" as const, text: "SMILE", label: "Precision Tooth & Ceramic Mastery", homeX: 8, homeY: 26, rotate: -14 },
    { kind: "heart" as StickerKind, label: "Aesthetic Smile Design", homeX: 10, homeY: 54, rotate: 12 },
    { kind: "burst" as StickerKind, text: "HARLEY ST", label: "Harley Street Excellence", homeX: 9, homeY: 82, rotate: -8 },
    { kind: "smiley" as StickerKind, label: "Painless Guarantee", homeX: 92, homeY: 24, rotate: 14 },
    { kind: "bubble" as StickerKind, text: "3D SCAN", label: "Digital CBCT Scan", homeX: 90, homeY: 52, rotate: -12 },
    { kind: "badge" as const, label: "Zero Wait Guarantee", homeX: 91, homeY: 80, rotate: 16 },
  ]

  const [moved, setMoved] = React.useState<Record<number, { x: number; y: number }>>({})
  const [order, setOrder] = React.useState<number[]>([])
  const drag = React.useRef<{
    i: number
    id: number
    sx: number
    sy: number
    px: number
    py: number
    lx: number
    t: number
    tilt: number
    w: number
    h: number
    went: boolean
  } | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Automatically measure and trigger marker stroke write animation on page load
  React.useEffect(() => {
    if (!mounted || !svgRef.current) return
    const paths = svgRef.current.querySelectorAll<SVGPathElement>("path[data-draw]")
    paths.forEach((p) => {
      const len = Math.ceil(p.getTotalLength()) + 4
      p.style.setProperty("--len", `${len}px`)
    })
    const t = setTimeout(() => {
      setAnimReady(true)
    }, 60)
    return () => clearTimeout(t)
  }, [mounted, run])

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-[#1e40af] flex items-center justify-center text-white font-bold text-sm">
        <Sparkles className="w-5 h-5 mr-2 animate-spin text-cyan-300" />
        Loading Zenith Harley Street Studio...
      </div>
    )
  }

  const items = rawStickers.map((spec, i) => {
    const home = { x: spec.homeX, y: spec.homeY }
    return {
      i,
      kind: spec.kind,
      text: spec.text,
      label: spec.label,
      home,
      at: moved[i] ?? home,
      rotate: spec.rotate,
    }
  })

  const raise = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i])

  const onDown = (e: React.PointerEvent<HTMLButtonElement>, i: number) => {
    if (e.button !== 0 || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    const at = items[i].at
    e.currentTarget.setPointerCapture(e.pointerId)
    setActiveDragId(i)
    drag.current = {
      i,
      id: e.pointerId,
      sx: at.x,
      sy: at.y,
      px: e.clientX,
      py: e.clientY,
      lx: e.clientX,
      t: performance.now(),
      tilt: 0,
      w: r.width,
      h: r.height,
      went: false,
    }
    raise(i)
  }

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    if (!d.went && Math.hypot(dx, dy) < 4) return
    const host = e.currentTarget.parentElement
    if (!host) return
    d.went = true
    const x = clamp(d.sx + (dx / d.w) * 100, 2, 98)
    const y = clamp(d.sy + (dy / d.h) * 100, -50, 95)
    host.style.left = x + "%"
    host.style.top = y + "%"

    const now = performance.now()
    const v = (e.clientX - d.lx) / Math.max(1, now - d.t)
    d.tilt = d.tilt * 0.75 + clamp(v * 22, -26, 26) * 0.25
    d.lx = e.clientX
    d.t = now
    host.style.setProperty("--tilt", d.tilt.toFixed(2) + "deg")
  }

  const onUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    setActiveDragId(null)
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    const host = e.currentTarget.parentElement
    host?.style.setProperty("--tilt", "0deg")
    if (d.went && host) {
      setMoved((m) => ({ ...m, [d.i]: { x: parseFloat(host.style.left), y: parseFloat(host.style.top) } }))
    }
  }

  const goHome = (i: number) => {
    setMoved((m) => {
      const next = { ...m }
      delete next[i]
      return next
    })
  }

  const rewriteWordmark = () => {
    setAnimReady(false)
    setRun((r) => r + 1)
  }

  return (
    <div
      ref={stageRef}
      className="relative w-full h-full min-h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center text-white pt-8 sm:pt-12 pb-3 px-4 sm:px-6 lg:px-8 overflow-hidden select-none box-border"
    >
      <style>{`
        /* Smooth entrance animations */
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes hero-marker-write {
          0% {
            stroke-dashoffset: var(--len, 2800px);
            opacity: 0.1;
          }
          10% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes sticker-slap-drop {
          0% {
            opacity: 0;
            transform: translate3d(0, -30%, 0) scale(2.2) rotate(24deg);
          }
          55% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(0.92) rotate(-3deg);
          }
          80% {
            transform: scale(1.04) rotate(1deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
        }
        /* FLOW BUTTON: Mesmerizing animated fluid gradient shine */
        @keyframes flowGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes flowGlow {
          0%, 100% {
            box-shadow: 0 0 28px -3px rgba(147, 197, 253, 0.65), 0 12px 28px -5px rgba(15, 23, 42, 0.45);
          }
          50% {
            box-shadow: 0 0 45px 3px rgba(96, 165, 250, 0.9), 0 18px 34px -5px rgba(30, 58, 138, 0.55);
          }
        }
        /* LIQUID METAL RING: Real-time White & Electric Blue Molten Fluid Ring */
        @keyframes liquidMetalSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .liquid-metal-frame {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 3.5px;
          border-radius: 9999px;
          overflow: hidden;
          box-shadow: 0 0 24px -2px rgba(56, 189, 248, 0.7), 0 8px 28px rgba(37, 99, 235, 0.4);
          transform: translateZ(0);
          will-change: transform;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .liquid-metal-frame::before {
          content: '';
          position: absolute;
          top: -150%;
          left: -150%;
          width: 400%;
          height: 400%;
          background: conic-gradient(
            from 0deg,
            #ffffff 0deg,
            #38bdf8 30deg,
            #ffffff 65deg,
            #1d4ed8 105deg,
            #67e8f9 145deg,
            #ffffff 180deg,
            #2563eb 215deg,
            #e0f2fe 250deg,
            #ffffff 285deg,
            #0284c7 325deg,
            #ffffff 360deg
          );
          animation: liquidMetalSpin 4s linear infinite;
          transform: translateZ(0);
          will-change: transform;
          z-index: 1;
        }
        .liquid-metal-frame:hover {
          transform: translate3d(0, -1px, 0);
          box-shadow: 0 0 32px 0px rgba(56, 189, 248, 0.85), 0 10px 34px rgba(37, 99, 235, 0.5);
        }
        .liquid-metal-frame:hover::before {
          animation-duration: 2s;
        }

        .flow-button {
          position: relative;
          z-index: 2;
          background: linear-gradient(115deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #bae6fd 75%, #ffffff 100%);
          background-size: 260% 260%;
          will-change: background-position;
          animation: flowGradient 4s ease infinite;
          transform: translateZ(0);
        }
        .flow-button:hover {
          animation-duration: 2s;
        }

        /* UIVERSE.IO EXPANDING CIRCLE BUTTON (cssbuttons-io) - WHITE THEME (Optimized 120 FPS Snappy) */
        .learn-more {
          position: relative;
          display: inline-block;
          cursor: pointer;
          outline: none;
          border: 0;
          vertical-align: middle;
          text-decoration: none;
          background: transparent;
          padding: 0;
          font-size: inherit;
          font-family: inherit;
          width: 14.5rem;
          height: 3.375rem;
          transform: translateZ(0);
        }

        .learn-more .circle {
          transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          display: block;
          margin: 0;
          width: 3.375rem;
          height: 3.375rem;
          background: #ffffff;
          border-radius: 1.6875rem;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18), 0 0 12px rgba(255, 255, 255, 0.35);
          will-change: width;
          transform: translateZ(0);
        }

        .learn-more .circle .icon {
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), background 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          background: #1e3a8a;
          will-change: transform;
        }

        .learn-more .circle .icon.arrow {
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), background 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          left: 0.95rem;
          width: 1.125rem;
          height: 0.125rem;
          background: none;
          will-change: transform;
        }

        .learn-more .circle .icon.arrow::before {
          position: absolute;
          content: "";
          top: -0.29rem;
          right: 0.0625rem;
          width: 0.625rem;
          height: 0.625rem;
          border-top: 0.125rem solid #1e3a8a;
          border-right: 0.125rem solid #1e3a8a;
          transform: rotate(45deg);
        }

        .learn-more .button-text {
          transition: color 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 0 2.2rem;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          white-space: nowrap;
          z-index: 2;
          pointer-events: none;
        }

        .learn-more:hover .circle {
          width: 100%;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22), 0 0 24px rgba(255, 255, 255, 0.5);
        }

        .learn-more:hover .circle .icon.arrow {
          background: #1e3a8a;
          transform: translate(1rem, 0);
        }

        .learn-more:hover .button-text {
          color: #1e3a8a;
        }

        /* Ambient floating corner bubbles */
        @keyframes bubbleFloat1 {
          0%, 100% { transform: translate3d(0, 0px, 0) rotate(0deg); }
          50% { transform: translate3d(0, -12px, 0) rotate(4deg); }
        }
        @keyframes bubbleFloat2 {
          0%, 100% { transform: translate3d(0, 0px, 0) rotate(0deg); }
          50% { transform: translate3d(0, 10px, 0) rotate(-4deg); }
        }
        .bubble-float-1 { animation: bubbleFloat1 7.5s ease-in-out infinite; will-change: transform; }
        .bubble-float-2 { animation: bubbleFloat2 9s ease-in-out infinite; will-change: transform; }
        .bubble-float-3 { animation: bubbleFloat1 6.5s ease-in-out infinite 1.2s; will-change: transform; }

        /* Hand-drawn blue pencil underline animation */
        @keyframes pencilSketch {
          0% {
            stroke-dasharray: 260;
            stroke-dashoffset: 260;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        .pencil-draw-1 {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: pencilSketch 1.2s cubic-bezier(0.2, 0.8, 0.25, 1) 0.3s forwards;
        }
        .pencil-draw-2 {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: pencilSketch 1.1s cubic-bezier(0.2, 0.8, 0.25, 1) 0.55s forwards;
        }

        /* Continuous non-stop falling speed streaks (Zero pause, seamless linear loop) */
        @keyframes continuousDrop1 {
          0% {
            stroke-dashoffset: 60;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes continuousDrop2 {
          0% {
            stroke-dashoffset: 70;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes continuousDrop3 {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .continuous-drop-1 {
          stroke-dasharray: 30 30;
          animation: continuousDrop1 0.75s linear infinite;
        }
        .continuous-drop-2 {
          stroke-dasharray: 35 35;
          animation: continuousDrop2 0.65s linear infinite;
        }
        .continuous-drop-3 {
          stroke-dasharray: 25 25;
          animation: continuousDrop3 0.85s linear infinite;
        }

        .hero-script-draw {
          stroke-dasharray: var(--len, 2800px);
          stroke-dashoffset: var(--len, 2800px);
          animation: hero-marker-write 2.2s cubic-bezier(0.5, 0.1, 0.3, 1) 0.2s forwards;
        }
        .sticker-initial-slap {
          animation: sticker-slap-drop 0.75s cubic-bezier(0.3, 1.4, 0.4, 1) both;
        }
        .sticker-sheen {
          transform: translateX(-150%);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .group:hover .sticker-sheen {
          transform: translateX(150%);
        }
        /* HARDWARE-ACCELERATED KINETIC TYPOGRAPHY & ELEMENT REVEAL (120 FPS Pure GPU) */
        @keyframes blurSlideIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 16px, 0) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .hero-blur-word-1 { animation: blurSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both; will-change: transform, opacity; }
        .hero-blur-word-2 { animation: blurSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both; will-change: transform, opacity; }
        .hero-blur-word-3 { animation: blurSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; will-change: transform, opacity; }
        .hero-blur-word-4 { animation: blurSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both; will-change: transform, opacity; }
        .hero-blur-word-5 { animation: blurSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both; will-change: transform, opacity; }
        .hero-blur-word-6 { animation: blurSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.30s both; will-change: transform, opacity; }
        .hero-blur-sub { animation: blurSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both; will-change: transform, opacity; }
        .hero-blur-cta { animation: blurSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both; will-change: transform, opacity; }
      `}</style>

      {/* CORNER AMBIENT GLASS BUBBLES (Optimized Translucent Luster, Zero Backdrop Drag) */}
      {/* Top Left Bubbles */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-400/10 to-transparent border border-white/20 shadow-[inset_0_4px_25px_rgba(255,255,255,0.35),0_16px_36px_rgba(0,0,0,0.15)] bubble-float-1 pointer-events-none transform-gpu will-change-transform" />
      <div className="absolute top-28 left-20 w-14 h-14 rounded-full bg-white/12 border border-white/20 shadow-inner bubble-float-2 pointer-events-none transform-gpu will-change-transform" />

      {/* Top Right Bubbles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-bl from-blue-300/18 via-cyan-400/12 to-transparent border border-white/20 shadow-[inset_0_4px_25px_rgba(255,255,255,0.35),0_16px_36px_rgba(0,0,0,0.15)] bubble-float-2 pointer-events-none transform-gpu will-change-transform" />
      <div className="absolute top-36 right-24 w-18 h-18 rounded-full bg-white/10 border border-white/20 shadow-inner bubble-float-1 pointer-events-none transform-gpu will-change-transform" />

      {/* Bottom Left Bubble */}
      <div className="absolute bottom-16 -left-10 w-36 h-36 rounded-full bg-gradient-to-tr from-brand-400/18 via-cyan-300/10 to-transparent border border-white/15 shadow-lg bubble-float-3 pointer-events-none transform-gpu will-change-transform" />

      {/* Bottom Right Bubble */}
      <div className="absolute bottom-12 -right-8 w-40 h-40 rounded-full bg-gradient-to-tl from-cyan-300/18 via-blue-300/10 to-transparent border border-white/15 shadow-lg bubble-float-1 pointer-events-none transform-gpu will-change-transform" />

      {/* 1. UPPER EDITORIAL SECTION (Pristine, Clear, Perfectly Balanced) */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 sm:space-y-6 pt-3 sm:pt-6">
        
        {/* Main Centered Headline with Kinetic Blur-to-Focus Words and Artistic Blue Pencil Underline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15] max-w-4xl drop-shadow-[0_4px_16px_rgba(10,20,60,0.6)]">
          <span className="hero-blur-word-1 relative inline-block whitespace-nowrap">
            World-Class
            <svg
              className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3.5 sm:h-5 text-cyan-400 pointer-events-none overflow-visible"
              viewBox="0 0 250 16"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 3 11 C 55 4, 135 3, 246 8"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pencil-draw-1"
              />
              <path
                d="M 18 14 C 85 9, 175 8, 238 12"
                stroke="#60a5fa"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pencil-draw-2"
                opacity="0.85"
              />
            </svg>
          </span>{' '}
          <span className="hero-blur-word-2 inline-block">Dental</span>{' '}
          <span className="hero-blur-word-3 inline-block">Care.</span>{' '}
          <span className="text-cyan-300 block sm:inline mt-1 sm:mt-0">
            <span className="hero-blur-word-4 inline-block">Zero</span>{' '}
            <span className="hero-blur-word-5 inline-block">Wait</span>{' '}
            <span className="hero-blur-word-6 inline-block">Times.</span>
          </span>
        </h1>

        {/* Subtitle with Kinetic Blur-to-Focus Dissolve */}
        <p className="hero-blur-sub text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl leading-relaxed font-normal drop-shadow-sm pt-1">
          Experience pain-free cosmetic, implant, and general dentistry with cutting-edge 3D intraoral diagnostics and personalized care in Marylebone.
        </p>

        {/* Action Buttons with Kinetic Rise */}
        <div className="hero-blur-cta flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2 sm:pt-3">
          {/* LIQUID METAL BUTTON: Real-time White & Blue Liquid Chrome Ring */}
          <div className="liquid-metal-frame active:scale-95 transition-transform duration-200">
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="flow-button group relative overflow-hidden inline-flex items-center justify-center px-9 sm:px-10 py-4 sm:py-4.5 rounded-full text-base sm:text-lg font-black text-blue-950 cursor-pointer shadow-lg"
            >
              {/* Sliding text mask container */}
              <div className="relative overflow-hidden flex items-center justify-center h-7 min-w-[225px] sm:min-w-[240px] pointer-events-none">
                {/* Default layer: snappy 300ms slide */}
                <span className="inline-flex items-center justify-center gap-2.5 w-full pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[150%] will-change-transform">
                  <Calendar className="w-5 h-5 text-brand-700 shrink-0" />
                  <span className="tracking-tight whitespace-nowrap">
                    Book Your Visit Online
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-700 shrink-0" />
                </span>

                {/* Incoming clone layer: snappy 300ms slide */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 inline-flex items-center justify-center gap-2.5 w-full pointer-events-none -translate-x-[150%] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 will-change-transform"
                >
                  <Calendar className="w-5 h-5 text-brand-700 shrink-0" />
                  <span className="tracking-tight whitespace-nowrap">
                    Book Your Visit Online
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-700 shrink-0" />
                </span>
              </div>
            </button>
          </div>

          {/* Secondary Action: Uiverse.io Expanding Circle Button (cssbuttons-io) */}
          <a
            href="#doctors"
            className="learn-more select-none active:scale-95 transition-transform"
            aria-label="Meet Specialists"
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow" />
            </span>
            <span className="button-text">
              Meet Specialists
            </span>
          </a>
        </div>
      </div>

      {/* 2. LOWER SECTION: Grand Hand-drawn Calligraphy "zenith" in Pure Solid White (NO SMALL WRITING BENEATH) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-end pb-3 mt-auto">
        {/* Interactive SVG Stage (Solid White Script) */}
        <div className="relative w-full h-[190px] sm:h-[240px] lg:h-[290px] flex items-center justify-center select-none">
          {/* BACKGROUND: Pure Solid White Hand-drawn Calligraphy "zenith" (100% NON-TRANSPARENT) */}
          <svg
            key={run}
            ref={svgRef}
            className="w-full h-full text-white select-none cursor-pointer outline-none focus:outline-none"
            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            viewBox={[vbX, vbY, vbW, vbH].map(round).join(" ")}
            aria-hidden="true"
            onClick={rewriteWordmark}
          >
            <title>Click to write signature again</title>
            <g transform="skewX(-9)">
              <path
                data-draw
                d={word.main}
                fill="none"
                stroke="#ffffff"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={animReady ? "hero-script-draw" : "opacity-0"}
              />
              {word.extra.map((d, k) => (
                <path
                  key={k}
                  data-draw
                  d={d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={animReady ? "hero-script-draw" : "opacity-0"}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* DIE-CUT DRAGGABLE STICKERS: Scattered along LEFT and RIGHT flanks with White & Blue Motion Drop Streaks */}
      {items.map((s, idx) => {
        const { shape, art } = HeroStickerArt(s.kind, s.text)
        const stickerId = `bg-hero-st-${s.i}`
        const slapDelay = `${0.65 + idx * 0.14}s`
        const isDragging = activeDragId === s.i

        return (
          <div
            key={s.i}
            className={`absolute select-none touch-none -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group z-20 transform-gpu will-change-transform ${
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
            {/* 2-3 Bold Falling Lines: Peeking slightly beyond top and bottom edges directly behind sticker */}
            <div
              className={`absolute -inset-x-1 -inset-y-3 pointer-events-none transition-all duration-300 -z-10 flex items-center justify-center ${
                isDragging ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              <svg viewBox="0 0 100 115" className="w-full h-full overflow-visible filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]" fill="none">
                {/* Line 1: Bold white falling streak (Left, medium) */}
                <path
                  d="M 28 6 L 28 108"
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="continuous-drop-1"
                />

                {/* Line 2: Thick electric cyan/blue falling streak (Center, slightly longer) */}
                <path
                  d="M 52 -2 L 52 116"
                  stroke="#38bdf8"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  className="continuous-drop-2"
                />

                {/* Line 3: Shorter white falling streak (Right, short) */}
                <path
                  d="M 74 14 L 74 98"
                  stroke="#ffffff"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  className="continuous-drop-3"
                />
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

                  {/* Thick Die-cut white border */}
                  <g fill="#ffffff" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round">
                    {shape}
                  </g>

                  {/* Sticker Content */}
                  {art}

                  {/* Holographic light sheen reflection */}
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
      })}
    </div>
  )
}
