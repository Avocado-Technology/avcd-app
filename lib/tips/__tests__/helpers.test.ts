import { describe, expect, it } from "@jest/globals"

import { calculateLegalFee, calculateWeight, distributeTips } from "@/lib/tips/helpers"

describe("lib/tips/helpers", () => {
  it("calculateWeight rounds to two decimals", () => {
    expect(calculateWeight(6, 10)).toBe(60)
    expect(calculateWeight(3.5, 9)).toBe(31.5)
  })

  it("calculateLegalFee splits pool", () => {
    expect(calculateLegalFee(1000, 10)).toEqual({ legalFeeCents: 100, poolCents: 900 })
  })

  it("distributeTips assigns full pool including remainder on last row", () => {
    const employees = [
      { id: "a", careerScore: 10, daysWorked: 1 },
      { id: "b", careerScore: 10, daysWorked: 1 },
    ]
    const rows = distributeTips(employees, 101)
    expect(rows.reduce((s, r) => s + r.amountCents, 0)).toBe(101)
    expect(rows[0]!.amountCents + rows[1]!.amountCents).toBe(101)
  })
})
