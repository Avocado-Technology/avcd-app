"use client"

import { useMockTipsCalendar } from "@/lib/hooks/use-mock-tips-calendar"

import { TipsCalendarLayout } from "./tips-client-layout"

export function TipsClientMock() {
  const viewModel = useMockTipsCalendar()
  return <TipsCalendarLayout {...viewModel} />
}
