/**
 * Shared TypeScript type definitions for org chart components
 * Provides type safety and consistency across all node types
 */

/**
 * Base interface for all node data
 */
export interface BaseNodeData {
  id: string
}

/**
 * Employee node data
 */
export interface EmployeeNodeData extends BaseNodeData {
  name: string
  role: string
}

/**
 * Animated employee node data with animation state
 */
export interface AnimatedEmployeeNodeData extends EmployeeNodeData {
  isRecent?: boolean
  isHighlighted?: boolean
}

/**
 * Store node data
 */
export interface StoreNodeData extends BaseNodeData {
  name: string
  location: string
  employeeCount: number
}

/**
 * Animated store node data with animation state
 */
export interface AnimatedStoreNodeData extends StoreNodeData {
  isRecent?: boolean
  isHighlighted?: boolean
}

/**
 * Organization node data
 */
export interface OrganizationNodeData extends BaseNodeData {
  name: string
}

/**
 * Node type constants with literal types
 * Use `as const` to ensure type safety
 */
export const NODE_TYPES = {
  ORGANIZATION: 'organizationNode',
  STORE: 'storeNode',
  EMPLOYEE: 'employeeNode',
} as const

/**
 * Union type of all valid node types
 */
export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES]
