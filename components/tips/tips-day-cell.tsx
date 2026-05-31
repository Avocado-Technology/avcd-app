"use client"

import { useTranslations } from "next-intl"

import type { CalendarDayData } from "@/lib/tips/types"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"

export type TipsDayCellProps = {
  date: Date
  data?: CalendarDayData
  selected?: boolean
  onSelect?: (date: Date) => void
  currency?: string
}

function getStoreStatusDot(storesReported: number, storeCount: number): {
  icon: string
  colorClass: string
  label: string
} {
  if (storeCount === 0) {
    return { icon: "—", colorClass: "text-[var(--g400)]", label: "No stores" }
  }
  if (storesReported === 0) {
    return { icon: "—", colorClass: "text-[var(--g400)]", label: "No data" }
  }
  if (storesReported < storeCount) {
    return { icon: "◐", colorClass: "text-amber-500", label: "Partial" }
  }
  return { icon: "●", colorClass: "text-[var(--green)]", label: "Complete" }
}

export function TipsDayCell({
  date,
  data,
  selected = false,
  onSelect,
  currency = "BRL",
}: TipsDayCellProps) {
  const t = useTranslations("Tips")
  const dayNumber = date.getDate()

  const hasData = data && data.totalCents > 0
  const { icon, colorClass, label } = hasData
    ? getStoreStatusDot(data.storesReported, data.storeCount)
    : getStoreStatusDot(0, 0)

  const isToday = new Date().toDateString() === date.toDateString()
  const isFuture = date > new Date()

  return (
    <button
      type="button"
      onClick={() => onSelect?.(date)}
      disabled={isFuture}
      className={cn(
        "flex h-full w-full flex-col items-start justify-start gap-0.5 rounded-[var(--r-md)] border p-2 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g900)] focus-visible:ring-offset-2",
        isFuture && "cursor-not-allowed opacity-40",
        selected && "border-[var(--g900)] ring-2 ring-[var(--g900)] ring-offset-1",
        !selected && !isFuture && "border-[var(--g200)] hover:border-[var(--g500)] hover:bg-[var(--g50)]",
        isToday && !selected && "border-[var(--green)]",
      )}
      aria-label={t("dayCellAria", {
        date: date.toLocaleDateString(),
        amount: hasData ? formatTipsCents(data.totalCents, currency) : t("noData"),
        stores: hasData ? `${data.storesReported}/${data.storeCount}` : "0/0",
      })}
      aria-pressed={selected}
    >
      {/* Day number */}
      <span
        className={cn(
          "text-sm font-semibold",
          isToday ? "text-[var(--green)]" : "text-[var(--g900)]",
        )}
      >
        {dayNumber}
      </span>

      {/* Amount */}
      <span
        className={cn(
          "font-mono text-xs font-medium tabular-nums",
          hasData ? "text-[var(--green)]" : "text-[var(--g400)]",
        )}
      >
        {hasData ? formatTipsCents(data.totalCents, currency) : "—"}
      </span>

      {/* Store status */}
      <span
        className={cn(
          "flex items-center gap-1 font-mono text-[0.625rem] tabular-nums",
          "text-[var(--g500)]",
        )}
        aria-label={label}
      >
        {hasData ? `${data.storesReported}/${data.storeCount}` : "0/0"}
        <span className={cn("text-[0.5rem]", colorClass)} aria-hidden>
          {icon}
        </span>
      </span>
    </button>
  )
}
