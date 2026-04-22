'use client'

/**
 * Top chrome for the org chart view — matches {@link FinancePageHeader} spacing and borders.
 */
export function OrgChartPageHeader() {
  return (
    <header className="flex w-full shrink-0 flex-col gap-[var(--sp-4)] border-b border-[var(--g200)] bg-[var(--bg)] px-[var(--sp-4)] py-[var(--sp-4)] lg:flex-row lg:items-center lg:justify-between lg:px-[var(--sp-6)] lg:py-[var(--sp-5)]">
      <div aria-hidden />
    </header>
  )
}
