"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { isMobileBottomNavEnabled } from "@/lib/feature-flags"
import {
  APP_NAV_ITEMS,
  getFavoriteNavItems,
  getOverflowNavItems,
  type MobileNavItemConfig,
} from "@/lib/mobile-nav-config"
import { MobileMoreSheet } from "@/components/mobile-more-sheet"
import { MobileBottomThemeButton } from "@/components/mobile-bottom-theme-button"

type MobileBottomNavProps = {
  items?: MobileNavItemConfig[]
}

export function MobileBottomNav({ items = APP_NAV_ITEMS }: MobileBottomNavProps) {
  const currentPath = usePathname()
  const enabled = isMobileBottomNavEnabled()
  const [moreOpen, setMoreOpen] = useState(false)

  const favorites = getFavoriteNavItems(items)
  const overflow = getOverflowNavItems(items)

  if (!enabled) return null
  /** No primary routes: hide bar (global actions would be unreachable without nav context). */
  if (items.length === 0) return null

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 lg:hidden",
        )}
        style={{
          paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))",
        }}
        role="navigation"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-evenly px-3">
          {favorites.map(({ href, icon: Icon, label }) => {
            const active = currentPath === href
            return (
              <Button
                key={href}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12 shrink-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                  active &&
                    "text-green hover:text-green dark:text-green-light dark:hover:text-green-light",
                )}
                asChild
              >
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  title={label}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </Link>
              </Button>
            )
          })}
          <MobileBottomThemeButton />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-12 w-12 shrink-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            aria-label="More options"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden />
          </Button>
        </div>
      </nav>
      <MobileMoreSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        overflowItems={overflow}
      />
    </>
  )
}
