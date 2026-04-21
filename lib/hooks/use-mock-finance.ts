"use client"

import { useCallback, useMemo, useState } from "react"

import {
  computeMonthlyTotals,
  filterTransactions,
  lastNMonthKeys,
  summarizeTransactions,
} from "@/lib/finance/finance-helpers"
import {
  MOCK_CURRENCY,
  MOCK_ORGANIZATION_ID,
  MOCK_TODAY,
  mockFinanceAccounts,
  mockFinanceTransactions,
} from "@/lib/mock-finance-data"

/**
 * Mock finance state. KPI and monthly chart use the same filtered rows as the transaction list.
 */
export function useMockFinance() {
  const [selectedAccountOrCategoryId, setSelectedAccountOrCategoryId] = useState<string | null>(
    null,
  )
  const [search, setSearch] = useState("")

  const baseCriteria = useMemo(
    () => ({
      dateFrom: null as string | null,
      dateTo: null as string | null,
      accountOrCategoryId: selectedAccountOrCategoryId,
      search,
    }),
    [selectedAccountOrCategoryId, search],
  )

  const transactions = useMemo(() => {
    return filterTransactions(mockFinanceTransactions, baseCriteria)
  }, [baseCriteria])

  const summary = useMemo(() => {
    const filtered = filterTransactions(mockFinanceTransactions, baseCriteria)
    const s = summarizeTransactions(filtered)
    return {
      totalIncomeCents: s.totalIncomeCents,
      totalExpenseCents: s.totalExpenseCents,
      netCents: s.netCents,
      currency: MOCK_CURRENCY,
    }
  }, [baseCriteria])

  const monthlyRows = useMemo(() => {
    const filtered = filterTransactions(mockFinanceTransactions, baseCriteria)
    const keys = lastNMonthKeys(MOCK_TODAY, 6)
    return computeMonthlyTotals(filtered, keys)
  }, [baseCriteria])

  const resolveCategoryName = useCallback((categoryId: string) => {
    return mockFinanceAccounts.find((a) => a.id === categoryId)?.name ?? categoryId
  }, [])

  const resolveAccountName = useCallback((accountId: string) => {
    return mockFinanceAccounts.find((a) => a.id === accountId)?.name ?? accountId
  }, [])

  return {
    organizationId: MOCK_ORGANIZATION_ID,
    currency: MOCK_CURRENCY,
    accounts: mockFinanceAccounts,
    transactions,
    summary,
    monthlyRows,
    selectedAccountOrCategoryId,
    setSelectedAccountOrCategoryId,
    search,
    setSearch,
    resolveCategoryName,
    resolveAccountName,
  }
}
