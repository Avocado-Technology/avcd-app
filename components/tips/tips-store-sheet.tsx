"use client"

import { ArrowLeft, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Eyebrow } from "@/components/ui/eyebrow"
import type { CalendarStoreEntry } from "@/lib/tips/types"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"
import { DistributionTable } from "./distribution-table"
import { DistributionCardMobile } from "./distribution-card-mobile"

export type TipsStoreSheetProps = {
  store: CalendarStoreEntry | null
  date: Date | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  currency?: string
}

function formatFullDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function TipsStoreSheet({
  store,
  date,
  open,
  onOpenChange,
  onBack,
  currency = "BRL",
}: TipsStoreSheetProps) {
  const t = useTranslations("Tips")
  const locale = useLocale()
  const dateLocale = locale.startsWith("pt") ? "pt-BR" : "en-US"

  // No-op for daysWorkedChange in the read-only drilldown view
  const handleDaysWorkedChange = () => {
    // In the future, this could update the mock data
    // For now, it's read-only
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden border-l border-[var(--g200)] bg-[var(--bg)] p-0 shadow-none sm:max-w-2xl"
      >
        <SheetHeader className="shrink-0 space-y-0 border-b border-[var(--g200)] px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-[var(--r-md)]"
                onClick={onBack}
                aria-label={t("backToStores")}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Button>
              <div>
                <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
                  {t("employeeBreakdown")}
                </p>
                <SheetTitle className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--g900)]">
                  {store?.name ?? "—"}
                </SheetTitle>
                <p className="text-sm text-[var(--g500)]">
                  {date ? formatFullDate(date, dateLocale) : "—"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-[var(--r-md)]"
              onClick={() => onOpenChange(false)}
              aria-label={t("close")}
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          {/* Store summary */}
          {store && (
            <div className="rounded-[var(--r-lg)] border border-[var(--g200)] bg-[var(--g50)] p-4">
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
                    {t("totalCollected")}
                  </dt>
                  <dd className="mt-1 font-mono text-base font-medium tabular-nums text-[var(--g900)]">
                    {formatTipsCents(store.totalCents, currency)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
                    {t("legalFee", { percent: 10 })}
                  </dt>
                  <dd className="mt-1 font-mono text-base tabular-nums text-[var(--g700)]">
                    {formatTipsCents(store.legalFeeCents, currency)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
                    {t("distributable")}
                  </dt>
                  <dd className="mt-1 font-mono text-base font-medium tabular-nums text-[var(--green)]">
                    {formatTipsCents(store.distributableCents, currency)}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Employee distribution */}
          {store && store.employees.length > 0 && (
            <section className="flex flex-1 flex-col" aria-labelledby="employee-distribution-heading">
              <Eyebrow as="h2" id="employee-distribution-heading" className="mb-3">
                {t("employeeDistribution")}
              </Eyebrow>

              <div className="hidden lg:block">
                <DistributionTable
                  distributions={store.employees}
                  currency={currency}
                  onDaysWorkedChange={handleDaysWorkedChange}
                />
              </div>
              <div className="lg:hidden">
                <DistributionCardMobile
                  distributions={store.employees}
                  currency={currency}
                  onDaysWorkedChange={handleDaysWorkedChange}
                />
              </div>

              {/* Total row */}
              <div className="mt-4 flex flex-col gap-2 border-t border-[var(--g200)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-sm text-[var(--g500)]">{t("totalDistributed")}</p>
                <p className="font-mono text-sm font-medium tabular-nums text-[var(--g900)]">
                  {formatTipsCents(
                    store.employees.reduce((sum, e) => sum + e.tipAmountCents, 0),
                    currency,
                  )}
                  <span className="mx-2 text-[var(--g400)]">/</span>
                  {formatTipsCents(store.distributableCents, currency)}
                </p>
              </div>
            </section>
          )}

          {store && store.employees.length === 0 && (
            <p className="text-center text-sm text-[var(--g500)]">{t("noEmployeesForStore")}</p>
          )}

          {!store && (
            <p className="text-center text-sm text-[var(--g500)]">{t("selectStoreFirst")}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
