/**
 * Skeleton Node Components for Org Chart
 * 
 * Provides skeleton loaders for each node type in the organization chart.
 * Matches exact dimensions and styling of real nodes for accurate preview.
 */

import { Skeleton } from '@/components/ui/skeleton'

/**
 * OrganizationNodeSkeleton
 * 
 * Skeleton loader for organization node (280px × 80px)
 * Mimics: Icon (40px) + Name text
 */
export function OrganizationNodeSkeleton() {
  return (
    <div
      className="rounded-xl transition-colors"
      style={{
        width: '280px',
        minHeight: '80px',
        padding: 'var(--sp-6)',
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Icon skeleton */}
        <div
          className="rounded-lg flex-shrink-0"
          style={{
            width: '40px',
            height: '40px',
            background: 'var(--g300)',
          }}
        />
        {/* Name skeleton */}
        <Skeleton className="h-6 w-[60%]" />
      </div>
    </div>
  )
}

/**
 * StoreNodeSkeleton
 * 
 * Skeleton loader for store node (220px × 70px)
 * Mimics: Icon (28px) + Name + Location + Employee count
 */
export function StoreNodeSkeleton() {
  return (
    <div
      className="rounded-xl transition-colors"
      style={{
        width: '220px',
        minHeight: '70px',
        padding: 'var(--sp-5)',
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Header row with icon and name */}
        <div className="flex items-start gap-2">
          {/* Icon skeleton */}
          <div
            className="rounded flex-shrink-0"
            style={{
              width: '28px',
              height: '28px',
              background: 'var(--g300)',
            }}
          />
          {/* Name skeleton */}
          <Skeleton className="h-5 w-[70%]" />
        </div>
        {/* Location skeleton */}
        <Skeleton className="h-3 w-[50%]" />
        {/* Employee count skeleton */}
        <Skeleton className="h-3 w-[40%]" />
      </div>
    </div>
  )
}

/**
 * EmployeeNodeSkeleton
 * 
 * Skeleton loader for employee node (180px × 60px)
 * Mimics: Avatar (32px circle) + Name + Role
 */
export function EmployeeNodeSkeleton() {
  return (
    <div
      className="rounded-xl transition-colors"
      style={{
        width: '180px',
        minHeight: '60px',
        padding: 'var(--sp-4)',
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar skeleton */}
        <div
          className="rounded-full flex-shrink-0"
          style={{
            width: '32px',
            height: '32px',
            background: 'var(--g300)',
          }}
        />
        {/* Content column */}
        <div className="flex flex-col gap-1 flex-1">
          {/* Name skeleton */}
          <Skeleton className="h-4 w-24" />
          {/* Role skeleton */}
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}
