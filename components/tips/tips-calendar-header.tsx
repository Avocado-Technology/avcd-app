"use client"

import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"

export type TipsCalendarHeaderProps = {
  month: Date
  onMonthChange: (date: Date) => void
  monthlyTotalCents: number
  avgDailyTipCents: number
  missingDaysCount: number
  currency?: string
  onAddTips: () => void
}

function formatMonthYear(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date)
}

function KpiChip({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string
  variant?: "default" | "warning"
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-[var(--r-lg)] border px-3 py-2",
        variant === "warning"
          ? "border-amber-200 bg-amber-50"
          : "border-[var(--g200)] bg-[var(--g50)]",
      )}
    >
      <span
        className={cn(
          "font-mono text-[0.625rem] font-medium uppercase tracking-[0.06em]",
          variant === "warning" ? "text-amber-700" : "text-[var(--g500)]",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-sm font-semibold tabular-nums",
          variant === "warning" ? "text-amber-700" : "text-[var(--g900)]",
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function TipsCalendarHeader({
  month,
  onMonthChange,
  monthlyTotalCents,
  avgDailyTipCents,
  missingDaysCount,
  currency = "BRL",
  onAddTips,
}: TipsCalendarHeaderProps) {
  const t = useTranslations("Tips")

  const handlePreviousMonth = () => {
    const newDate = new Date(month)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(month)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  const isCurrentMonth = month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()

  return (
    <header
      className={cn(
        SURFACE_CARD_CLASS,
        "flex flex-col gap-[var(--sp-4)] p-[var(--sp-4)]",
        "sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      {/* Left: KPI chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        <KpiChip label={t("monthTotal")} value={formatTipsCents(monthlyTotalCents, currency)} />
        <KpiChip label={t("avgPerDay")} value={formatTipsCents(avgDailyTipCents, currency)} />
        {missingDaysCount > 0 && (
          <KpiChip label={t("missingDays")} value={String(missingDaysCount)} variant="warning" />
        )}
      </div>

      {/* Right: Month nav + Add button */}
      <div className="flex items-center gap-3">
        {/* Month navigator */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-[var(--r-md)]"
            onClick={handlePreviousMonth}
            aria-label={t("previousMonth")}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>

          <span className="min-w-[120px] text-center text-sm font-semibold text-[var(--g900)]">
            {formatMonthYear(month, "pt-BR")}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-[var(--r-md)]"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            aria-label={t("nextMonth")}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        {/* Add Tips button */}
        <Button
          type="button"
          variant="green"
          size="sm"
          className="shrink-0"
          onClick={onAddTips}
        >
          <Plus className="h-4 w-4" aria-hidden />
          {t("addTips")}
        </Button>
      </div>
    </header>
  )
}
