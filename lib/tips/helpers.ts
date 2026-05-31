export function calculateWeight(score: number, days: number): number {
  return Math.round(score * days * 100) / 100
}

export function calculateTipShare(
  weight: number,
  totalWeight: number,
  availablePoolCents: number,
): { amountCents: number; percentage: number } {
  const share = totalWeight > 0 ? weight / totalWeight : 0
  const amountCents = Math.round(availablePoolCents * share)
  const percentage = Math.round(share * 1000) / 10
  return { amountCents, percentage }
}

export function calculateLegalFee(
  totalCents: number,
  percentage: number,
): { legalFeeCents: number; poolCents: number } {
  const legalFeeCents = Math.round(totalCents * (percentage / 100))
  return {
    legalFeeCents,
    poolCents: totalCents - legalFeeCents,
  }
}

export interface EmployeeWeightInput {
  id: string
  careerScore: number
  daysWorked: number
}

export interface DistributionRow {
  id: string
  weight: number
  amountCents: number
  percentage: number
}

/**
 * Split `availablePoolCents` across employees by weight (score × days).
 * Applies remainder cents to the last row so totals match the pool.
 */
export function distributeTips(
  employees: EmployeeWeightInput[],
  availablePoolCents: number,
): DistributionRow[] {
  const withWeights = employees.map((e) => ({
    ...e,
    weight: calculateWeight(e.careerScore, e.daysWorked),
  }))
  const totalWeight = withWeights.reduce((sum, e) => sum + e.weight, 0)

  const rows: DistributionRow[] = withWeights.map((e) => {
    const { amountCents, percentage } = calculateTipShare(
      e.weight,
      totalWeight,
      availablePoolCents,
    )
    return {
      id: e.id,
      weight: e.weight,
      amountCents,
      percentage,
    }
  })

  const sumAmount = rows.reduce((s, r) => s + r.amountCents, 0)
  const diff = availablePoolCents - sumAmount
  if (rows.length > 0 && diff !== 0) {
    rows[rows.length - 1] = {
      ...rows[rows.length - 1]!,
      amountCents: rows[rows.length - 1]!.amountCents + diff,
    }
  }

  return rows
}
