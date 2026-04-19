import { cn } from "@/lib/utils"
import React from "react"

interface PageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Additional CSS classes to merge with default styles
   */
  className?: string
}

/**
 * PageSkeleton - Full-page loading skeleton
 *
 * A minimal, full-viewport skeleton loader for page-level loading states.
 * Uses design system colors and respects prefers-reduced-motion.
 *
 * @example
 * // Basic usage
 * if (loading) return <PageSkeleton />
 *
 * @example
 * // With custom styles
 * <PageSkeleton className="opacity-50" />
 *
 * @example
 * // In a full page layout
 * <main className="flex-1">
 *   {loading ? <PageSkeleton /> : <Content />}
 * </main>
 *
 * @example
 * // In Next.js loading.js
 * export default function Loading() {
 *   return <PageSkeleton />
 * }
 */
export function PageSkeleton({ className, ...props }: PageSkeletonProps) {
  return (
    <div
      className={cn("h-full w-full bg-[var(--g300)] animate-pulse rounded-lg", className)}
      {...props}
    />
  )
}

// Default export for Next.js loading.js convention
export default PageSkeleton

interface PageSkeletonWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Accessible label for screen readers
   * @default "Loading content"
   */
  ariaLabel?: string
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string
}

/**
 * PageSkeletonWrapper - Accessible wrapper for PageSkeleton
 *
 * Wraps PageSkeleton with proper ARIA attributes for screen readers.
 * Following WCAG best practices: skeleton is hidden (decorative),
 * screen reader text provides meaningful status.
 *
 * @example
 * // With accessibility wrapper (recommended for production)
 * if (loading) return <PageSkeletonWrapper ariaLabel="Loading dashboard" />
 *
 * @example
 * // With custom label
 * <PageSkeletonWrapper ariaLabel="Loading organization chart" />
 *
 * @example
 * // In a full page layout with custom className
 * <main className="flex-1">
 *   {loading ? <PageSkeletonWrapper className="opacity-75" /> : <Content />}
 * </main>
 */
export function PageSkeletonWrapper({
  ariaLabel = "Loading content",
  className,
  ...props
}: PageSkeletonWrapperProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cn("h-full w-full", className)}
      {...props}
    >
      {/* Hide decorative skeleton from screen readers */}
      <div aria-hidden="true">
        <PageSkeleton />
      </div>
      {/* Provide text alternative for screen readers */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}
