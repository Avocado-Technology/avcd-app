"use client"

import { useState } from "react"

import {
  FinanceAccountsSheet,
  FinanceAccountPanel,
  FinanceBarStrip,
  FinanceEmpty,
  FinancePageHeader,
  FinanceSummaryCards,
  FinanceTransactionDetailSheet,
  FinanceTransactionListMobile,
  FinanceTransactionTable,
} from "@/components/finance"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Input } from "@/components/ui/input"
import type { MonthlyTotalRow } from "@/lib/finance/finance-helpers"
import type {
  MockFinanceAccount,
  MockFinanceTransaction,
} from "@/lib/finance/types"
import { useBreakpoint } from "@/lib/breakpoints"

/** View model shared by mock and API-backed finance clients. */
export type FinanceClientViewModel = {
  organizationId: string
  currency: string
  accounts: MockFinanceAccount[]
  transactions: MockFinanceTransaction[]
  summary: {
    totalIncomeCents: number
    totalExpenseCents: number
    netCents: number
    currency: string
  }
  monthlyRows: MonthlyTotalRow[]
  selectedAccountOrCategoryId: string | null
  setSelectedAccountOrCategoryId: (id: string | null) => void
  search: string
  setSearch: (s: string) => void
  resolveCategoryName: (categoryId: string) => string
  resolveAccountName: (accountId: string) => string
}

export function FinanceClientLayout(f: FinanceClientViewModel) {
  const breakpoint = useBreakpoint()
  const detailSheetSide = breakpoint === "desktop" ? "right" : "bottom"
  const [accountsOpen, setAccountsOpen] = useState(false)
  const [detailTxn, setDetailTxn] = useState<MockFinanceTransaction | null>(null)

  const showEmpty = f.transactions.length === 0

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)]">
      <FinancePageHeader
        organizationId={f.organizationId}
        onOpenAccounts={() => setAccountsOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[var(--sp-6)] px-[var(--sp-4)] pb-[var(--sp-4)] pt-[var(--sp-6)] lg:px-[var(--sp-6)] lg:pb-[var(--sp-6)]">
        <label className="flex w-full min-w-0 shrink-0 flex-col gap-1">
          <span className="sr-only">Search transactions</span>
          <Input
            placeholder="Search description or reference"
            value={f.search}
            onChange={(e) => f.setSearch(e.target.value)}
            className="w-full min-w-0 border-[var(--g500)] bg-[var(--bg)] text-sm"
            type="search"
            autoComplete="off"
          />
        </label>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-[var(--sp-6)] lg:grid-cols-[minmax(200px,240px)_1fr] lg:items-stretch">
          <div className="hidden min-h-0 h-full lg:flex lg:min-h-0 lg:flex-col">
            <FinanceAccountPanel
              className="h-full min-h-0 flex-1"
              accounts={f.accounts}
              selectedId={f.selectedAccountOrCategoryId}
              onSelect={f.setSelectedAccountOrCategoryId}
            />
          </div>

          <div className="flex min-h-0 flex-col gap-[var(--sp-6)]">
            <FinanceSummaryCards
              totalIncomeCents={f.summary.totalIncomeCents}
              totalExpenseCents={f.summary.totalExpenseCents}
              netCents={f.summary.netCents}
              currency={f.summary.currency}
            />

            <FinanceBarStrip rows={f.monthlyRows} currencyLabel={f.currency} />

            {showEmpty ? (
              <FinanceEmpty />
            ) : (
              <section aria-labelledby="finance-tx-heading">
                <Eyebrow as="h2" id="finance-tx-heading" className="mb-3">
                  Transactions
                </Eyebrow>
                <div className="hidden lg:block">
                  <FinanceTransactionTable
                    transactions={f.transactions}
                    resolveCategoryName={f.resolveCategoryName}
                    onRowClick={setDetailTxn}
                    selectedId={detailTxn?.id ?? null}
                  />
                </div>
                <div className="lg:hidden">
                  <FinanceTransactionListMobile
                    transactions={f.transactions}
                    resolveCategoryName={f.resolveCategoryName}
                    onRowClick={setDetailTxn}
                    selectedId={detailTxn?.id ?? null}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <FinanceAccountsSheet
        open={accountsOpen}
        onOpenChange={setAccountsOpen}
        accounts={f.accounts}
        selectedId={f.selectedAccountOrCategoryId}
        onSelectAccount={f.setSelectedAccountOrCategoryId}
      />

      <FinanceTransactionDetailSheet
        transaction={detailTxn}
        onOpenChange={(open) => {
          if (!open) setDetailTxn(null)
        }}
        resolveCategoryName={f.resolveCategoryName}
        resolveAccountName={f.resolveAccountName}
        side={detailSheetSide}
      />
    </div>
  )
}
