/**
 * Organization Page with GraphQL Data
 *
 * Client component that fetches organization data from GraphQL API
 * and displays it using the AnimatedOrgChart component.
 * Layout shell matches {@link FinanceClientLayout} (header + padded content column).
 */

"use client"

import { useCallback, useRef } from "react"
import {
  AnimatedOrgChart,
  type AnimatedOrgChartRef,
} from "@/components/org-chart/animated-org-chart"
import { OrgChartSearchBar } from "@/components/org-chart/org-chart-search-bar"
import { OrgChartPageHeader } from "@/components/org-chart/org-chart-page-header"
import { OrgChartLoading } from "@/components/org-chart/org-chart-loading"
import { OrgChartGraphQLError } from "@/components/org-chart/org-chart-graphql-error"
import { OrgChartNoData } from "@/components/org-chart/org-chart-no-data"
import { useOrganizationTree } from "@/lib/hooks/use-organization-tree"

/** Inner content column — same horizontal rhythm as finance (`finance-client-layout`). */
const contentColumnClassName =
  "flex min-h-0 flex-1 flex-col gap-[var(--sp-6)] px-[var(--sp-4)] pb-[var(--sp-4)] pt-[var(--sp-6)] lg:px-[var(--sp-6)] lg:pb-[var(--sp-6)]"

export function OrgPageWithData() {
  const { data, loading, error, refetch } = useOrganizationTree()
  const chartRef = useRef<AnimatedOrgChartRef>(null)

  const handleSearchSelect = useCallback((nodeId: string) => {
    chartRef.current?.focusNode(nodeId)
  }, [])

  // Loading state
  if (loading) {
    return (
      <main
        role="main"
        aria-label="Organization chart page"
        className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)]"
      >
        <OrgChartPageHeader />
        <div data-testid="org-page-content" className={contentColumnClassName}>
          <OrgChartLoading />
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main
        role="main"
        aria-label="Organization chart page"
        className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)]"
      >
        <OrgChartPageHeader />
        <div data-testid="org-page-content" className={contentColumnClassName}>
          <OrgChartGraphQLError error={error} refetch={refetch} />
        </div>
      </main>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <main
        role="main"
        aria-label="Organization chart page"
        className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)]"
      >
        <OrgChartPageHeader />
        <div data-testid="org-page-content" className={contentColumnClassName}>
          <OrgChartNoData />
        </div>
      </main>
    )
  }

  const orgData = data[0]

  return (
    <main
      role="main"
      aria-label="Organization chart page"
      className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)]"
    >
      <OrgChartPageHeader />

      <div data-testid="org-page-content" className={contentColumnClassName}>
        <OrgChartSearchBar
          organization={orgData}
          onSelectNode={handleSearchSelect}
        />

        <div
          role="region"
          aria-label="Organization chart visualization"
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <AnimatedOrgChart ref={chartRef} data={orgData} />
        </div>
      </div>
    </main>
  )
}
