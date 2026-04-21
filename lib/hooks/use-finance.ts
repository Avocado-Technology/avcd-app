"use client"

import { useQuery } from "@apollo/client/react"
import { useCallback, useMemo, useState } from "react"

import {
  computeMonthlyTotals,
  filterTransactions,
  lastNMonthKeys,
  summarizeTransactions,
} from "@/lib/finance/finance-helpers"
import {
  mapFinanceAccountGqlToUi,
  mapFinanceTransactionGqlToUi,
  type FinanceAccountGql,
  type FinanceTransactionGql,
} from "@/lib/finance/map-api"
import type { MockFinanceAccount, MockFinanceTransaction } from "@/lib/finance/types"
import { GET_FINANCE_ACCOUNTS, GET_FINANCE_TRANSACTIONS } from "@/lib/graphql/queries/finance"
import { GET_ORGANIZATIONS } from "@/lib/graphql/queries/get-organization-tree"

function formatLocalIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export type UseFinanceResult = {
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
  monthlyRows: ReturnType<typeof computeMonthlyTotals>
  selectedAccountOrCategoryId: string | null
  setSelectedAccountOrCategoryId: (id: string | null) => void
  search: string
  setSearch: (s: string) => void
  resolveCategoryName: (categoryId: string) => string
  resolveAccountName: (accountId: string) => string
  loading: boolean
  error: Error | undefined
  noOrganization: boolean
  refetch: () => Promise<void>
}

export function useFinance(): UseFinanceResult {
  const [anchorDate] = useState(() => formatLocalIsoDate(new Date()))
  const [selectedAccountOrCategoryId, setSelectedAccountOrCategoryId] = useState<string | null>(
    null,
  )
  const [search, setSearch] = useState("")

  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
    refetch: refetchOrgs,
  } = useQuery<{ organizations: { id: string }[] }>(GET_ORGANIZATIONS, {
    fetchPolicy: "cache-and-network",
  })

  const orgId = orgData?.organizations?.[0]?.id ?? null
  const skipFinance = !orgId

  const {
    data: accountsData,
    loading: accountsLoading,
    error: accountsError,
    refetch: refetchAccounts,
  } = useQuery<{ financeAccounts: FinanceAccountGql[] }>(GET_FINANCE_ACCOUNTS, {
    variables: { organizationId: orgId ?? "" },
    skip: skipFinance,
    fetchPolicy: "cache-and-network",
  })

  const {
    data: txData,
    loading: txLoading,
    error: txError,
    refetch: refetchTx,
  } = useQuery<{ financeTransactions: FinanceTransactionGql[] }>(GET_FINANCE_TRANSACTIONS, {
    variables: { organizationId: orgId ?? "" },
    skip: skipFinance,
    fetchPolicy: "cache-and-network",
  })

  const accounts = useMemo(() => {
    const raw = accountsData?.financeAccounts ?? []
    return raw.map(mapFinanceAccountGqlToUi)
  }, [accountsData?.financeAccounts])

  const allTransactions = useMemo(() => {
    const raw = txData?.financeTransactions ?? []
    return raw.map(mapFinanceTransactionGqlToUi)
  }, [txData?.financeTransactions])

  const currency = useMemo(() => {
    const usdAsset = accounts.find((a) => a.kind === "ASSET" && a.currency === "USD")
    if (usdAsset) return usdAsset.currency
    const anyAsset = accounts.find((a) => a.kind === "ASSET")
    return anyAsset?.currency ?? "USD"
  }, [accounts])

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
    return filterTransactions(allTransactions, baseCriteria)
  }, [allTransactions, baseCriteria])

  const summary = useMemo(() => {
    const filtered = filterTransactions(allTransactions, baseCriteria)
    const s = summarizeTransactions(filtered)
    return {
      totalIncomeCents: s.totalIncomeCents,
      totalExpenseCents: s.totalExpenseCents,
      netCents: s.netCents,
      currency,
    }
  }, [allTransactions, baseCriteria, currency])

  const monthlyRows = useMemo(() => {
    const filtered = filterTransactions(allTransactions, baseCriteria)
    const keys = lastNMonthKeys(anchorDate, 6)
    return computeMonthlyTotals(filtered, keys)
  }, [allTransactions, baseCriteria, anchorDate])

  const resolveCategoryName = useCallback(
    (categoryId: string) => {
      return accounts.find((a) => a.id === categoryId)?.name ?? categoryId
    },
    [accounts],
  )

  const resolveAccountName = useCallback(
    (accountId: string) => {
      return accounts.find((a) => a.id === accountId)?.name ?? accountId
    },
    [accounts],
  )

  const loading =
    orgLoading || (!skipFinance && (accountsLoading || txLoading))

  const error = (orgError ?? accountsError ?? txError) as Error | undefined

  const noOrganization =
    !orgLoading && Boolean(orgData?.organizations && orgData.organizations.length === 0)

  const refetch = useCallback(async () => {
    await refetchOrgs()
    if (orgId) {
      await Promise.all([refetchAccounts(), refetchTx()])
    }
  }, [orgId, refetchAccounts, refetchOrgs, refetchTx])

  return {
    organizationId: orgId ?? "",
    currency,
    accounts,
    transactions,
    summary,
    monthlyRows,
    selectedAccountOrCategoryId,
    setSelectedAccountOrCategoryId,
    search,
    setSearch,
    resolveCategoryName,
    resolveAccountName,
    loading,
    error,
    noOrganization,
    refetch,
  }
}
