import { describe, it, expect } from "@jest/globals"
import { formatMoney, formatSignedMoney } from "@/lib/finance/format-money"

describe("formatMoney", () => {
  it("GivenPositiveCents_WhenFormattingUSD_ThenShowsCurrencySymbol", () => {
    const s = formatMoney(123456, "USD")
    expect(s).toMatch(/\$/)
    expect(s).toMatch(/1,234\.56/)
  })

  it("GivenZeroCents_WhenFormatting_ThenShowsZeroNotNaN", () => {
    expect(formatMoney(0, "USD")).toMatch(/0\.00/)
    expect(formatMoney(0, "USD")).not.toMatch(/NaN/)
  })

  it("GivenNonFiniteCents_WhenFormatting_ThenTreatsAsZero", () => {
    expect(formatMoney(Number.NaN, "USD")).toMatch(/0\.00/)
  })

  it("GivenNegativeCents_WhenFormatting_ThenShowsNegativeCurrency", () => {
    const s = formatMoney(-500, "USD")
    expect(s).toMatch(/\$/)
    expect(s.includes("-") || s.includes("−")).toBe(true)
  })
})

describe("formatSignedMoney", () => {
  it("GivenIncome_WhenFormatting_ThenPrefixesPlus", () => {
    expect(formatSignedMoney(100_00, "INCOME", "USD")).toMatch(/^\+/)
  })

  it("GivenExpense_WhenFormatting_ThenPrefixesMinus", () => {
    expect(formatSignedMoney(100_00, "EXPENSE", "USD")).toMatch(/^−/)
  })
})
