/**
 * OrgChartSkeleton
 *
 * Loading skeleton for organization chart with hierarchical structure.
 * Displays a simplified org chart layout (1 org → 2 stores → 4 employees)
 * while chart data loads.
 * 
 * Features:
 * - Matches real node dimensions for accurate preview
 * - Accessible with proper ARIA attributes
 * - Respects prefers-reduced-motion
 * - Theme-aware colors
 */

import { SkeletonLayout } from './skeleton/skeleton-layout'

export function OrgChartSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading organization chart"
      className="h-full w-full"
    >
      <div aria-hidden="true">
        <SkeletonLayout />
      </div>
      <span className="sr-only">Loading organization chart</span>
    </div>
  )
}
