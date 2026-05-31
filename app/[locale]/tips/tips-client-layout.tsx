"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

import {
  AddTipsSheet,
  TipsCalendarGrid,
  TipsCalendarHeader,
  TipsDateSheet,
  TipsStoreSheet,
} from "@/components/tips"
import { useBreakpoint } from "@/lib/breakpoints"
import type { TipsCalendarViewModel } from "@/lib/tips/types"

function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function TipsCalendarLayout(viewModel: TipsCalendarViewModel) {
  const t = useTranslations("Tips")
  const breakpoint = useBreakpoint()
  const [addTipsOpen, setAddTipsOpen] = useState(false)

  // Compute derived state for sheets
  const selectedDateData = useMemo(() => {
    if (!viewModel.selectedDate) return null
    const key = formatDateKey(viewModel.selectedDate)
    return viewModel.calendarData.get(key) ?? null
  }, [viewModel.selectedDate, viewModel.calendarData])

  const selectedStore = useMemo(() => {
    if (!selectedDateData || !viewModel.selectedStoreId) return null
    return selectedDateData.stores.find((s) => s.id === viewModel.selectedStoreId) ?? null
  }, [selectedDateData, viewModel.selectedStoreId])

  // Sheet open states
  const dateSheetOpen = viewModel.selectedDate !== null
  const storeSheetOpen = viewModel.selectedDate !== null && viewModel.selectedStoreId !== null

  const handleDateSheetClose = () => {
    viewModel.setSelectedDate(null)
    viewModel.setSelectedStoreId(null)
  }

  const handleStoreSheetClose = () => {
    viewModel.setSelectedStoreId(null)
    // Keep date sheet open when closing store sheet
  }

  const handleBackToStores = () => {
    viewModel.setSelectedStoreId(null)
  }

  const handleSelectStore = (storeId: string) => {
    viewModel.setSelectedStoreId(storeId)
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)]">
      {/* Page header */}
      <header className="flex shrink-0 flex-col gap-[var(--sp-2)] border-b border-[var(--g200)] bg-[var(--bg)] px-[var(--sp-4)] py-[var(--sp-4)] sm:flex-row sm:items-start sm:justify-between lg:px-[var(--sp-6)] lg:py-[var(--sp-5)]">
        <div className="min-w-0">
          <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-[-0.03em] text-[var(--g900)]">
            {t("title")}
          </h1>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--g500)]">{t("calendarSubtitle")}</p>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]">
            {t("viewMode")}
          </p>
          <p className="mt-0.5 font-medium text-[var(--g900)]">{t("calendarView")}</p>
        </div>
      </header>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col gap-[var(--sp-6)] px-[var(--sp-4)] pb-[var(--sp-4)] pt-[var(--sp-6)] lg:px-[var(--sp-6)] lg:pb-[var(--sp-6)]">
        {/* KPI header + month nav */}
        <TipsCalendarHeader
          month={viewModel.month}
          onMonthChange={viewModel.setMonth}
          monthlyTotalCents={viewModel.monthlyTotalCents}
          avgDailyTipCents={viewModel.avgDailyTipCents}
          missingDaysCount={viewModel.missingDaysCount}
          currency={viewModel.currency}
          onAddTips={() => setAddTipsOpen(true)}
        />

        {/* Calendar grid */}
        <TipsCalendarGrid
          month={viewModel.month}
          onMonthChange={viewModel.setMonth}
          selectedDate={viewModel.selectedDate}
          onSelectDate={viewModel.setSelectedDate}
          calendarData={viewModel.calendarData}
          currency={viewModel.currency}
        />
      </div>

      {/* Level 2: Date drilldown sheet */}
      <TipsDateSheet
        date={viewModel.selectedDate}
        data={selectedDateData}
        open={dateSheetOpen}
        onOpenChange={(open) => {
          if (!open) handleDateSheetClose()
        }}
        onSelectStore={handleSelectStore}
        currency={viewModel.currency}
      />

      {/* Level 3: Store drilldown sheet */}
      <TipsStoreSheet
        store={selectedStore}
        date={viewModel.selectedDate}
        open={storeSheetOpen}
        onOpenChange={(open) => {
          if (!open) handleStoreSheetClose()
        }}
        onBack={handleBackToStores}
        currency={viewModel.currency}
      />

      {/* Add Tips sheet */}
      <AddTipsSheet
        open={addTipsOpen}
        onOpenChange={setAddTipsOpen}
        onAdd={viewModel.onAddTips}
        legalFeePercentage={10}
        currency={viewModel.currency}
        side={breakpoint === "desktop" ? "right" : "bottom"}
      />
    </div>
  )
}
