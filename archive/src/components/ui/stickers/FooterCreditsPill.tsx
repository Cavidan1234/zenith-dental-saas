"use client"

import * as React from "react"
import { Credit } from "./sticker-footer-art"
import { round } from "./sticker-script-engine"

interface FooterCreditsPillProps {
  credits: Credit[]
  endAt: number
}

export function FooterCreditsPill({ credits, endAt }: FooterCreditsPillProps) {
  const [open, setOpen] = React.useState(false)
  const popRef = React.useRef<HTMLDivElement>(null)

  if (credits.length === 0) return null

  return (
    <div className="ssf-credits" ref={popRef}>
      {open && (
        <ul className="ssf-pop">
          {credits.map((c, i) => (
            <li key={i}>
              <b>{c.role}</b>
              <strong>{c.name}</strong>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="ssf-pill"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ "--end": round(endAt) + "s" } as React.CSSProperties}
      >
        practice credentials
      </button>
    </div>
  )
}
