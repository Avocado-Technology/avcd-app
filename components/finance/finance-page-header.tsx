"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"

export type FinancePageHeaderProps = {
  organizationId: string
  onOpenAccounts?: () => void
}

import { useTranslations } from 'next-intl'

export function FinancePageHeader({ organizationId, onOpenAccounts }: FinancePageHeaderProps) {
  void organizationId
  const t = useTranslations("Finance")

  return (
    <header className="flex w-full shrink-0 flex-col gap-[var(--sp-4)] border-b border-[var(--g200)] bg-[var(--bg)] px-[var(--sp-4)] py-[var(--sp-4)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--sp-6)] lg:py-[var(--sp-5)]">
      <div />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="lg:hidden"
          onClick={onOpenAccounts}
          aria-label={t("openAccountsLabel")}
        >
          <LayoutGrid className="h-4 w-4" aria-hidden />
          {t("accounts")}
        </Button>
      </div>
    </header>
  )
}
