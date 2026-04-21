"use client"

import { FinanceClientLayout } from "@/app/[locale]/finance/finance-client-layout"
import { useFinance } from "@/lib/hooks/use-finance"
import {
  FinanceGraphQLError,
  FinancePageLoading,
} from "@/components/finance/finance-graphql-error"
import { FinanceNoOrganization } from "@/components/finance/finance-no-organization"

export function FinanceClientLive() {
  const f = useFinance()

  if (f.loading) {
    return <FinancePageLoading />
  }

  if (f.error) {
    return <FinanceGraphQLError error={f.error} refetch={f.refetch} />
  }

  if (f.noOrganization) {
    return <FinanceNoOrganization />
  }

  const {
    organizationId,
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
  } = f

  return (
    <FinanceClientLayout
      organizationId={organizationId}
      currency={currency}
      accounts={accounts}
      transactions={transactions}
      summary={summary}
      monthlyRows={monthlyRows}
      selectedAccountOrCategoryId={selectedAccountOrCategoryId}
      setSelectedAccountOrCategoryId={setSelectedAccountOrCategoryId}
      search={search}
      setSearch={setSearch}
      resolveCategoryName={resolveCategoryName}
      resolveAccountName={resolveAccountName}
    />
  )
}
