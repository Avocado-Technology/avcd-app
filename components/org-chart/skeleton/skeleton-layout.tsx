/**
 * Skeleton Layout for Org Chart
 * 
 * Displays a simplified hierarchical skeleton structure:
 * - 1 organization node at the top
 * - 2 store nodes in the middle
 * - 4 employee nodes at the bottom (2 per store)
 * 
 * Total: 7 nodes
 * Layout: CSS Grid + Flexbox for performance and simplicity
 */

import {
  OrganizationNodeSkeleton,
  StoreNodeSkeleton,
  EmployeeNodeSkeleton,
} from './skeleton-nodes'

export function SkeletonLayout() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto">
      <div className="grid gap-12">
        {/* Level 1: Organization (centered) */}
        <div className="flex justify-center">
          <OrganizationNodeSkeleton />
        </div>

        {/* Level 2: Stores (horizontal, centered) */}
        <div className="flex justify-center gap-16">
          <StoreNodeSkeleton />
          <StoreNodeSkeleton />
        </div>

        {/* Level 3: Employees (two groups) */}
        <div className="flex justify-center gap-16">
          {/* Store 1 employees */}
          <div className="flex gap-6">
            <EmployeeNodeSkeleton />
            <EmployeeNodeSkeleton />
          </div>
          {/* Store 2 employees */}
          <div className="flex gap-6">
            <EmployeeNodeSkeleton />
            <EmployeeNodeSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
