"use client"

import type { ReactNode } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"

type MobileBottomSheetProps = {
  open: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

/** Bottom-anchored sheet tuned for thumb reach on small viewports (Material-style). */
export function MobileBottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: MobileBottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[90vh] flex-col gap-0 rounded-t-xl p-0 sm:max-w-lg"
      >
        <SheetHeader className="space-y-1 border-b border-gray-200 p-4 text-left dark:border-gray-800">
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer ? (
          <SheetFooter className="border-t border-gray-200 p-4 dark:border-gray-800">
            {footer}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
