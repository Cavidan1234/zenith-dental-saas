"use client"

import * as React from "react"
import { starPath } from "./sticker-script-engine"
import { linkProps } from "./footer-defaults"

interface FooterTopNavProps {
  navHref?: string
  navLabel?: string
  homeHref?: string
  chatHref?: string
  chatLabel?: string
  wordmark: string
  smallVb: string
  small: { main: string; extra: string[] }
}

export function FooterTopNav({
  navHref,
  navLabel,
  homeHref,
  chatHref,
  chatLabel,
  wordmark,
  smallVb,
  small,
}: FooterTopNavProps) {
  return (
    <div className="ssf-top">
      {navLabel ? (
        <a className="ssf-nav" {...linkProps(navHref)}>
          <svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
            <path d={starPath(11, 48, 30, 0, 0, 0.3, 7)} fill="currentColor" />
          </svg>
          <span>{navLabel}</span>
        </a>
      ) : (
        <span />
      )}
      <a className="ssf-logo" {...linkProps(homeHref)} aria-label={wordmark + ", home"}>
        <svg viewBox={smallVb} aria-hidden="true" focusable="false">
          <path d={small.main + small.extra.join("")} data-draw="" transform="skewX(-9)" />
        </svg>
      </a>
      {chatHref ? (
        <a className="ssf-chat" {...linkProps(chatHref)} aria-label={chatLabel || "Message us"}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 2.6A9.4 9.4 0 0 0 3.9 16.8L2.7 21.3L7.3 20.1A9.4 9.4 0 1 0 12 2.6Z" fill="currentColor" />
            <path
              d="M8.6 7.6C9.2 7.2 9.7 7.4 10 8L10.6 9.5C10.8 10 10.5 10.4 10.1 10.8C10.8 12.2 11.8 13.2 13.2 13.9C13.6 13.5 14 13.2 14.5 13.4L16 14C16.6 14.3 16.8 14.8 16.4 15.4C15.7 16.4 14.6 16.8 13.4 16.3C10.6 15.2 8.8 13.4 7.7 10.6C7.2 9.4 7.6 8.3 8.6 7.6Z"
              fill="var(--ssf-paper)"
            />
          </svg>
        </a>
      ) : (
        <span />
      )}
    </div>
  )
}
