/**
 * Finance queries — amounts in minor units (cents); filtering for the table is mostly client-side.
 */

import { gql } from "@apollo/client"

import { FINANCE_ACCOUNT_FIELDS, FINANCE_TRANSACTION_FIELDS } from "../fragments/finance"

export const GET_FINANCE_ACCOUNTS = gql`
  query GetFinanceAccounts($organizationId: String!) {
    financeAccounts(organizationId: $organizationId) {
      ...FinanceAccountFields
    }
  }
  ${FINANCE_ACCOUNT_FIELDS}
`

export const GET_FINANCE_TRANSACTIONS = gql`
  query GetFinanceTransactions($organizationId: String!) {
    financeTransactions(organizationId: $organizationId) {
      ...FinanceTransactionFields
    }
  }
  ${FINANCE_TRANSACTION_FIELDS}
`
