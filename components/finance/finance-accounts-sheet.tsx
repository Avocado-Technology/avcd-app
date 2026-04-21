"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { FinanceAccountPanel } from "./finance-account-panel"

import type { MockFinanceAccount } from "@/lib/finance/types"

import { useTranslations } from 'next-intl'

export type FinanceAccountsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: MockFinanceAccount[]
  selectedId: string | null
  onSelectAccount: (id: string | null) => void
}

export function FinanceAccountsSheet({
  open,
  onOpenChange,
  accounts,
  selectedId,
  onSelectAccount,
}: FinanceAccountsSheetProps) {
  const t = useTranslations("Finance")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85vh] overflow-y-auto rounded-t-[var(--r-xl)] border-[var(--g200)] shadow-none"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-mono text-sm uppercase tracking-[0.08em] text-[var(--g500)]">
            {t("accountsAndCategories")}
          </SheetTitle>
        </SheetHeader>
        <FinanceAccountPanel
          className="mt-4 border-0 p-0"
          accounts={accounts}
          selectedId={selectedId}
          onSelect={(id) => {
            onSelectAccount(id)
            onOpenChange(false)
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
