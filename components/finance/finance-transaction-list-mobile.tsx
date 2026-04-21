"use client"

import { Eyebrow } from "@/components/ui/eyebrow"
import { formatSignedMoney } from "@/lib/finance/format-money"
import { groupTransactionsByDate } from "@/lib/finance/finance-helpers"
import type { MockFinanceTransaction } from "@/lib/finance/types"
import { cn } from "@/lib/utils"

export interface FinanceTransactionListMobileProps {
  transactions: MockFinanceTransaction[]
  resolveCategoryName: (categoryId: string) => string
  onRowClick?: (t: MockFinanceTransaction) => void
  selectedId?: string | null
}

import { useTranslations } from 'next-intl'

export function FinanceTransactionListMobile({
  transactions,
  resolveCategoryName,
  onRowClick,
  selectedId,
}: FinanceTransactionListMobileProps) {
  const t = useTranslations("Finance")
  const grouped = groupTransactionsByDate(transactions)

  return (
    <div className="space-y-6 lg:hidden">
      {[...grouped.entries()].map(([date, rows]) => (
        <section key={date}>
          <Eyebrow
            as="h3"
            className="sticky top-0 z-10 border-b border-[var(--g200)] bg-[var(--bg)] pb-2"
          >
            {date}
          </Eyebrow>
          <ul
            className="mt-3 divide-y divide-[var(--g200)] border border-[var(--g200)] rounded-[var(--r-xl)] bg-[var(--bg)]"
            aria-label={t("date", { date })}
          >
            {rows.map((t) => {
              const active = selectedId === t.id
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full min-h-[48px] items-start gap-3 border-l-2 border-l-transparent px-4 py-3 text-left transition-colors hover:bg-[var(--g50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g900)]",
                      active && "border-l-[var(--g400)] bg-[var(--g50)]",
                    )}
                    onClick={() => onRowClick?.(t)}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-sm font-medium text-[var(--g900)]">
                        {t.description}
                      </span>
                      <span className="truncate font-mono text-[0.6875rem] text-[var(--g500)]">
                        {resolveCategoryName(t.categoryId)}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-sm tabular-nums text-[var(--g900)]">
                      {formatSignedMoney(t.amountCents, t.type, t.currency)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
