"use client"

import { Eyebrow } from "@/components/ui/eyebrow"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import { formatMoney } from "@/lib/finance/format-money"
import { cn } from "@/lib/utils"

export interface FinanceSummaryCardsProps {
  totalIncomeCents: number
  totalExpenseCents: number
  netCents: number
  currency: string
  className?: string
}

import { useTranslations } from 'next-intl'

export function FinanceSummaryCards({
  totalIncomeCents,
  totalExpenseCents,
  netCents,
  currency,
  className,
}: FinanceSummaryCardsProps) {
  const t = useTranslations("Finance")
  const netPositive = netCents >= 0

  return (
    <div className={cn("flex flex-col gap-[var(--sp-4)]", className)}>
      <section
        className={SURFACE_CARD_CLASS}
        aria-labelledby="finance-net-heading"
      >
        <Eyebrow as="p">{t("netFiltered")}</Eyebrow>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <h2
            id="finance-net-heading"
            className={cn(
              "text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-[-0.03em]",
              netPositive ? "text-[var(--green)]" : "text-[var(--red)]",
            )}
          >
            {formatMoney(netCents, currency)}
          </h2>
          <span className="font-mono text-sm text-[var(--g500)]" aria-live="polite">
            {netPositive ? t("positiveBalance") : t("negativeBalance")}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-[var(--sp-4)] sm:grid-cols-2">
        <section className={SURFACE_CARD_CLASS} aria-labelledby="finance-income-heading">
          <Eyebrow as="p" id="finance-income-heading">
            {t("totalIncome")}
          </Eyebrow>
          <p className="mt-2 font-mono text-xl font-medium tabular-nums text-[var(--g900)]">
            {formatMoney(totalIncomeCents, currency)}
          </p>
        </section>
        <section className={SURFACE_CARD_CLASS} aria-labelledby="finance-expense-heading">
          <Eyebrow as="p" id="finance-expense-heading">
            {t("totalExpense")}
          </Eyebrow>
          <p className="mt-2 font-mono text-xl font-medium tabular-nums text-[var(--g900)]">
            {formatMoney(totalExpenseCents, currency)}
          </p>
        </section>
      </div>
    </div>
  )
}
