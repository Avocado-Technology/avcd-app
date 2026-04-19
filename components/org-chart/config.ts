/**
 * Centralized configuration for org chart components
 * Ensures consistent sizing and layout across all node types
 */

import { NODE_TYPES } from './types'

/**
 * Node dimensions for ReactFlow layout calculations
 * These must match the actual rendered node sizes
 * Using uniform dimensions for consistent visual hierarchy
 */
export const NODE_DIMENSIONS = {
  [NODE_TYPES.ORGANIZATION]: { width: 240, height: 80 },
  [NODE_TYPES.STORE]: { width: 240, height: 80 },
  [NODE_TYPES.EMPLOYEE]: { width: 240, height: 80 },
} as const
