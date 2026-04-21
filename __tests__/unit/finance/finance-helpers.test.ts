import { describe, it, expect } from "@jest/globals"
import {
  groupTransactionsByDate,
  filterTransactions,
  summarizeTransactions,
  computeMonthlyTotals,
  lastNMonthKeys,
} from "@/lib/finance/finance-helpers"
import type { MockFinanceTransaction } from "@/lib/finance/types"

const base = (
  partial: Partial<MockFinanceTransaction> & Pick<MockFinanceTransaction, "id" | "date">,
): MockFinanceTransaction => ({
  organizationId: "org-mock-1",
  type: "INCOME",
  amountCents: 100,
  currency: "USD",
  accountId: "a1",
  categoryId: "c1",
  description: "x",
  status: "POSTED",
  ...partial,
})

describe("groupTransactionsByDate", () => {
  it("GivenEmptyList_WhenGroupingByDate_ThenReturnsEmptyMap", () => {
    expect(groupTransactionsByDate([]).size).toBe(0)
  })

  it("GivenSameDayTxns_WhenGrouping_ThenSingleBucket", () => {
    const rows = [
      base({ id: "1", date: "2026-04-01", description: "a" }),
      base({ id: "2", date: "2026-04-01", description: "b" }),
    ]
    const m = groupTransactionsByDate(rows)
    expect(m.size).toBe(1)
    expect(m.get("2026-04-01")).toHaveLength(2)
  })

  it("GivenMultipleDates_WhenGrouping_ThenSortedNewestFirst", () => {
    const rows = [
      base({ id: "1", date: "2026-04-01" }),
      base({ id: "2", date: "2026-04-03" }),
      base({ id: "3", date: "2026-04-02" }),
    ]
    const keys = [...groupTransactionsByDate(rows).keys()]
    expect(keys).toEqual(["2026-04-03", "2026-04-02", "2026-04-01"])
  })
})

describe("filterTransactions", () => {
  const rows = [
    base({
      id: "1",
      date: "2026-04-10",
      description: "Office Rent April",
      status: "POSTED",
    }),
    base({
      id: "2",
      date: "2026-03-01",
      description: "Draft vendor",
      status: "DRAFT",
      reference: "REF-9",
    }),
    base({
      id: "3",
      date: "2026-04-05",
      description: "Other",
      accountId: "acc-x",
      categoryId: "cat-y",
      status: "POSTED",
    }),
  ]

  it("GivenSearchQuery_WhenFiltering_ThenMatchesDescriptionCaseInsensitive", () => {
    const out = filterTransactions(rows, { search: "rent" })
    expect(out.map((r) => r.id)).toEqual(["1"])
  })

  it("GivenSearchQuery_WhenFiltering_ThenMatchesReference", () => {
    const out = filterTransactions(rows, { search: "ref-9" })
    expect(out.map((r) => r.id)).toEqual(["2"])
  })

  it("GivenDateRange_WhenFiltering_ThenClipsInclusive", () => {
    const out = filterTransactions(rows, {
      dateFrom: "2026-04-01",
      dateTo: "2026-04-30",
    })
    expect(out.map((r) => r.id).sort()).toEqual(["1", "3"])
  })

  it("GivenAccountOrCategoryId_WhenFiltering_ThenMatchesEither", () => {
    const out = filterTransactions(rows, { accountOrCategoryId: "acc-x" })
    expect(out.map((r) => r.id)).toEqual(["3"])
    const out2 = filterTransactions(rows, { accountOrCategoryId: "cat-y" })
    expect(out2.map((r) => r.id)).toEqual(["3"])
  })
})

describe("summarizeTransactions", () => {
  it("GivenMixedRows_WhenSummarizing_ThenSumsIncomeAndExpense", () => {
    const rows: MockFinanceTransaction[] = [
      base({
        id: "1",
        date: "2026-04-01",
        type: "INCOME",
        amountCents: 1000,
        status: "POSTED",
      }),
      base({
        id: "2",
        date: "2026-04-02",
        type: "INCOME",
        amountCents: 500,
        status: "DRAFT",
      }),
      base({
        id: "3",
        date: "2026-04-03",
        type: "EXPENSE",
        amountCents: 300,
        status: "POSTED",
      }),
    ]
    const s = summarizeTransactions(rows)
    expect(s.totalIncomeCents).toBe(1500)
    expect(s.totalExpenseCents).toBe(300)
    expect(s.netCents).toBe(1200)
  })
})

describe("computeMonthlyTotals", () => {
  it("GivenBuckets_WhenComputing_ThenAggregatesByMonth", () => {
    const rows: MockFinanceTransaction[] = [
      base({
        id: "1",
        date: "2026-04-10",
        type: "INCOME",
        amountCents: 100_00,
        status: "POSTED",
      }),
      base({
        id: "2",
        date: "2026-04-15",
        type: "EXPENSE",
        amountCents: 40_00,
        status: "POSTED",
      }),
      base({
        id: "3",
        date: "2026-04-20",
        type: "INCOME",
        amountCents: 50_00,
        status: "DRAFT",
      }),
      base({
        id: "4",
        date: "2026-03-01",
        type: "INCOME",
        amountCents: 10_00,
        status: "POSTED",
      }),
    ]
    const keys = ["2026-03", "2026-04"]
    const totals = computeMonthlyTotals(rows, keys)
    expect(totals).toEqual([
      { monthKey: "2026-03", incomeCents: 10_00, expenseCents: 0 },
      { monthKey: "2026-04", incomeCents: 150_00, expenseCents: 40_00 },
    ])
  })

  it("GivenEmptyTransactions_WhenComputing_ThenReturnsZerosPerBucket", () => {
    const keys = ["2026-01", "2026-02"]
    expect(computeMonthlyTotals([], keys)).toEqual([
      { monthKey: "2026-01", incomeCents: 0, expenseCents: 0 },
      { monthKey: "2026-02", incomeCents: 0, expenseCents: 0 },
    ])
  })
})

describe("lastNMonthKeys", () => {
  it("GivenAnchorApril_WhenSixMonths_ThenSpansFromNovemberPriorYear", () => {
    expect(lastNMonthKeys("2026-04-15", 6)).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
    ])
  })
})
