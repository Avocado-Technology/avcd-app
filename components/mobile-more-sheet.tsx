"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { MobileBottomSheet } from "@/components/ui/mobile-bottom-sheet"
import { Button } from "@/components/ui/button"
import type { MobileNavItemConfig } from "@/lib/mobile-nav-config"
import { useTranslations } from 'next-intl'
import NextLink from "next/link"

export type MobileMoreSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  overflowItems: MobileNavItemConfig[]
}

/** Bottom sheet for overflow routes + sign out (theme lives on the bottom bar). */
export function MobileMoreSheet({
  open,
  onOpenChange,
  overflowItems,
}: MobileMoreSheetProps) {
  const t = useTranslations("Navigation")
  const pathname = usePathname()

  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("moreOptions")}
      description="Additional destinations and account actions"
    >
      {overflowItems.length > 0 ? (
        <nav
          aria-label="Additional destinations"
          className="flex flex-col gap-1 border-b border-gray-200 pb-4 dark:border-gray-800"
        >
          {overflowItems.map(({ href, icon: Icon, labelKey }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-gray-100 font-medium text-green dark:bg-gray-800 dark:text-green-light"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800",
                )}
                aria-current={active ? "page" : undefined}
                onClick={() => onOpenChange(false)}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {t(labelKey as Parameters<typeof t>[0])}
              </Link>
            )
          })}
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 pt-4">
        <Button
          variant="secondary"
          className="min-h-11 w-full font-sans text-sm"
          asChild
        >
          <NextLink
            href="/api/auth/logout"
            prefetch={false}
            onClick={() => onOpenChange(false)}
          >
            Sign out
          </NextLink>
        </Button>
      </div>
    </MobileBottomSheet>
  )
}
