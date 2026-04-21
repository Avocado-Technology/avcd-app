/**
 * Map GraphQL Finance types (Apollo / codegen shapes) into UI-facing finance types.
 */

import type {
  FinanceAccountKind,
  FinanceTransactionStatus,
  FinanceTransactionType,
  MockFinanceAccount,
  MockFinanceTransaction,
} from "@/lib/finance/types"

/** Raw account from GetFinanceAccounts query result item. */
export type FinanceAccountGql = {
  id: string
  organizationId: string
  name: string
  kind: FinanceAccountKind
  currency: string
  openingBalanceCents: number
  description?: string | null
  isActive: boolean
}

/** Raw transaction from GetFinanceTransactions query result item. */
export type FinanceTransactionGql = {
  id: string
  organizationId: string
  date: string
  type: FinanceTransactionType
  amountCents: number
  currency: string
  accountId: string
  categoryId: string
  description?: string | null
  reference?: string | null
  status: FinanceTransactionStatus
}

export function mapFinanceAccountGqlToUi(raw: FinanceAccountGql): MockFinanceAccount {
  return {
    id: raw.id,
    organizationId: raw.organizationId,
    name: raw.name,
    kind: raw.kind,
    currency: raw.currency,
    openingBalanceCents: raw.openingBalanceCents ?? 0,
    description: raw.description ?? null,
    isActive: Boolean(raw.isActive),
  }
}

export function mapFinanceTransactionGqlToUi(raw: FinanceTransactionGql): MockFinanceTransaction {
  return {
    id: raw.id,
    organizationId: raw.organizationId,
    date: raw.date,
    type: raw.type,
    amountCents: raw.amountCents ?? 0,
    currency: raw.currency,
    accountId: raw.accountId,
    categoryId: raw.categoryId,
    description: raw.description ?? "",
    reference: raw.reference ?? null,
    status: raw.status,
  }
}
