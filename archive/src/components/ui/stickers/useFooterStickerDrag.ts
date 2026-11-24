"use client"

import * as React from "react"
import { clamp, round } from "./sticker-script-engine"
import { FooterStickerItem } from "./FooterStage"

type Placed = { x: number; y: number }

const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const wiggle = (el: Element | null, frames: Keyframe[], duration: number) => {
  if (!reduced()) (el as HTMLElement | null)?.animate?.(frames, { duration, easing: "cubic-bezier(.3,1.4,.4,1)" })
}

const slapFrames: Keyframe[] = [
  { transform: "scale(1.14)" },
  { transform: "scale(.93,1.04)", offset: 0.4 },
  { transform: "scale(1.02,.98)", offset: 0.7 },
  { transform: "none" },
]

const shakeFrames: Keyframe[] = [
  { transform: "none" },
  { transform: "rotate(-14deg) scale(1.1)", offset: 0.3 },
  { transform: "rotate(9deg)", offset: 0.6 },
  { transform: "none" },
]

export function useFooterStickerDrag(
  stageRef: React.RefObject<HTMLDivElement>,
  items: FooterStickerItem[],
  onStickerMove?: (index: number, xPct: number, yPct: number) => void,
) {
  const [moved, setMoved] = React.useState<Record<number, Placed>>({})
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

  const raise = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i])

  const putAt = (i: number, p: Placed, announce: boolean = true) => {
    setMoved((m) => ({ ...m, [i]: p }))
    if (announce) onStickerMove?.(i, round(p.x), round(p.y))
  }

  const onDown = (e: React.PointerEvent<HTMLButtonElement>, i: number) => {
    if (e.button !== 0 || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    const at = items[i].at
    e.currentTarget.setPointerCapture(e.pointerId)
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
    if (!d.went) host.classList.add("is-drag")
    d.went = true
    const x = clamp(d.sx + (dx / d.w) * 100, 1, 99)
    const y = clamp(d.sy + (dy / d.h) * 100, -70, 96)
    host.style.left = x + "%"
    host.style.top = y + "%"
    const now = performance.now()
    const v = (e.clientX - d.lx) / Math.max(1, now - d.t)
    d.tilt = d.tilt * 0.75 + clamp(v * 22, -24, 24) * 0.25
    d.lx = e.clientX
    d.t = now
    host.style.setProperty("--tilt", d.tilt.toFixed(2) + "deg")
  }

  const onUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    const host = e.currentTarget.parentElement
    host?.classList.remove("is-drag")
    host?.style.setProperty("--tilt", "0deg")
    const lift = e.currentTarget.querySelector(".ssf-st-lift")
    if (d.went && host) {
      putAt(d.i, { x: parseFloat(host.style.left), y: parseFloat(host.style.top) })
      wiggle(lift, slapFrames, 420)
    } else {
      wiggle(lift, shakeFrames, 520)
    }
  }

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.shiftKey ? 6 : 2
    const at = items[i].at
    const go: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    if (go[e.key]) {
      e.preventDefault()
      raise(i)
      putAt(i, { x: clamp(at.x + go[e.key][0], 1, 99), y: clamp(at.y + go[e.key][1], -70, 96) })
    } else if (e.key === "Home" || e.key === "Escape") {
      e.preventDefault()
      goHome(i, e.currentTarget)
    }
  }

  const goHome = (i: number, btn: HTMLElement) => {
    setMoved((m) => {
      const next = { ...m }
      delete next[i]
      return next
    })
    onStickerMove?.(i, round(items[i].home.x), round(items[i].home.y))
    wiggle(btn.querySelector(".ssf-st-lift"), slapFrames, 420)
  }

  return {
    moved,
    order,
    onDown,
    onMove,
    onUp,
    onKey,
    goHome,
  }
}
