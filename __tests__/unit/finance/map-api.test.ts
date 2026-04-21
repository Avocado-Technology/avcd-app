import { describe, it, expect } from "@jest/globals"

import {
  mapFinanceAccountGqlToUi,
  mapFinanceTransactionGqlToUi,
  type FinanceAccountGql,
  type FinanceTransactionGql,
} from "@/lib/finance/map-api"

describe("mapFinanceAccountGqlToUi", () => {
  it("GivenFullAccount_WhenMapped_ThenPreservesFields", () => {
    const raw: FinanceAccountGql = {
      id: "a1",
      organizationId: "o1",
      name: "Checking",
      kind: "ASSET",
      currency: "USD",
      openingBalanceCents: 250_000,
      description: "Primary",
      isActive: true,
    }
    const ui = mapFinanceAccountGqlToUi(raw)
    expect(ui.id).toBe("a1")
    expect(ui.openingBalanceCents).toBe(250_000)
    expect(ui.description).toBe("Primary")
    expect(ui.isActive).toBe(true)
  })

  it("GivenNullDescription_WhenMapped_ThenNull", () => {
    const raw: FinanceAccountGql = {
      id: "a1",
      organizationId: "o1",
      name: "Cat",
      kind: "INCOME",
      currency: "USD",
      openingBalanceCents: 0,
      description: null,
      isActive: true,
    }
    expect(mapFinanceAccountGqlToUi(raw).description).toBeNull()
  })
})

describe("mapFinanceTransactionGqlToUi", () => {
  it("GivenPostedTxn_WhenMapped_ThenDescriptionEmptyStringWhenNull", () => {
    const raw: FinanceTransactionGql = {
      id: "t1",
      organizationId: "o1",
      date: "2026-04-18",
      type: "INCOME",
      amountCents: 500_000,
      currency: "USD",
      accountId: "a1",
      categoryId: "c1",
      description: null,
      reference: null,
      status: "POSTED",
    }
    const ui = mapFinanceTransactionGqlToUi(raw)
    expect(ui.description).toBe("")
    expect(ui.reference).toBeNull()
    expect(ui.amountCents).toBe(500_000)
  })

  it("GivenZeroCents_WhenMapped_ThenZero", () => {
    const raw: FinanceTransactionGql = {
      id: "t1",
      organizationId: "o1",
      date: "2026-04-01",
      type: "EXPENSE",
      amountCents: 0,
      currency: "USD",
      accountId: "a1",
      categoryId: "c1",
      description: "x",
      reference: undefined,
      status: "POSTED",
    }
    expect(mapFinanceTransactionGqlToUi(raw).amountCents).toBe(0)
  })
})
