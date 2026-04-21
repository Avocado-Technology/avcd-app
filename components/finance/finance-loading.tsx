/**
 * Skeleton layout for Finance when wired to async GraphQL — not used by mock-only flow.
 */
"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { useTranslations } from 'next-intl'

export function FinanceLoading({ className }: { className?: string }) {
  const t = useTranslations("Finance")

  return (
    <div className={cn("flex flex-col gap-[var(--sp-6)]", className)} aria-busy aria-label={t("loadingLabel")}>
      <div className="flex flex-col gap-[var(--sp-4)]">
        <Skeleton className="h-36 w-full rounded-[var(--r-xl)]" />
        <div className="grid grid-cols-2 gap-[var(--sp-4)]">
          <Skeleton className="h-28 w-full rounded-[var(--r-xl)]" />
          <Skeleton className="h-28 w-full rounded-[var(--r-xl)]" />
        </div>
      </div>
      <Skeleton className="h-44 w-full rounded-[var(--r-xl)]" />
      <Skeleton className="h-64 w-full rounded-[var(--r-xl)]" />
    </div>
  )
}
