'use client'

import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import type { D3OrgChartNode } from './types'
import { renderNodeContent } from './node-templates'
import { installVerticalEmployeeLayoutPatch } from './utils/vertical-employee-layout'

export interface D3OrgChartWrapperRef {
  highlight: (id: string) => void
  fit: () => void
}

interface Props {
  data: D3OrgChartNode[]
}

/** Fluent chart handle from d3-org-chart (subset used by this wrapper) */
type OrgChartInstance = {
  container: (el: HTMLElement | null) => OrgChartInstance
  data: (d: D3OrgChartNode[]) => OrgChartInstance
  render: () => OrgChartInstance
  initialExpandLevel: (level: number) => OrgChartInstance
  nodeWidth: (fn: () => number) => OrgChartInstance
  nodeHeight: (fn: () => number) => OrgChartInstance
  layout: (direction: string) => OrgChartInstance
  compact: (flag: boolean) => OrgChartInstance
  nodeContent: (
    fn: (d: { data: D3OrgChartNode }) => unknown
  ) => OrgChartInstance
  clearHighlighting: () => OrgChartInstance
  setHighlighted: (id: string) => OrgChartInstance
  fit: (opts?: Record<string, unknown>) => OrgChartInstance
}

export const D3OrgChartWrapper = forwardRef<
  D3OrgChartWrapperRef,
  Props
>(function D3OrgChartWrapper({ data }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<OrgChartInstance | null>(null)
  const latestDataRef = useRef(data)
  latestDataRef.current = data

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    void import('d3-org-chart').then(({ OrgChart }) => {
      if (cancelled || !containerRef.current) return

      installVerticalEmployeeLayoutPatch(OrgChart)

      const chart = new OrgChart() as OrgChartInstance
      chart
        .container(containerRef.current)
        .data(latestDataRef.current)
        .initialExpandLevel(10)
        .nodeWidth(() => 260)
        .nodeHeight(() => 110)
        .layout('top')
        .compact(false)
        .nodeContent((d: { data: D3OrgChartNode }) =>
          renderNodeContent(d.data)
        )
        .render()

      chartRef.current = chart
    })

    return () => {
      cancelled = true
      chartRef.current = null
      el.innerHTML = ''
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    chart.data(data).render()
  }, [data])

  useImperativeHandle(
    ref,
    () => ({
      highlight: (id: string) => {
        const c = chartRef.current
        if (!c) return
        c.clearHighlighting().setHighlighted(id).render()
      },
      fit: () => {
        chartRef.current?.fit()
      },
    }),
    []
  )

  return (
    <div
      ref={containerRef}
      data-testid="org-chart-layout-root"
      className="h-full min-h-[400px] w-full"
      aria-label="Organization chart"
    />
  )
})
