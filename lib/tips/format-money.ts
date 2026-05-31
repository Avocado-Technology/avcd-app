import { formatMoney } from "@/lib/finance/format-money"

/** Format tip amounts in cents for the tips UI (defaults to BRL for store prototype). */
export function formatTipsCents(cents: number, currency = "BRL"): string {
  return formatMoney(cents, currency)
}
