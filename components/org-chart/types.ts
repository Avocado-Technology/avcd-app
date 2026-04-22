/**
 * Shared TypeScript type definitions for org chart components (d3-org-chart).
 */

/** Semantic node kind for flat chart rows */
export type OrgNodeType = 'organization' | 'store' | 'employee'

/** One row for d3-org-chart (stratify by id / parentId) */
export interface D3OrgChartNode {
  id: string
  /** Root uses empty string */
  parentId: string
  name: string
  nodeType: OrgNodeType
  /** Store-specific */
  location?: string
  employeeCount?: number
  /** Employee-specific */
  role?: string
  /** Merged from animation state before render */
  isRecent?: boolean
  isHighlighted?: boolean
}
