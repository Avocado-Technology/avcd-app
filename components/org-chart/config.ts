/**
 * Centralized configuration for org chart components
 * Ensures consistent sizing and layout across all node types
 */

import { NODE_TYPES } from './types'

/**
 * Node dimensions for ReactFlow layout calculations
 * These must match the actual rendered node sizes
 */
export const NODE_DIMENSIONS = {
  [NODE_TYPES.ORGANIZATION]: { width: 280, height: 80 },
  [NODE_TYPES.STORE]: { width: 220, height: 70 },
  [NODE_TYPES.EMPLOYEE]: { width: 180, height: 60 },
} as const
