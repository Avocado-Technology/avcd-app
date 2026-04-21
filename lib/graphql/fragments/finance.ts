/**
 * Finance fragments — aligned with API Strawberry types (camelCase fields).
 */

import { gql } from "@apollo/client"

export const FINANCE_ACCOUNT_FIELDS = gql`
  fragment FinanceAccountFields on FinanceAccount {
    id
    organizationId
    name
    kind
    currency
    openingBalanceCents
    description
    isActive
  }
`

export const FINANCE_TRANSACTION_FIELDS = gql`
  fragment FinanceTransactionFields on FinanceTransaction {
    id
    organizationId
    date
    type
    amountCents
    currency
    accountId
    categoryId
    description
    reference
    status
  }
`
