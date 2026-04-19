"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { isMobileBottomNavEnabled } from "@/lib/feature-flags"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

type Props = {
  children: ReactNode
}

/** Bottom safe-area padding when primary bottom nav is enabled (hidden lg+). */
export function MobileNavigationChrome({ children }: Props) {
  const padBottom = isMobileBottomNavEnabled()

  return (
    <>
      <div
        data-mobile-nav-clearance={padBottom ? "true" : undefined}
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          padBottom && "pb-24 lg:pb-0",
        )}
      >
        {children}
      </div>
      <MobileBottomNav />
    </>
  )
}
