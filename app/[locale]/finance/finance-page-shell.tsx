"use client"

import { FinanceClientLive } from "@/app/[locale]/finance/finance-client-live"
import { FinanceClientMock } from "@/app/[locale]/finance/finance-client-mock"

/**
 * Picks mock vs API-backed finance at build time via NEXT_PUBLIC_FINANCE_DATA_SOURCE.
 * Two separate child components preserve Rules of Hooks (each calls one data hook).
 */
export function FinancePageShell() {
  const source = process.env.NEXT_PUBLIC_FINANCE_DATA_SOURCE ?? "mock"
  if (source === "api") {
    return <FinanceClientLive />
  }
  return <FinanceClientMock />
}
