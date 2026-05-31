"use client"

import { Minus, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import type { CareerLevel, EmployeeTipShare } from "@/lib/tips/types"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"

export type DistributionCardMobileProps = {
  distributions: EmployeeTipShare[]
  currency: string
  onDaysWorkedChange: (employeeId: string, days: number) => void
}

function levelLabelKey(level: CareerLevel): `careerLevel.${CareerLevel}` {
  return `careerLevel.${level}` as const
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

export function DistributionCardMobile({
  distributions,
  currency,
  onDaysWorkedChange,
}: DistributionCardMobileProps) {
  const t = useTranslations("Tips")

  return (
    <ul className="flex flex-col gap-[var(--sp-4)]" aria-label={t("distributionCardsLabel")}>
      {distributions.map((row) => (
        <li key={row.id} className={cn(SURFACE_CARD_CLASS, "p-[var(--sp-4)]")}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-lg)] border border-[var(--g200)] bg-[var(--g100)] font-mono text-xs font-medium text-[var(--g700)]"
                aria-hidden
              >
                {initials(row.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--g900)]">{row.name}</p>
                <p className="font-mono text-xs text-[var(--g500)]">
                  {t(levelLabelKey(row.careerLevel))} · {row.careerScore.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm font-medium tabular-nums text-[var(--green)]">
                {formatTipsCents(row.tipAmountCents, currency)}
              </p>
              <p className="font-mono text-xs tabular-nums text-[var(--g500)]">
                {row.tipPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-[var(--r-sm)] bg-[var(--g100)]"
            role="img"
            aria-label={t("scoreBarAria", { score: row.careerScore })}
          >
            <div
              className="h-full rounded-[var(--r-sm)] bg-[var(--green)]"
              style={{ width: `${Math.min(100, (row.careerScore / 10) * 100)}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--g100)] pt-4">
            <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
              {t("daysWorked")}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-9 w-9"
                aria-label={t("decreaseDays")}
                onClick={() => onDaysWorkedChange(row.id, row.daysWorked - 1)}
              >
                <Minus className="h-4 w-4" aria-hidden />
              </Button>
              <Input
                type="number"
                min={0}
                inputMode="numeric"
                className="h-9 w-14 border-[var(--g500)] bg-[var(--bg)] text-center font-mono text-sm tabular-nums"
                value={row.daysWorked}
                aria-label={t("daysWorkedInputAria", { name: row.name })}
                onChange={(e) => {
                  const v = Number.parseInt(e.target.value, 10)
                  onDaysWorkedChange(row.id, Number.isFinite(v) ? v : 0)
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-9 w-9"
                aria-label={t("increaseDays")}
                onClick={() => onDaysWorkedChange(row.id, row.daysWorked + 1)}
              >
                <Plus className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex justify-between font-mono text-xs text-[var(--g500)]">
            <span>{t("weight")}</span>
            <span className="tabular-nums text-[var(--g900)]">{row.weight}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
