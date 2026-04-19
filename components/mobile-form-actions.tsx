"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  className?: string
}

/** Sticky primary actions at bottom of scrollable mobile forms. */
export function MobileFormStickyActions({ children, className }: Props) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 border-t border-gray-200 bg-background/95 py-4 backdrop-blur-md dark:border-gray-800",
        className,
      )}
    >
      {children}
    </div>
  )
}
