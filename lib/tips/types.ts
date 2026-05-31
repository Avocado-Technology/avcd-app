export type CareerLevel = "lead" | "senior" | "mid" | "junior"

export interface EmployeeTipShare {
  id: string
  name: string
  avatarUrl?: string
  /** 1–10 scale */
  careerScore: number
  careerLevel: CareerLevel
  daysWorked: number
  /** score × days */
  weight: number
  tipAmountCents: number
  /** share of available pool, 0–100 */
  tipPercentage: number
}

export interface TipsPool {
  id: string
  storeId: string
  storeName: string
  periodStart: Date
  periodEnd: Date
  totalCollectedCents: number
  legalFeePercentage: number
  legalFeeCents: number
  availablePoolCents: number
  distributions: EmployeeTipShare[]
  status: "draft" | "distributed" | "paid"
}

export interface DailyTipEntry {
  id: string
  date: Date
  cashTipsCents: number
  cardTipsCents: number
  totalCents: number
  legalFeeCents: number
  poolContributionCents: number
  notes?: string
}

export type AddTipsEntryInput = Omit<
  DailyTipEntry,
  "id" | "totalCents" | "legalFeeCents" | "poolContributionCents"
>

export interface TipsViewModel {
  pool: TipsPool
  entries: DailyTipEntry[]
  currency: string
  periodOptions: string[]
  selectedPeriod: string
  setSelectedPeriod: (p: string) => void
  roleFilter: string
  setRoleFilter: (r: string) => void
  onDaysWorkedChange: (employeeId: string, days: number) => void
  onAddTips: (entry: AddTipsEntryInput) => void
  onRefresh: () => void
}

/** Calendar-specific types for the Tips Calendar refactor */

export interface CalendarStoreEntry {
  id: string
  name: string
  totalCents: number
  legalFeeCents: number
  distributableCents: number
  employees: EmployeeTipShare[]
  reported: boolean // false = missing report
}

export interface CalendarDayData {
  date: Date
  totalCents: number
  storeCount: number // expected stores per day
  storesReported: number
  stores: CalendarStoreEntry[]
}

export interface TipsCalendarViewModel {
  month: Date
  setMonth: (m: Date) => void
  calendarData: Map<string, CalendarDayData> // key: "yyyy-mm-dd"
  selectedDate: Date | null
  setSelectedDate: (d: Date | null) => void
  selectedStoreId: string | null
  setSelectedStoreId: (id: string | null) => void
  currency: string
  monthlyTotalCents: number
  avgDailyTipCents: number
  missingDaysCount: number
  onAddTips: (entry: AddTipsEntryInput) => void
}
