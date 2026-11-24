"use client"

import * as React from "react"
import { Job, Social, ICONS } from "./sticker-footer-art"

const SQUIGGLE = "M1 5C7 1 11 1 15 4S24 8 29 4S38 0 43 4S52 8 57 4S66 0 71 4S80 8 87 4"

const isExternal = (href?: string) => !!href && /^https?:/.test(href)
const linkProps = (href?: string) => ({
  href,
  ...(isExternal(href) ? { target: "_blank", rel: "noreferrer noopener" } : {}),
})

interface FooterColsProps {
  jobs: Job[]
  jobsLabel: string
  address: string[]
  officeLabel: string
  mapHref?: string
  mapLabel?: string
  email?: string
  copied: number
  copy: () => void
  copiedLabel: string
  chatHref?: string
  chatLabel?: string
  note?: string
  contactLabel: string
  socials: Social[]
}

export function FooterCols({
  jobs,
  jobsLabel,
  address,
  officeLabel,
  mapHref,
  mapLabel,
  email,
  copied,
  copy,
  copiedLabel,
  chatHref,
  chatLabel,
  note,
  contactLabel,
  socials,
}: FooterColsProps) {
  const cols: React.ReactNode[] = []

  if (jobs.length) {
    cols.push(
      <div className="ssf-col" key="jobs">
        <h3 className="ssf-tag">{jobsLabel}</h3>
        <ul className="ssf-big">
          {jobs.map((j, i) => (
            <li key={i} className="ssf-line" style={{ "--i": i } as React.CSSProperties}>
              {j.href ? <a {...linkProps(j.href)}>{j.title}</a> : <span>{j.title}</span>}
            </li>
          ))}
        </ul>
      </div>,
    )
  }

  if (address.length) {
    cols.push(
      <div className="ssf-col" key="office">
        <h3 className="ssf-tag">{officeLabel}</h3>
        <address className="ssf-big" style={{ fontStyle: "normal" }}>
          {address.map((l, i) => (
            <span key={i} className="ssf-line" style={{ "--i": i } as React.CSSProperties}>
              <span>{l}</span>
            </span>
          ))}
        </address>
        {mapLabel && (
          <a className="ssf-map" {...linkProps(mapHref)}>
            {mapLabel}
            <svg viewBox="0 0 88 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d={SQUIGGLE} data-draw="" />
            </svg>
          </a>
        )}
      </div>,
    )
  }

  if (email || chatHref || socials.length) {
    cols.push(
      <div className="ssf-col" key="contact">
        <h3 className="ssf-tag">{contactLabel}</h3>
        <ul className="ssf-big">
          {email && (
            <li className="ssf-line" style={{ "--i": 0 } as React.CSSProperties}>
              <button type="button" className={"ssf-copy" + (copied ? " is-copied" : "")} onClick={copy} title="Copy email address">
                <span className="ssf-addr">{email}</span>
                <span className="ssf-done" aria-hidden="true">
                  {copiedLabel}
                </span>
              </button>
            </li>
          )}
          {chatHref && chatLabel && (
            <li className="ssf-line" style={{ "--i": 1 } as React.CSSProperties}>
              <a {...linkProps(chatHref)}>
                {chatLabel}
                {note && <span className="ssf-ast">*</span>}
              </a>
            </li>
          )}
        </ul>
        {note && <p className="ssf-note">{note}</p>}
        {socials.length > 0 && (
          <ul className="ssf-socials">
            {socials.map((s, i) => (
              <li key={i}>
                <a className="ssf-soc" {...linkProps(s.href)} aria-label={s.label ?? s.kind} style={{ "--i": i } as React.CSSProperties}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    {ICONS[s.kind]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}
        <span className="ssf-sr" role="status">
          {copied ? "Email address copied" : ""}
        </span>
      </div>,
    )
  }

  if (cols.length === 0) return null

  return (
    <div className="ssf-cols" style={{ "--ssf-n": cols.length } as React.CSSProperties}>
      {cols.map((c, k) => (
        <React.Fragment key={k}>
          {React.cloneElement(c as React.ReactElement<{ style?: React.CSSProperties }>, {
            style: { "--c": k } as React.CSSProperties,
          })}
        </React.Fragment>
      ))}
    </div>
  )
}
