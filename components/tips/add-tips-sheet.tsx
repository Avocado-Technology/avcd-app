"use client"

import { useEffect, useId, useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { calculateLegalFee } from "@/lib/tips/helpers"
import type { AddTipsEntryInput } from "@/lib/tips/types"
import { formatTipsCents } from "@/lib/tips/format-money"
import { cn } from "@/lib/utils"

export type AddTipsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (entry: AddTipsEntryInput) => void
  legalFeePercentage: number
  currency: string
  side: "bottom" | "right"
}

function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function majorToCents(value: string): number {
  const n = Number.parseFloat(value.replace(",", "."))
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100)
}

export function AddTipsSheet({
  open,
  onOpenChange,
  onAdd,
  legalFeePercentage,
  currency,
  side,
}: AddTipsSheetProps) {
  const t = useTranslations("Tips")
  const cashId = useId()
  const cardId = useId()
  const dateId = useId()
  const notesId = useId()

  const [dateStr, setDateStr] = useState(todayIsoDate())
  const [cashMajor, setCashMajor] = useState("")
  const [cardMajor, setCardMajor] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!open) return
    setDateStr(todayIsoDate())
    setCashMajor("")
    setCardMajor("")
    setNotes("")
  }, [open])

  const cashCents = majorToCents(cashMajor)
  const cardCents = majorToCents(cardMajor)
  const totalCents = cashCents + cardCents
  const { legalFeeCents, poolCents } = calculateLegalFee(totalCents, legalFeePercentage)

  const submit = () => {
    const date = new Date(`${dateStr}T12:00:00`)
    onAdd({
      date,
      cashTipsCents: cashCents,
      cardTipsCents: cardCents,
      notes: notes.trim() || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "overflow-y-auto border-[var(--g200)] shadow-none",
          side === "bottom" && "max-h-[90vh] rounded-t-[var(--r-xl)]",
          side === "right" && "h-full w-full max-w-md border-l sm:max-w-md",
        )}
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-semibold tracking-[-0.03em] text-[var(--g900)]">
            {t("addTipsSheetTitle")}
          </SheetTitle>
          <SheetDescription className="text-[var(--g500)]">{t("addTipsSheetDescription")}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 border-t border-[var(--g100)] pt-6">
          <div className="flex flex-col gap-1">
            <label htmlFor={dateId} className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
              {t("date")}
            </label>
            <Input
              id={dateId}
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="border-[var(--g500)] bg-[var(--bg)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={cashId} className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
              {t("cashTipsMajor", { currency })}
            </label>
            <Input
              id={cashId}
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={cashMajor}
              onChange={(e) => setCashMajor(e.target.value)}
              className="border-[var(--g500)] bg-[var(--bg)] font-mono tabular-nums"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={cardId} className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
              {t("cardTipsMajor", { currency })}
            </label>
            <Input
              id={cardId}
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={cardMajor}
              onChange={(e) => setCardMajor(e.target.value)}
              className="border-[var(--g500)] bg-[var(--bg)] font-mono tabular-nums"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={notesId} className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
              {t("notesOptional")}
            </label>
            <Input
              id={notesId}
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-[var(--g500)] bg-[var(--bg)]"
              autoComplete="off"
            />
          </div>

          <dl className="space-y-2 rounded-[var(--r-md)] border border-[var(--g200)] bg-[var(--g50)] p-4 font-mono text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--g500)]">{t("previewTotal")}</dt>
              <dd className="tabular-nums text-[var(--g900)]">{formatTipsCents(totalCents, currency)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--g500)]">{t("legalFee", { percent: legalFeePercentage })}</dt>
              <dd className="tabular-nums text-[var(--g700)]">{formatTipsCents(legalFeeCents, currency)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-[var(--g200)] pt-2">
              <dt className="text-[var(--g500)]">{t("previewToPool")}</dt>
              <dd className="tabular-nums font-medium text-[var(--green)]">{formatTipsCents(poolCents, currency)}</dd>
            </div>
          </dl>
        </div>

        <SheetFooter className="mt-8 border-t border-[var(--g100)] pt-6">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button type="button" variant="green" onClick={submit} disabled={totalCents <= 0}>
            {t("addToPool")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
