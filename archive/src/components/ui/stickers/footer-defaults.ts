import { Job, Social, Credit, StickerSpec } from "./sticker-footer-art"

export const DEFAULT_JOBS: Job[] = [{ title: "associate cosmetic dentist", href: "#careers" }]

export const DEFAULT_SOCIALS: Social[] = [
  { kind: "instagram", href: "https://instagram.com", label: "Instagram" },
  { kind: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
  { kind: "tiktok", href: "https://tiktok.com", label: "TikTok" },
]

export const DEFAULT_STICKERS: StickerSpec[] = [
  { kind: "burst", text: "harley st" },
  { kind: "smiley" },
  { kind: "heart" },
  { kind: "bubble", text: "3D scan" },
  { kind: "daisy" },
  { kind: "camera" },
  { kind: "bolt" },
]

export const DEFAULT_CREDITS: Credit[] = [
  { role: "clinical director", name: "Dr. Alexander Vance, BDS" },
  { role: "head of surgery", name: "Dr. Elena Rostova, DDS" },
  { role: "chief ceramist", name: "Marcus Thorne, RDT" },
]

export const CUT = -1.2
export const SLANT = 0.1584

export const isExternal = (href?: string) => !!href && /^https?:/.test(href)

export const linkProps = (href?: string) => ({
  href,
  ...(isExternal(href) ? { target: "_blank", rel: "noreferrer noopener" } : {}),
})
