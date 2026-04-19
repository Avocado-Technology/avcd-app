"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MobileBottomSheet } from "@/components/ui/mobile-bottom-sheet"
import { Button } from "@/components/ui/button"
import type { MobileNavItemConfig } from "@/lib/mobile-nav-config"

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
  const pathname = usePathname()

  return (
    <MobileBottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="More options"
      description="Additional destinations and account actions"
    >
      {overflowItems.length > 0 ? (
        <nav
          aria-label="Additional destinations"
          className="flex flex-col gap-1 border-b border-gray-200 pb-4 dark:border-gray-800"
        >
          {overflowItems.map(({ href, icon: Icon, label }) => {
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
                {label}
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
          <Link
            href="/api/auth/logout"
            prefetch={false}
            onClick={() => onOpenChange(false)}
          >
            Sign out
          </Link>
        </Button>
      </div>
    </MobileBottomSheet>
  )
}
