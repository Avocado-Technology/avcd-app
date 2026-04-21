import { describe, it, expect } from "@jest/globals"
import { act, renderHook, waitFor } from "@testing-library/react"
import { MockedProvider } from "@apollo/client/testing/react"
import type { ReactNode } from "react"
import React from "react"

import { useFinance } from "@/lib/hooks/use-finance"
import { GET_FINANCE_ACCOUNTS, GET_FINANCE_TRANSACTIONS } from "@/lib/graphql/queries/finance"
import { GET_ORGANIZATIONS } from "@/lib/graphql/queries/get-organization-tree"

const org1 = {
  __typename: "Organization" as const,
  id: "org-1",
  name: "Test Corp",
  address: "1 St",
  userId: "user-1",
}

const accountFixtures = [
  {
    __typename: "FinanceAccount" as const,
    id: "fa-asset",
    organizationId: "org-1",
    name: "Checking",
    kind: "ASSET" as const,
    currency: "USD",
    openingBalanceCents: 1000,
    description: null,
    isActive: true,
  },
  {
    __typename: "FinanceAccount" as const,
    id: "fa-income",
    organizationId: "org-1",
    name: "Revenue",
    kind: "INCOME" as const,
    currency: "USD",
    openingBalanceCents: 0,
    description: null,
    isActive: true,
  },
]

const transactionFixtures = [
  {
    __typename: "FinanceTransaction" as const,
    id: "ft-1",
    organizationId: "org-1",
    date: "2026-04-10",
    type: "INCOME" as const,
    amountCents: 50_000,
    currency: "USD",
    accountId: "fa-asset",
    categoryId: "fa-income",
    description: "Widget sales",
    reference: "R-1",
    status: "POSTED" as const,
  },
  {
    __typename: "FinanceTransaction" as const,
    id: "ft-2",
    organizationId: "org-1",
    date: "2026-04-12",
    type: "INCOME" as const,
    amountCents: 10_000,
    currency: "USD",
    accountId: "fa-asset",
    categoryId: "fa-income",
    description: "Other income",
    reference: "R-2",
    status: "POSTED" as const,
  },
]

function buildMocks(overrides?: { orgs?: { organizations: unknown[] } }) {
  return [
    {
      request: { query: GET_ORGANIZATIONS },
      result: { data: overrides?.orgs ?? { organizations: [org1] } },
    },
    {
      request: { query: GET_FINANCE_ACCOUNTS, variables: { organizationId: "org-1" } },
      result: { data: { financeAccounts: accountFixtures } },
    },
    {
      request: { query: GET_FINANCE_TRANSACTIONS, variables: { organizationId: "org-1" } },
      result: { data: { financeTransactions: transactionFixtures } },
    },
  ]
}

function wrapperFor(mocks: ReturnType<typeof buildMocks>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>
  }
}

describe("useFinance", () => {
  it("GivenOrgsAndTxns_WhenSearchFilters_ThenTableExcludesNonMatches", async () => {
    const { result } = renderHook(() => useFinance(), {
      wrapper: wrapperFor(buildMocks()),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    await waitFor(() => {
      expect(result.current.transactions).toHaveLength(2)
    })
    await act(async () => {
      result.current.setSearch("Widget")
    })
    await waitFor(() => {
      expect(result.current.transactions).toHaveLength(1)
    })
    expect(result.current.transactions[0]!.description).toContain("Widget")
  })

  it("GivenNoOrgs_WhenLoaded_ThenNoOrganizationAndNotLoading", async () => {
    const { result } = renderHook(() => useFinance(), {
      wrapper: wrapperFor(
        buildMocks({ orgs: { organizations: [] } }),
      ),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.noOrganization).toBe(true)
  })
})
