"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { isMobileBottomNavEnabled } from "@/lib/feature-flags"

export type BottomToolbarAction = {
  label: string
  icon: LucideIcon
  onClick: () => void
  destructive?: boolean
}

type BottomToolbarProps = {
  actions: BottomToolbarAction[]
  className?: string
}

export function BottomToolbar({ actions, className }: BottomToolbarProps) {
  const stacked = isMobileBottomNavEnabled()

  return (
    <div
      role="toolbar"
      aria-label="Primary actions"
      data-toolbar-stack={stacked ? "above-nav" : undefined}
      className={cn(
        "fixed inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur-md md:hidden",
        stacked ? "bottom-[5.25rem]" : "bottom-0",
        className,
      )}
      style={{
        paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex h-14 items-center justify-around gap-2 px-2">
        {actions.map(({ label, icon: Icon, onClick, destructive }) => (
          <Button
            key={label}
            type="button"
            variant={destructive ? "destructive" : "ghost"}
            size="icon"
            className="min-h-11 min-w-11 shrink-0"
            aria-label={label}
            onClick={onClick}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </Button>
        ))}
      </div>
    </div>
  )
}
