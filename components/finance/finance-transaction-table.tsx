"use client"

import { useMemo, useState } from "react"

import { formatSignedMoney } from "@/lib/finance/format-money"
import type { MockFinanceTransaction } from "@/lib/finance/types"
import { cn } from "@/lib/utils"

export interface FinanceTransactionTableProps {
  transactions: MockFinanceTransaction[]
  resolveCategoryName: (categoryId: string) => string
  onRowClick?: (t: MockFinanceTransaction) => void
  selectedId?: string | null
}

import { useTranslations } from 'next-intl'

export function FinanceTransactionTable({
  transactions,
  resolveCategoryName,
  onRowClick,
  selectedId,
}: FinanceTransactionTableProps) {
  const t = useTranslations("Finance")
  const [sortDesc, setSortDesc] = useState(true)

  const sorted = useMemo(() => {
    const copy = [...transactions]
    copy.sort((a, b) => (sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
    return copy
  }, [transactions, sortDesc])

  return (
    <div
      className="overflow-hidden rounded-[var(--r-xl)] border border-[var(--g200)] bg-[var(--bg)]"
      role="region"
      aria-label={t("transactionsTableLabel")}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--g200)] bg-[var(--g50)]">
              <th scope="col" className="p-4 font-mono text-[0.6875rem] font-medium text-[var(--g500)]">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 uppercase tracking-[0.06em] text-[var(--g500)] hover:text-[var(--g900)]"
                  onClick={() => setSortDesc((s) => !s)}
                >
                  {t("date")}
                  <span className="sr-only">
                    {sortDesc ? t("sortedDescending") : t("sortedAscending")}
                  </span>
                  <span aria-hidden className="text-[0.625rem]">
                    {sortDesc ? "↓" : "↑"}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                className="p-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                {t("description")}
              </th>
              <th
                scope="col"
                className="p-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                {t("category")}
              </th>
              <th
                scope="col"
                className="p-4 text-right font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                {t("amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const active = selectedId === t.id
              return (
                <tr
                  key={t.id}
                  className={cn(
                    "border-b border-[var(--g200)] transition-colors last:border-b-0",
                    onRowClick && "cursor-pointer hover:bg-[var(--g50)]",
                    active && "bg-[var(--g50)]",
                  )}
                  onClick={() => onRowClick?.(t)}
                  onKeyDown={(e) => {
                    if (!onRowClick) return
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onRowClick(t)
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  <td className="p-4 font-mono text-sm tabular-nums text-[var(--g900)]">
                    {t.date}
                  </td>
                  <td className="p-4 text-sm text-[var(--g900)]">{t.description}</td>
                  <td className="p-4 text-sm text-[var(--g700)]">
                    {resolveCategoryName(t.categoryId)}
                  </td>
                  <td className="p-4 text-right font-mono text-sm tabular-nums text-[var(--g900)]">
                    {formatSignedMoney(t.amountCents, t.type, t.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
