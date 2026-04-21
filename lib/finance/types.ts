/**
 * Frontend finance types — mirror GraphQL/API field names for a future Apollo swap.
 * See API: domains/finance_accounts, domains/finance_transactions.
 */

export type FinanceAccountKind = "ASSET" | "INCOME" | "EXPENSE"

export type FinanceTransactionType = "INCOME" | "EXPENSE"

export type FinanceTransactionStatus = "DRAFT" | "POSTED"

/** Mirrors FinanceAccount (camelCase for TS). */
export interface MockFinanceAccount {
  id: string
  organizationId: string
  name: string
  kind: FinanceAccountKind
  currency: string
  openingBalanceCents: number
  description?: string | null
  isActive: boolean
}

/** Mirrors FinanceTransaction. */
export interface MockFinanceTransaction {
  id: string
  organizationId: string
  date: string
  type: FinanceTransactionType
  amountCents: number
  currency: string
  accountId: string
  categoryId: string
  description: string
  reference?: string | null
  status: FinanceTransactionStatus
}

/** Mirrors FinanceSummary roll-up fields. */
export interface MockFinanceSummary {
  totalIncomeCents: number
  totalExpenseCents: number
  netCents: number
  currency: string
  dateFrom?: string | null
  dateTo?: string | null
}
