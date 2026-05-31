"use client"

import { useCallback, useMemo, useState } from "react"

import { calculateLegalFee, distributeTips } from "@/lib/tips/helpers"
import type {
  AddTipsEntryInput,
  CareerLevel,
  DailyTipEntry,
  EmployeeTipShare,
  TipsPool,
} from "@/lib/tips/types"

const LEGAL_FEE_PERCENTAGE = 10
const CURRENCY = "BRL"

type MockEmployee = {
  id: string
  name: string
  careerScore: number
  careerLevel: CareerLevel
  daysWorked: number
}

const INITIAL_EMPLOYEES: MockEmployee[] = [
  { id: "1", name: "Maria Silva", careerScore: 8.0, careerLevel: "lead", daysWorked: 12 },
  { id: "2", name: "João Santos", careerScore: 6.0, careerLevel: "senior", daysWorked: 10 },
  { id: "3", name: "Ana Costa", careerScore: 4.0, careerLevel: "junior", daysWorked: 8 },
  { id: "4", name: "Pedro Lima", careerScore: 6.0, careerLevel: "senior", daysWorked: 5 },
  { id: "5", name: "Carla Dias", careerScore: 5.0, careerLevel: "mid", daysWorked: 11 },
  { id: "6", name: "Lucas Oliveira", careerScore: 3.5, careerLevel: "junior", daysWorked: 9 },
]

const INITIAL_ENTRIES: DailyTipEntry[] = [
  {
    id: "e1",
    date: new Date("2026-01-15"),
    cashTipsCents: 350_00,
    cardTipsCents: 500_00,
    totalCents: 850_00,
    legalFeeCents: 85_00,
    poolContributionCents: 765_00,
  },
  {
    id: "e2",
    date: new Date("2026-01-14"),
    cashTipsCents: 200_00,
    cardTipsCents: 1000_00,
    totalCents: 1200_00,
    legalFeeCents: 120_00,
    poolContributionCents: 1080_00,
  },
  {
    id: "e3",
    date: new Date("2026-01-13"),
    cashTipsCents: 420_00,
    cardTipsCents: 500_00,
    totalCents: 920_00,
    legalFeeCents: 92_00,
    poolContributionCents: 828_00,
  },
]

function matchesRoleFilter(level: CareerLevel, roleFilter: string): boolean {
  if (roleFilter === "all") return true
  return level === roleFilter
}

export function useMockTips() {
  const [employees, setEmployees] = useState<MockEmployee[]>(() => [...INITIAL_EMPLOYEES])
  const [entries, setEntries] = useState<DailyTipEntry[]>(() => [...INITIAL_ENTRIES])
  const [selectedPeriod, setSelectedPeriod] = useState("Jan 1–15, 2026")
  const [roleFilter, setRoleFilter] = useState("all")

  const totals = useMemo(() => {
    const totalCollectedCents = entries.reduce((sum, e) => sum + e.totalCents, 0)
    const legalFeeCents = entries.reduce((sum, e) => sum + e.legalFeeCents, 0)
    const availablePoolCents = entries.reduce((sum, e) => sum + e.poolContributionCents, 0)
    return { totalCollectedCents, legalFeeCents, availablePoolCents }
  }, [entries])

  const filteredEmployees = useMemo(
    () => employees.filter((e) => matchesRoleFilter(e.careerLevel, roleFilter)),
    [employees, roleFilter],
  )

  const distributions: EmployeeTipShare[] = useMemo(() => {
    const rows = distributeTips(
      filteredEmployees.map((e) => ({
        id: e.id,
        careerScore: e.careerScore,
        daysWorked: e.daysWorked,
      })),
      totals.availablePoolCents,
    )
    const byId = new Map(rows.map((r) => [r.id, r]))
    return filteredEmployees.map((e) => {
      const row = byId.get(e.id)!
      return {
        id: e.id,
        name: e.name,
        careerScore: e.careerScore,
        careerLevel: e.careerLevel,
        daysWorked: e.daysWorked,
        weight: row.weight,
        tipAmountCents: row.amountCents,
        tipPercentage: row.percentage,
      }
    })
  }, [filteredEmployees, totals.availablePoolCents])

  const pool: TipsPool = useMemo(
    () => ({
      id: "pool-1",
      storeId: "store-1",
      storeName: "Downtown Store",
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-15"),
      totalCollectedCents: totals.totalCollectedCents,
      legalFeePercentage: LEGAL_FEE_PERCENTAGE,
      legalFeeCents: totals.legalFeeCents,
      availablePoolCents: totals.availablePoolCents,
      distributions,
      status: "draft",
    }),
    [distributions, totals],
  )

  const onDaysWorkedChange = useCallback((employeeId: string, days: number) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, daysWorked: Math.max(0, Math.floor(days)) } : e)),
    )
  }, [])

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
  }, [])

  const onRefresh = useCallback(() => {
    setEmployees([...INITIAL_EMPLOYEES])
    setEntries([...INITIAL_ENTRIES])
    setSelectedPeriod("Jan 1–15, 2026")
    setRoleFilter("all")
  }, [])

  return {
    pool,
    entries,
    currency: CURRENCY,
    periodOptions: ["Jan 1–15, 2026", "Jan 16–31, 2026", "Feb 1–15, 2026"],
    selectedPeriod,
    setSelectedPeriod,
    roleFilter,
    setRoleFilter,
    onDaysWorkedChange,
    onAddTips,
    onRefresh,
  }
}
