import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const eyebrowClass =
  "font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--g500)]"

export type EyebrowProps = {
  /** Default `p`; use `h2`/`h3` for visible section headings when needed */
  as?: "p" | "h2" | "h3" | "span"
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Section label / mono eyebrow — Avocado-style metadata line (--g500 for WCAG contrast).
 */
export function Eyebrow({ as: Comp = "p", id, className, children }: EyebrowProps) {
  return (
    <Comp id={id} className={cn(eyebrowClass, className)}>
      {children}
    </Comp>
  )
}
