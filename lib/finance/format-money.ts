/**
 * Format integer cents with Intl; amounts are unsigned in data — use type for sign in UI.
 */

export function formatMoney(cents: number, currency: string): string {
  const safe = Number.isFinite(cents) ? cents : 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe / 100)
}

/**
 * Signed display: INCOME shows +, EXPENSE shows −; uses absolute cents.
 */
export function formatSignedMoney(
  cents: number,
  type: "INCOME" | "EXPENSE",
  currency: string,
): string {
  const abs = Math.abs(Number.isFinite(cents) ? cents : 0)
  const core = formatMoney(abs, currency)
  if (type === "INCOME") return `+${core}`
  return `−${core}`
}
