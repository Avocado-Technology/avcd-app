"use client"

import { FinanceClientLayout } from "@/app/[locale]/finance/finance-client-layout"
import { useMockFinance } from "@/lib/hooks/use-mock-finance"

export function FinanceClientMock() {
  const f = useMockFinance()
  return <FinanceClientLayout {...f} />
}
