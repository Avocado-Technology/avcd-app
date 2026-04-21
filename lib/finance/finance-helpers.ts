import type { MockFinanceTransaction } from "./types"

export interface MonthlyTotalRow {
  monthKey: string
  incomeCents: number
  expenseCents: number
}

export interface FilterCriteria {
  dateFrom?: string | null
  dateTo?: string | null
  /** Match txn.accountId or txn.categoryId */
  accountOrCategoryId?: string | null
  search?: string
}

/** Group by ISO date string (YYYY-MM-DD), newest dates first. */
export function groupTransactionsByDate(
  transactions: MockFinanceTransaction[],
): Map<string, MockFinanceTransaction[]> {
  const map = new Map<string, MockFinanceTransaction[]>()
  for (const t of transactions) {
    const list = map.get(t.date)
    if (list) list.push(t)
    else map.set(t.date, [t])
  }
  return new Map(
    [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0)),
  )
}

export function filterTransactions(
  transactions: MockFinanceTransaction[],
  criteria: FilterCriteria,
): MockFinanceTransaction[] {
  const from = criteria.dateFrom?.trim() || null
  const to = criteria.dateTo?.trim() || null
  const id = criteria.accountOrCategoryId?.trim() || null
  const q = criteria.search?.trim().toLowerCase() || ""

  return transactions.filter((t) => {
    if (from && t.date < from) return false
    if (to && t.date > to) return false
    if (id && t.accountId !== id && t.categoryId !== id) return false
    if (q) {
      const hay = `${t.description} ${t.reference ?? ""}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

/** Sum INCOME vs EXPENSE for the given rows (amounts stored positive). */
export function summarizeTransactions(
  transactions: MockFinanceTransaction[],
): { totalIncomeCents: number; totalExpenseCents: number; netCents: number } {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === "INCOME") income += t.amountCents
    else expense += t.amountCents
  }
  return {
    totalIncomeCents: income,
    totalExpenseCents: expense,
    netCents: income - expense,
  }
}

/**
 * Aggregate INCOME / EXPENSE cents per month.
 * `monthKeys` should be chronological (oldest first) for display left-to-right.
 */
export function computeMonthlyTotals(
  transactions: MockFinanceTransaction[],
  monthKeys: string[],
): MonthlyTotalRow[] {
  const keys = new Set(monthKeys)
  const incomeByMonth = new Map<string, number>()
  const expenseByMonth = new Map<string, number>()
  for (const k of monthKeys) {
    incomeByMonth.set(k, 0)
    expenseByMonth.set(k, 0)
  }

  for (const t of transactions) {
    const monthKey = t.date.slice(0, 7)
    if (!keys.has(monthKey)) continue
    if (t.type === "INCOME") {
      incomeByMonth.set(monthKey, (incomeByMonth.get(monthKey) ?? 0) + t.amountCents)
    } else {
      expenseByMonth.set(monthKey, (expenseByMonth.get(monthKey) ?? 0) + t.amountCents)
    }
  }

  return monthKeys.map((monthKey) => ({
    monthKey,
    incomeCents: incomeByMonth.get(monthKey) ?? 0,
    expenseCents: expenseByMonth.get(monthKey) ?? 0,
  }))
}

/** Last N calendar months as YYYY-MM, oldest first, ending at the anchor month (YYYY-MM-DD). */
export function lastNMonthKeys(anchorIsoDate: string, n: number): string[] {
  const parts = anchorIsoDate.split("-")
  const year = Number(parts[0])
  const month = Number(parts[1])
  const out: string[] = []
  for (let offset = -(n - 1); offset <= 0; offset++) {
    let y = year
    let m = month + offset
    while (m <= 0) {
      m += 12
      y -= 1
    }
    while (m > 12) {
      m -= 12
      y += 1
    }
    out.push(`${y}-${String(m).padStart(2, "0")}`)
  }
  return out
}
