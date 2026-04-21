/**
 * Organization Page with GraphQL Data
 * 
 * Client component that fetches organization data from GraphQL API
 * and displays it using the AnimatedOrgChart component
 */

"use client"

import { AnimatedOrgChart } from "@/components/org-chart/animated-org-chart"
import { OrgChartLoading } from "@/components/org-chart/org-chart-loading"
import { OrgChartGraphQLError } from "@/components/org-chart/org-chart-graphql-error"
import { OrgChartNoData } from "@/components/org-chart/org-chart-no-data"
import { useOrganizationTree } from "@/lib/hooks/use-organization-tree"
import "reactflow/dist/style.css"

const mainOrgClassName =
  "flex min-h-0 flex-1 flex-col bg-[var(--g50)] p-0 lg:p-[var(--sp-6)]"

export function OrgPageWithData() {
  const { data, loading, error, refetch } = useOrganizationTree();

  // Loading state
  if (loading) {
    return (
      <main role="main" aria-label="Organization chart page" className={mainOrgClassName}>
        <OrgChartLoading />
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main role="main" aria-label="Organization chart page" className={mainOrgClassName}>
        <OrgChartGraphQLError error={error} refetch={refetch} />
      </main>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <main role="main" aria-label="Organization chart page" className={mainOrgClassName}>
        <OrgChartNoData />
      </main>
    )
  }

  // Success state - render chart with data
  // Use first organization from the array
  const orgData = data[0];

  return (
    <main role="main" aria-label="Organization chart page" className={mainOrgClassName}>
      <div
        role="region"
        aria-label="Organization chart visualization"
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="min-h-0 flex-1 overflow-hidden">
          <AnimatedOrgChart data={orgData} />
        </div>
      </div>
    </main>
  )
}
