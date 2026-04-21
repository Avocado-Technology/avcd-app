"use client"

import { Eyebrow } from "@/components/ui/eyebrow"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import type { FinanceAccountKind, MockFinanceAccount } from "@/lib/finance/types"
import { cn } from "@/lib/utils"

import { useTranslations } from 'next-intl'

const KIND_ORDER: FinanceAccountKind[] = ["ASSET", "INCOME", "EXPENSE"]

export interface FinanceAccountPanelProps {
  accounts: MockFinanceAccount[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** e.g. border-0 when embedded in a sheet */
  className?: string
}

export function FinanceAccountPanel({
  accounts,
  selectedId,
  onSelect,
  className,
}: FinanceAccountPanelProps) {
  const t = useTranslations("Finance")

  const KIND_LABEL: Record<FinanceAccountKind, string> = {
    ASSET: t("assets"),
    INCOME: t("incomeCategories"),
    EXPENSE: t("expenseCategories"),
  }

  const byKind = KIND_ORDER.map((kind) => ({
    kind,
    items: accounts.filter((a) => a.kind === kind),
  }))

  return (
    <aside
      className={cn(
        SURFACE_CARD_CLASS,
        "flex h-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      aria-label={t("accountsAndCategories")}
    >
      <Eyebrow as="p" className="shrink-0">
        {t("accounts")}
      </Eyebrow>
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "w-full rounded-[var(--r-md)] border border-transparent py-2 pl-3 text-left font-mono text-sm text-[var(--g700)] transition-colors hover:bg-[var(--g50)]",
            selectedId === null &&
              "border-l-2 border-l-[var(--g900)] bg-[var(--g100)] font-medium text-[var(--g900)]",
          )}
        >
          {t("allAccounts")}
        </button>
        {byKind.map(({ kind, items }) =>
          items.length === 0 ? null : (
            <div key={kind}>
              <Eyebrow as="p">{KIND_LABEL[kind]}</Eyebrow>
              <ul className="mt-2 space-y-1">
                {items.map((a) => {
                  const active = selectedId === a.id
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(a.id)}
                        className={cn(
                          "w-full rounded-[var(--r-md)] border border-transparent py-2 pl-3 pr-3 text-left text-sm text-[var(--g700)] transition-colors hover:bg-[var(--g50)]",
                          active &&
                            "border-l-2 border-l-[var(--g900)] bg-[var(--g100)] font-medium text-[var(--g900)]",
                        )}
                      >
                        {a.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ),
        )}
      </div>
    </aside>
  )
}
