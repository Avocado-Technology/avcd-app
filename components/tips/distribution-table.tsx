"use client"

import { useMemo, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CareerLevel, EmployeeTipShare } from "@/lib/tips/types"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"

export type DistributionTableProps = {
  distributions: EmployeeTipShare[]
  currency: string
  onDaysWorkedChange: (employeeId: string, days: number) => void
}

type SortKey = "name" | "careerScore" | "daysWorked" | "weight" | "tipAmountCents"

function levelLabelKey(level: CareerLevel): `careerLevel.${CareerLevel}` {
  return `careerLevel.${level}` as const
}

export function DistributionTable({
  distributions,
  currency,
  onDaysWorkedChange,
}: DistributionTableProps) {
  const t = useTranslations("Tips")
  const [sortKey, setSortKey] = useState<SortKey>("tipAmountCents")
  const [sortDesc, setSortDesc] = useState(true)

  const sorted = useMemo(() => {
    const copy = [...distributions]
    copy.sort((a, b) => {
      const dir = sortDesc ? -1 : 1
      if (sortKey === "name") {
        return a.name.localeCompare(b.name) * dir
      }
      const av = a[sortKey] as number
      const bv = b[sortKey] as number
      return (av - bv) * dir
    })
    return copy
  }, [distributions, sortDesc, sortKey])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc((d) => !d)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
  }

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDesc ? "↓" : "↑") : ""

  return (
    <div
      className="overflow-hidden rounded-[var(--r-xl)] border border-[var(--g200)] bg-[var(--bg)]"
      role="region"
      aria-label={t("distributionTableLabel")}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--g200)] bg-[var(--g50)]">
              <th scope="col" className="p-4 font-mono text-[0.6875rem] font-medium text-[var(--g500)]">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 uppercase tracking-[0.06em] text-[var(--g500)] hover:text-[var(--g900)]"
                  onClick={() => toggleSort("name")}
                >
                  {t("employee")}
                  <span className="sr-only">
                    {sortKey === "name" ? (sortDesc ? t("sortedDescending") : t("sortedAscending")) : ""}
                  </span>
                  <span aria-hidden className="text-[0.625rem]">
                    {sortIndicator("name")}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                className="p-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 uppercase tracking-[0.06em] text-[var(--g500)] hover:text-[var(--g900)]"
                  onClick={() => toggleSort("careerScore")}
                >
                  {t("careerScore")}
                  <span className="sr-only">
                    {sortKey === "careerScore"
                      ? sortDesc
                        ? t("sortedDescending")
                        : t("sortedAscending")
                      : ""}
                  </span>
                  <span aria-hidden className="text-[0.625rem]">
                    {sortIndicator("careerScore")}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                className="p-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 uppercase tracking-[0.06em] text-[var(--g500)] hover:text-[var(--g900)]"
                  onClick={() => toggleSort("daysWorked")}
                >
                  {t("daysWorked")}
                  <span className="sr-only">
                    {sortKey === "daysWorked"
                      ? sortDesc
                        ? t("sortedDescending")
                        : t("sortedAscending")
                      : ""}
                  </span>
                  <span aria-hidden className="text-[0.625rem]">
                    {sortIndicator("daysWorked")}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                className="p-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 uppercase tracking-[0.06em] text-[var(--g500)] hover:text-[var(--g900)]"
                  onClick={() => toggleSort("weight")}
                >
                  {t("weight")}
                  <span className="sr-only">
                    {sortKey === "weight"
                      ? sortDesc
                        ? t("sortedDescending")
                        : t("sortedAscending")
                      : ""}
                  </span>
                  <span aria-hidden className="text-[0.625rem]">
                    {sortIndicator("weight")}
                  </span>
                </button>
              </th>
              <th
                scope="col"
                className="p-4 text-right font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]"
              >
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-end gap-1 uppercase tracking-[0.06em] text-[var(--g500)] hover:text-[var(--g900)]"
                  onClick={() => toggleSort("tipAmountCents")}
                >
                  {t("tipShare")}
                  <span className="sr-only">
                    {sortKey === "tipAmountCents"
                      ? sortDesc
                        ? t("sortedDescending")
                        : t("sortedAscending")
                      : ""}
                  </span>
                  <span aria-hidden className="text-[0.625rem]">
                    {sortIndicator("tipAmountCents")}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--g200)] transition-colors last:border-b-0 hover:bg-[var(--g50)]"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-lg)] border border-[var(--g200)] bg-[var(--g100)] font-mono text-xs font-medium text-[var(--g700)]"
                      aria-hidden
                    >
                      {initials(row.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--g900)]">{row.name}</p>
                      <p className="font-mono text-xs text-[var(--g500)]">{t(levelLabelKey(row.careerLevel))}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex max-w-[140px] flex-col gap-2">
                    <div
                      className="h-2 w-full overflow-hidden rounded-[var(--r-sm)] bg-[var(--g100)]"
                      role="img"
                      aria-label={t("scoreBarAria", { score: row.careerScore })}
                    >
                      <div
                        className="h-full rounded-[var(--r-sm)] bg-[var(--green)]"
                        style={{ width: `${Math.min(100, (row.careerScore / 10) * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm tabular-nums text-[var(--g900)]">
                      {row.careerScore.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 shrink-0"
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
                      className="h-9 w-9 shrink-0"
                      aria-label={t("increaseDays")}
                      onClick={() => onDaysWorkedChange(row.id, row.daysWorked + 1)}
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </td>
                <td className="p-4 font-mono text-sm tabular-nums text-[var(--g700)]">{row.weight}</td>
                <td className="p-4 text-right">
                  <p className="font-mono text-sm font-medium tabular-nums text-[var(--green)]">
                    {formatTipsCents(row.tipAmountCents, currency)}
                  </p>
                  <p className="font-mono text-xs tabular-nums text-[var(--g500)]">
                    {row.tipPercentage.toFixed(1)}%
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}
