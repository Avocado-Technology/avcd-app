import type { HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Shared Avocado-style bordered surface (no shadow). */
export const SURFACE_CARD_CLASS =
  "rounded-[var(--r-xl)] border border-[var(--g200)] bg-[var(--bg)] p-[var(--sp-6)] transition-colors hover:border-[var(--g400)]"

type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
  children: ReactNode
}

/**
 * Bordered panel using design tokens (no shadow) — matches Avocado card rules.
 */
export function SurfaceCard({ className, children, ...rest }: SurfaceCardProps) {
  return (
    <div className={cn(SURFACE_CARD_CLASS, className)} {...rest}>
      {children}
    </div>
  )
}
