"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BlurRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "left" | "right" | "down" | "none"
  blur?: number
  distance?: number
  threshold?: number
  as?: React.ElementType
}

/**
 * BlurReveal
 * Scroll-triggered or mount-triggered element that dissolves from
 * soft gaussian blur into crisp focus while gently drifting into place.
 */
export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 850,
  direction = "up",
  blur = 14,
  distance = 28,
  threshold = 0.12,
  as: Component = "div",
}: BlurRevealProps) {
  const [isInView, setIsInView] = React.useState(false)
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // If intersection observer not supported, immediately reveal
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(el)
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const getTransform = () => {
    if (isInView) return "translate3d(0, 0, 0) scale(1)"
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640
    const effDirection = isMobile && (direction === "left" || direction === "right") ? "up" : direction
    switch (effDirection) {
      case "left":
        return `translate3d(-${distance}px, 0, 0) scale(0.97)`
      case "right":
        return `translate3d(${distance}px, 0, 0) scale(0.97)`
      case "down":
        return `translate3d(0, -${distance}px, 0) scale(0.97)`
      case "none":
        return "scale(0.98)"
      case "up":
      default:
        return `translate3d(0, ${distance}px, 0) scale(0.97)`
    }
  }

  const Comp = Component as any

  return (
    <Comp
      ref={ref}
      className={cn("will-change-[filter,transform,opacity]", className)}
      style={{
        transition: `filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        filter: isInView ? "none" : `blur(${blur}px)`,
        opacity: isInView ? 1 : 0,
        transform: getTransform(),
      }}
    >
      {children}
    </Comp>
  )
}

export interface KineticBlurTextProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  direction?: "up" | "left" | "down" | "none"
  blur?: number
  distance?: number
  as?: React.ElementType
  trigger?: "mount" | "scroll"
}

/**
 * KineticBlurText
 * Word-by-word kinetic typography where each word dissolves from
 * soft gaussian blur and glides into sharp focus with staggered timing.
 */
export function KineticBlurText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 70,
  direction = "up",
  blur = 14,
  distance = 24,
  as: Component = "span",
  trigger = "scroll",
}: KineticBlurTextProps) {
  const [isInView, setIsInView] = React.useState(false)
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (trigger === "mount") {
      const t = setTimeout(() => setIsInView(true), 40)
      return () => clearTimeout(t)
    }

    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(el)
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [trigger])

  const words = text.split(" ")

  const getWordInitialTransform = () => {
    switch (direction) {
      case "left":
        return `translate3d(-${distance}px, 0, 0) scale(0.96)`
      case "down":
        return `translate3d(0, -${distance}px, 0) scale(0.96)`
      case "none":
        return "scale(0.97)"
      case "up":
      default:
        return `translate3d(0, ${distance}px, 0) scale(0.96)`
    }
  }

  const Comp = Component as any

  return (
    <Comp ref={ref} className={cn("inline-block", className)}>
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger
        return (
          <span
            key={i}
            className={cn(
              "inline-block whitespace-nowrap mr-[0.26em] will-change-[filter,transform,opacity]",
              wordClassName
            )}
            style={{
              transition: "filter 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: `${wordDelay}ms`,
              filter: isInView ? "none" : `blur(${blur}px)`,
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translate3d(0, 0, 0) scale(1)" : getWordInitialTransform(),
            }}
          >
            {word}
          </span>
        )
      })}
    </Comp>
  )
}
