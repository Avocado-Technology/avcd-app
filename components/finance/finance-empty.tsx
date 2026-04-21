"use client"

import { Eyebrow } from "@/components/ui/eyebrow"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import { cn } from "@/lib/utils"

import { useTranslations } from 'next-intl'

export function FinanceEmpty({ className }: { className?: string }) {
  const t = useTranslations("Finance")

  return (
    <div
      className={cn(
        SURFACE_CARD_CLASS,
        "flex flex-col items-center justify-center px-[var(--sp-8)] py-[var(--sp-16)] text-center",
        className,
      )}
      role="status"
    >
      <Eyebrow as="p">{t("noTransactions")}</Eyebrow>
      <p className="mt-2 max-w-sm text-sm text-[var(--g700)]">
        {t("adjustFilters")}
      </p>
    </div>
  )
}
