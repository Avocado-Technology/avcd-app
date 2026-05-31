"use client"

import { ChevronRight, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Eyebrow } from "@/components/ui/eyebrow"
import type { CalendarDayData } from "@/lib/tips/types"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"

export type TipsDateSheetProps = {
  date: Date | null
  data: CalendarDayData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectStore: (storeId: string) => void
  currency?: string
}

function formatFullDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date)
}

function StoreRow({
  id,
  name,
  totalCents,
  distributableCents,
  reported,
  totalDayCents,
  onSelect,
  currency,
}: {
  id: string
  name: string
  totalCents: number
  distributableCents: number
  reported: boolean
  totalDayCents: number
  onSelect: () => void
  currency: string
}) {
  const t = useTranslations("Tips")
  const percentage = totalDayCents > 0 ? Math.round((totalCents / totalDayCents) * 1000) / 10 : 0

  if (!reported) {
    return (
      <div className="flex items-center gap-3 rounded-[var(--r-lg)] border border-amber-200 bg-amber-50 p-3">
        <span className="flex h-2 w-2 rounded-full bg-amber-400" aria-hidden />
        <div className="flex-1">
          <p className="font-medium text-amber-800">{name}</p>
          <p className="font-mono text-xs text-amber-600">{t("missingReport")}</p>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-[var(--r-lg)] border border-[var(--g200)] bg-[var(--bg)] p-3",
        "text-left transition-colors hover:border-[var(--g500)] hover:bg-[var(--g50)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g900)]",
      )}
    >
      <span
        className={cn(
          "flex h-2 w-2 shrink-0 rounded-full",
          reported ? "bg-[var(--green)]" : "bg-amber-400",
        )}
        aria-hidden
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--g900)]">{name}</p>
        <p className="font-mono text-xs text-[var(--g500)]">
          {t("distributable")}: {formatTipsCents(distributableCents, currency)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-medium tabular-nums text-[var(--g900)]">
          {formatTipsCents(totalCents, currency)}
        </p>
        <p className="font-mono text-xs tabular-nums text-[var(--g500)]">
          {percentage.toFixed(1)}%
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--g400)]" aria-hidden />
    </button>
  )
}

export function TipsDateSheet({
  date,
  data,
  open,
  onOpenChange,
  onSelectStore,
  currency = "BRL",
}: TipsDateSheetProps) {
  const t = useTranslations("Tips")
  const locale = useLocale()
  const dateLocale = locale.startsWith("pt") ? "pt-BR" : "en-US"

  const totalCollected = data?.totalCents ?? 0
  const legalFeeCents = data?.stores.reduce((sum, s) => sum + s.legalFeeCents, 0) ?? 0
  const distributableCents = data?.stores.reduce((sum, s) => sum + s.distributableCents, 0) ?? 0
  const reportedStores = data?.stores.filter((s) => s.reported) ?? []
  const missingStores = data?.stores.filter((s) => !s.reported) ?? []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden border-l border-[var(--g200)] bg-[var(--bg)] p-0 shadow-none sm:max-w-md"
      >
        <SheetHeader className="shrink-0 space-y-0 border-b border-[var(--g200)] px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
                {t("storeBreakdown")}
              </p>
              <SheetTitle className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--g900)]">
                {date ? formatFullDate(date, dateLocale) : "—"}
              </SheetTitle>
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
          {/* Totals summary */}
          {data && (
            <div className="rounded-[var(--r-lg)] border border-[var(--g200)] bg-[var(--g50)] p-4">
              <dl className="space-y-2">
                <div className="flex justify-between gap-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--g500)]">
                    {t("totalCollected")}
                  </dt>
                  <dd className="font-mono text-sm font-medium tabular-nums text-[var(--g900)]">
                    {formatTipsCents(totalCollected, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--g500)]">
                    {t("legalFee", { percent: 10 })}
                  </dt>
                  <dd className="font-mono text-sm tabular-nums text-[var(--g700)]">
                    {formatTipsCents(legalFeeCents, currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-[var(--g200)] pt-2">
                  <dt className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--g500)]">
                    {t("distributable")}
                  </dt>
                  <dd className="font-mono text-sm font-medium tabular-nums text-[var(--green)]">
                    {formatTipsCents(distributableCents, currency)}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Reported stores */}
          {reportedStores.length > 0 && (
            <div className="space-y-3">
              <Eyebrow as="h3">{t("storesReported")}</Eyebrow>
              <div className="flex flex-col gap-2">
                {reportedStores.map((store) => (
                  <StoreRow
                    key={store.id}
                    id={store.id}
                    name={store.name}
                    totalCents={store.totalCents}
                    distributableCents={store.distributableCents}
                    reported={store.reported}
                    totalDayCents={totalCollected}
                    onSelect={() => onSelectStore(store.id)}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Missing stores */}
          {missingStores.length > 0 && (
            <div className="space-y-3">
              <Eyebrow as="h3" className="text-amber-600">
                {t("storesMissing")}
              </Eyebrow>
              <div className="flex flex-col gap-2">
                {missingStores.map((store) => (
                  <StoreRow
                    key={store.id}
                    id={store.id}
                    name={store.name}
                    totalCents={store.totalCents}
                    distributableCents={store.distributableCents}
                    reported={store.reported}
                    totalDayCents={totalCollected}
                    onSelect={() => {}}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          )}

          {!data && (
            <p className="text-center text-sm text-[var(--g500)]">{t("noDataForDate")}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
