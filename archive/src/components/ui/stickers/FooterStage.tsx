"use client"

import * as React from "react"
import { round } from "./sticker-script-engine"
import { StickerSvg } from "./StickerSvg"
import { StickerKind } from "./sticker-script-engine"

export interface FooterStickerItem {
  i: number
  kind: StickerKind
  text?: string
  node?: React.ReactNode
  label: string
  home: { x: number; y: number }
  at: { x: number; y: number }
  rotate: number
  depth: number
  size: number
  delay: number
}

interface FooterStageProps {
  stageRef: React.RefObject<HTMLDivElement>
  vbX: number
  vbY: number
  vbW: number
  vbH: number
  cutH: number
  wordmark: string
  run: number
  word: { main: string; extra: string[]; width: number; top: number; bottom: number }
  drawDur: number
  writeAt: number
  items: FooterStickerItem[]
  order: number[]
  onDown: (e: React.PointerEvent<HTMLButtonElement>, i: number) => void
  onMove: (e: React.PointerEvent<HTMLButtonElement>) => void
  onUp: (e: React.PointerEvent<HTMLButtonElement>) => void
  goHome: (i: number, btn: HTMLElement) => void
  onKey: (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => void
  replay: () => void
}

export function FooterStage({
  stageRef,
  vbX,
  vbY,
  vbW,
  vbH,
  cutH,
  wordmark,
  run,
  word,
  drawDur,
  writeAt,
  items,
  order,
  onDown,
  onMove,
  onUp,
  goHome,
  onKey,
  replay,
}: FooterStageProps) {
  return (
    <div className="ssf-stage">
      <div className="ssf-stage-in" ref={stageRef} style={{ marginBottom: round(-((vbH - cutH) / vbW) * 100) + "%" }}>
        <button type="button" className="ssf-wm-btn" onClick={replay} aria-label={"Write " + wordmark + " again"}>
          <svg key={run} className="ssf-wm" viewBox={[vbX, vbY, vbW, vbH].map(round).join(" ")} aria-hidden="true" focusable="false">
            <g transform={"skewX(-9)"}>
              <path d={word.main} data-draw="" style={{ "--dur": drawDur + "s", "--at": writeAt + "s" } as React.CSSProperties} />
              {word.extra.map((d, k) => (
                <path
                  key={k}
                  d={d}
                  data-draw=""
                  style={{ "--dur": ".28s", "--at": round(writeAt + drawDur + k * 0.16) + "s" } as React.CSSProperties}
                />
              ))}
            </g>
          </svg>
        </button>

        {items.map((s) => (
          <div
            key={s.i}
            className="ssf-st"
            style={
              {
                left: s.at.x + "%",
                top: s.at.y + "%",
                width: "max(" + round(s.size) + "cqw, 46px)",
                zIndex: 3 + Math.max(0, order.indexOf(s.i) + 1),
                "--r": s.rotate + "deg",
                "--d": s.depth,
                "--at": round(s.delay) + "s",
              } as React.CSSProperties
            }
          >
            <button
              type="button"
              className="ssf-st-btn"
              aria-label={s.label + ". Drag, or use the arrow keys, to move it. Escape puts it back."}
              onPointerDown={(e) => onDown(e, s.i)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onDoubleClick={(e) => goHome(s.i, e.currentTarget)}
              onKeyDown={(e) => onKey(e, s.i)}
            >
              <span key={run} className="ssf-st-slap">
                <span className="ssf-st-lift">{s.node ?? <StickerSvg kind={s.kind} text={s.text} />}</span>
              </span>
            </button>
            <span key={"r" + run} className="ssf-ring" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}
