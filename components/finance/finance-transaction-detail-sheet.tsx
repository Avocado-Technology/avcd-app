"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatSignedMoney } from "@/lib/finance/format-money"
import type { MockFinanceTransaction } from "@/lib/finance/types"
import { cn } from "@/lib/utils"

export type FinanceTransactionDetailSheetProps = {
  transaction: MockFinanceTransaction | null
  onOpenChange: (open: boolean) => void
  resolveCategoryName: (categoryId: string) => string
  resolveAccountName: (accountId: string) => string
  side: "bottom" | "right"
}

import { useTranslations } from 'next-intl'

export function FinanceTransactionDetailSheet({
  transaction,
  onOpenChange,
  resolveCategoryName,
  resolveAccountName,
  side,
}: FinanceTransactionDetailSheetProps) {
  const t = useTranslations("Finance")
  const open = transaction !== null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "overflow-y-auto border-[var(--g200)] shadow-none",
          side === "bottom" && "max-h-[90vh] rounded-t-[var(--r-xl)]",
          side === "right" && "h-full w-full max-w-md border-l sm:max-w-md",
        )}
      >
        {transaction ? (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-xl font-semibold text-[var(--g900)]">
                {transaction.description}
              </SheetTitle>
              <p className="font-mono text-sm text-[var(--g500)]">
                {resolveCategoryName(transaction.categoryId)}
              </p>
            </SheetHeader>
            <dl className="mt-6 space-y-4 border-t border-[var(--g100)] pt-6 font-mono text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--g500)]">{t("amount")}</dt>
                <dd className="tabular-nums text-[var(--g900)]">
                  {formatSignedMoney(
                    transaction.amountCents,
                    transaction.type,
                    transaction.currency,
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--g500)]">{t("date")}</dt>
                <dd className="text-[var(--g900)]">{transaction.date}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--g500)]">{t("cashAccount")}</dt>
                <dd className="text-right text-[var(--g900)]">
                  {resolveAccountName(transaction.accountId)}
                </dd>
              </div>
              {transaction.reference ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--g500)]">{t("reference")}</dt>
                  <dd className="break-all text-[var(--g900)]">{transaction.reference}</dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
