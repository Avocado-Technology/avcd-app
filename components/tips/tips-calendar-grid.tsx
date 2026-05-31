"use client"

import { useTranslations } from "next-intl"
import { type DateRange, DayContentProps } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import { TipsDayCell } from "./tips-day-cell"
import type { CalendarDayData } from "@/lib/tips/types"
import { cn } from "@/lib/utils"

export type TipsCalendarGridProps = {
  month: Date
  onMonthChange: (date: Date) => void
  selectedDate: Date | null
  onSelectDate: (date: Date | null) => void
  calendarData: Map<string, CalendarDayData>
  currency?: string
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function DayContentWrapper({
  props,
  calendarData,
  selectedDate,
  onSelectDate,
  currency,
}: {
  props: DayContentProps
  calendarData: Map<string, CalendarDayData>
  selectedDate: Date | null
  onSelectDate: (date: Date | null) => void
  currency: string
}) {
  const date = props.date
  const dateKey = formatDateKey(date)
  const data = calendarData.get(dateKey)
  const selected = selectedDate ? formatDateKey(selectedDate) === dateKey : false

  return (
    <TipsDayCell
      date={date}
      data={data}
      selected={selected}
      onSelect={(d) => onSelectDate(d)}
      currency={currency}
    />
  )
}

export function TipsCalendarGrid({
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  calendarData,
  currency = "BRL",
}: TipsCalendarGridProps) {
  const t = useTranslations("Tips")

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      onSelectDate(range.from)
    } else {
      onSelectDate(null)
    }
  }

  return (
    <section
      className={cn(
        "flex flex-col gap-4",
        "rounded-[var(--r-xl)] border border-[var(--g200)] bg-[var(--bg)] p-4",
        "lg:p-6",
      )}
      aria-label={t("calendarSectionLabel")}
    >
      <Calendar
        mode="single"
        selected={selectedDate ?? undefined}
        onSelect={(date) => onSelectDate(date ?? null)}
        month={month}
        onMonthChange={onMonthChange}
        showOutsideDays={true}
        fixedWeeks={true}
        disabled={(date) => date > new Date()}
        classNames={{
          months: "w-full",
          month: "w-full space-y-4",
          caption: "flex justify-center relative items-center",
          caption_label: "text-lg font-semibold tracking-[-0.03em] text-[var(--g900)]",
          nav: "space-x-1 flex items-center",
          nav_button:
            "h-9 w-9 rounded-[var(--r-md)] border border-[var(--g200)] bg-[var(--bg)] p-0 opacity-70 hover:opacity-100 hover:border-[var(--g500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g900)]",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell:
            "w-full flex-1 py-2 text-center font-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-[var(--g500)]",
          row: "flex w-full",
          cell: cn(
            "relative w-full flex-1 p-1",
            "min-h-[80px] lg:min-h-[100px]",
            "has-[button]:focus-within:ring-0",
          ),
          day: "hidden", // We use our custom DayContent instead
          day_selected: "hidden",
          day_today: "hidden",
          day_outside: "opacity-30",
          day_disabled: "opacity-20 cursor-not-allowed",
          day_hidden: "invisible",
        }}
        components={{
          DayContent: (props: DayContentProps) => (
            <DayContentWrapper
              props={props}
              calendarData={calendarData}
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
              currency={currency}
            />
          ),
        }}
      />
    </section>
  )
}
