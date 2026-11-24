"use client"

import * as React from "react"
import { MetalFx, type MetalFxPreset, type MetalFxTheme, type MetalFxVariant } from "metal-fx"
import { cn } from "@/lib/utils"

export interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  preset?: MetalFxPreset
  theme?: MetalFxTheme
  strength?: number
  paused?: boolean
  metalVariant?: MetalFxVariant
  normalizeHostStyles?: boolean
  disableGlow?: boolean
  glowGain?: number
  ringCssPx?: number
  shaderScale?: number
  metalFxClassName?: string
  metalFxStyle?: React.CSSProperties
  variant?: "default" | "outline" | "secondary" | "ghost"
}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  (
    {
      className,
      metalFxClassName,
      metalFxStyle,
      preset = "silver",
      theme = "dark",
      strength = 1,
      paused = false,
      metalVariant = "button",
      normalizeHostStyles = false,
      disableGlow = false,
      glowGain = 1.2,
      ringCssPx = 2.5,
      shaderScale,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <MetalFx
        preset={preset}
        theme={theme}
        strength={strength}
        paused={paused}
        variant={metalVariant}
        normalizeHostStyles={normalizeHostStyles}
        disableGlow={disableGlow}
        glowGain={glowGain}
        ringCssPx={ringCssPx}
        shaderScale={shaderScale}
        className={cn("inline-block", metalFxClassName)}
        style={metalFxStyle}
      >
        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center rounded-full font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </MetalFx>
    )
  }
)

MetalButton.displayName = "MetalButton"
