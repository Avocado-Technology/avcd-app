"use client"

import { useState } from "react"
import { Link, usePathname } from "@/i18n/navigation"
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
import { useTranslations } from 'next-intl'

type MobileBottomNavProps = {
  items?: MobileNavItemConfig[]
}

export function MobileBottomNav({ items = APP_NAV_ITEMS }: MobileBottomNavProps) {
  const t = useTranslations("Navigation")
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
          "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md lg:hidden",
        )}
        style={{
          paddingBottom: "max(16px, env(safe-area-inset-bottom, 0px))",
        }}
        role="navigation"
        aria-label={t("primaryNavLabel")}
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-evenly px-3">
          {favorites.map(({ href, icon: Icon, labelKey }) => {
            const active = currentPath === href
            const label = t(labelKey as Parameters<typeof t>[0])
            return (
              <Button
                key={href}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-12 w-12 shrink-0",
                  active &&
                    "text-green hover:bg-transparent hover:text-green dark:text-green-light dark:hover:bg-transparent dark:hover:text-green-light",
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
            className="h-12 w-12 shrink-0"
            aria-label={t("moreOptions")}
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
