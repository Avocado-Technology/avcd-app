"use client"

import { Eyebrow } from "@/components/ui/eyebrow"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import type { MonthlyTotalRow } from "@/lib/finance/finance-helpers"
import { cn } from "@/lib/utils"

import { useFormatter, useTranslations } from "next-intl"

export interface FinanceBarStripProps {
  rows: MonthlyTotalRow[]
  currencyLabel?: string
  className?: string
}

export function FinanceBarStrip({
  rows,
  currencyLabel = "USD",
  className,
}: FinanceBarStripProps) {
  const t = useTranslations("Finance")
  const format = useFormatter()

  const monthLabel = (monthKey: string): string => {
    const [y, m] = monthKey.split("-")
    const d = new Date(Number(y), Number(m) - 1, 1)
    return format.dateTime(d, { month: "short", year: "2-digit" })
  }

  const max = Math.max(
    1,
    ...rows.flatMap((r) => [r.incomeCents, r.expenseCents]),
  )

  const label = t("incomeExpenseByMonth", { currency: currencyLabel })

  return (
    <section
      className={cn(SURFACE_CARD_CLASS, className)}
      aria-label={label}
    >
      <Eyebrow as="p">{t("incomeVsExpense")}</Eyebrow>
      <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3" role="group">
        {rows.map((row) => {
          const ih = Math.round((row.incomeCents / max) * 100)
          const eh = Math.round((row.expenseCents / max) * 100)
          return (
            <div
              key={row.monthKey}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-32 w-full items-end justify-center gap-1">
                <div
                  className="w-1/2 max-w-[20px] rounded-t-[var(--r-sm)] bg-[var(--green)]"
                  style={{ height: `${Math.max(ih, 2)}%` }}
                  title={`${t("income")} ${row.incomeCents}`}
                  aria-hidden
                />
                <div
                  className="w-1/2 max-w-[20px] rounded-t-[var(--r-sm)] bg-[var(--g700)]"
                  style={{ height: `${Math.max(eh, 2)}%` }}
                  title={`${t("expense")} ${row.expenseCents}`}
                  aria-hidden
                />
              </div>
              <span className="truncate font-mono text-[0.6875rem] text-[var(--g500)]">
                {monthLabel(row.monthKey)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 font-mono text-[0.6875rem] text-[var(--g500)]">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--green)]" aria-hidden />
          {t("income")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--g700)]" aria-hidden />
          {t("expense")}
        </span>
      </div>
    </section>
  )
}
