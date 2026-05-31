"use client"

import { useCallback, useMemo, useState } from "react"

import { calculateLegalFee, distributeTips } from "@/lib/tips/helpers"
import type {
  AddTipsEntryInput,
  CalendarDayData,
  CalendarStoreEntry,
  CareerLevel,
  DailyTipEntry,
  EmployeeTipShare,
  TipsCalendarViewModel,
} from "@/lib/tips/types"

const LEGAL_FEE_PERCENTAGE = 10
const CURRENCY = "BRL"

// Three stores for the prototype
const STORES = [
  { id: "store-1", name: "Downtown Store" },
  { id: "store-2", name: "Uptown Branch" },
  { id: "store-3", name: "Mall Kiosk" },
] as const

// Employee templates per store
const STORE_EMPLOYEES: Record<string, { id: string; name: string; careerScore: number; careerLevel: CareerLevel }[]> = {
  "store-1": [
    { id: "s1-e1", name: "Maria Silva", careerScore: 8.0, careerLevel: "lead" },
    { id: "s1-e2", name: "João Santos", careerScore: 6.0, careerLevel: "senior" },
    { id: "s1-e3", name: "Ana Costa", careerScore: 4.0, careerLevel: "junior" },
    { id: "s1-e4", name: "Pedro Lima", careerScore: 6.0, careerLevel: "senior" },
  ],
  "store-2": [
    { id: "s2-e1", name: "Carla Dias", careerScore: 5.0, careerLevel: "mid" },
    { id: "s2-e2", name: "Lucas Oliveira", careerScore: 3.5, careerLevel: "junior" },
    { id: "s2-e3", name: "Fernanda Souza", careerScore: 7.0, careerLevel: "lead" },
    { id: "s2-e4", name: "Ricardo Alves", careerScore: 6.5, careerLevel: "senior" },
    { id: "s2-e5", name: "Beatriz Lima", careerScore: 4.5, careerLevel: "mid" },
  ],
  "store-3": [
    { id: "s3-e1", name: "Gabriel Costa", careerScore: 5.5, careerLevel: "mid" },
    { id: "s3-e2", name: "Julia Martins", careerScore: 3.0, careerLevel: "junior" },
  ],
}

// Days that will be missing reports (for realistic incomplete data)
const MISSING_DATES = new Set(["2026-05-05", "2026-05-18", "2026-05-25"])

function formatDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function generateMockDayData(date: Date): CalendarDayData {
  const dateKey = formatDateKey(date)
  const isMissing = MISSING_DATES.has(dateKey)

  // Weekend days get lower tips, mid-month higher
  const dayOfMonth = date.getDate()
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const baseMultiplier = isWeekend ? 0.6 : 1 + (dayOfMonth % 10) / 20 // 1.0 to 1.5

  const stores: CalendarStoreEntry[] = STORES.map((store) => {
    const reported = !isMissing || store.id !== "store-3" // Mall Kiosk is the "missing" one on those days

    if (!reported) {
      return {
        id: store.id,
        name: store.name,
        totalCents: 0,
        legalFeeCents: 0,
        distributableCents: 0,
        employees: [],
        reported: false,
      }
    }

    // Generate tips for this store on this day
    const storeBase = 300_00 + Math.floor(Math.random() * 400_00) // R$300-700 base
    const totalCents = Math.round(storeBase * baseMultiplier)
    const { legalFeeCents, poolCents } = calculateLegalFee(totalCents, LEGAL_FEE_PERCENTAGE)

    // Generate employee distributions
    const employees = STORE_EMPLOYEES[store.id] ?? []
    const daysWorked = employees.map(() => Math.max(5, Math.min(22, Math.floor(Math.random() * 15) + 5))) // 5-20 days

    const distributionRows = distributeTips(
      employees.map((e, i) => ({
        id: e.id,
        careerScore: e.careerScore,
        daysWorked: daysWorked[i] ?? 10,
      })),
      poolCents,
    )

    const employeeShares: EmployeeTipShare[] = employees.map((e, i) => {
      const row = distributionRows.find((r) => r.id === e.id)
      return {
        id: e.id,
        name: e.name,
        careerScore: e.careerScore,
        careerLevel: e.careerLevel,
        daysWorked: daysWorked[i] ?? 10,
        weight: row?.weight ?? 0,
        tipAmountCents: row?.amountCents ?? 0,
        tipPercentage: row?.percentage ?? 0,
      }
    })

    return {
      id: store.id,
      name: store.name,
      totalCents,
      legalFeeCents,
      distributableCents: poolCents,
      employees: employeeShares,
      reported: true,
    }
  })

  const totalCents = stores.reduce((sum, s) => sum + s.totalCents, 0)
  const storesReported = stores.filter((s) => s.reported).length

  return {
    date,
    totalCents,
    storeCount: STORES.length,
    storesReported,
    stores,
  }
}

function generateMay2026Data(): Map<string, CalendarDayData> {
  const data = new Map<string, CalendarDayData>()
  const year = 2026
  const month = 4 // May is month 4 (0-indexed)

  // Generate data for all days in May 2026
  const daysInMonth = 31
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateKey = formatDateKey(date)
    data.set(dateKey, generateMockDayData(date))
  }

  return data
}

export function useMockTipsCalendar(): TipsCalendarViewModel {
  // Default to May 2026 for the prototype
  const [month, setMonth] = useState<Date>(() => new Date(2026, 4, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [calendarData, setCalendarData] = useState<Map<string, CalendarDayData>>(generateMay2026Data)
  const [entries, setEntries] = useState<DailyTipEntry[]>([])

  // Calculate monthly totals
  const monthlyStats = useMemo(() => {
    let monthlyTotalCents = 0
    let reportedDays = 0
    let missingDaysCount = 0

    calendarData.forEach((day) => {
      monthlyTotalCents += day.totalCents
      if (day.storesReported > 0) {
        reportedDays++
      }
      if (day.storesReported < day.storeCount) {
        missingDaysCount++
      }
    })

    const avgDailyTipCents = reportedDays > 0 ? Math.round(monthlyTotalCents / reportedDays) : 0

    return { monthlyTotalCents, avgDailyTipCents, missingDaysCount }
  }, [calendarData])

  const onAddTips = useCallback((entry: AddTipsEntryInput) => {
    const totalCents = entry.cashTipsCents + entry.cardTipsCents
    const { legalFeeCents, poolCents } = calculateLegalFee(totalCents, LEGAL_FEE_PERCENTAGE)
    const newEntry: DailyTipEntry = {
      id: `e${Date.now()}`,
      date: entry.date,
      cashTipsCents: entry.cashTipsCents,
      cardTipsCents: entry.cardTipsCents,
      totalCents,
      legalFeeCents,
      poolContributionCents: poolCents,
      notes: entry.notes,
    }
    setEntries((prev) => [newEntry, ...prev])

    // Also update the calendar data for this date
    const dateKey = formatDateKey(entry.date)
    setCalendarData((prev) => {
      const next = new Map(prev)
      const existing = next.get(dateKey)
      if (existing) {
        // For simplicity in the mock, we just add to the first store
        const updatedStores = [...existing.stores]
        const firstStore = updatedStores[0]
        if (firstStore) {
          updatedStores[0] = {
            ...firstStore,
            totalCents: firstStore.totalCents + totalCents,
            legalFeeCents: firstStore.legalFeeCents + legalFeeCents,
            distributableCents: firstStore.distributableCents + poolCents,
          }
        }
        next.set(dateKey, {
          ...existing,
          totalCents: existing.totalCents + totalCents,
          stores: updatedStores,
        })
      }
      return next
    })
  }, [])

  return {
    month,
    setMonth,
    calendarData,
    selectedDate,
    setSelectedDate,
    selectedStoreId,
    setSelectedStoreId,
    currency: CURRENCY,
    monthlyTotalCents: monthlyStats.monthlyTotalCents,
    avgDailyTipCents: monthlyStats.avgDailyTipCents,
    missingDaysCount: monthlyStats.missingDaysCount,
    onAddTips,
  }
}
