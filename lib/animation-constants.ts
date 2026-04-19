/**
 * Centralized animation configuration constants
 * These constants ensure consistent animations across all components
 */

/**
 * Spring animation configuration for Motion
 * Used for smooth, natural-feeling animations
 */
export const ANIMATION_SPRING = {
  stiffness: 200,
  damping: 15,
  mass: 0.8,
} as const

/**
 * Standard animation durations in milliseconds
 */
export const ANIMATION_DURATIONS = {
  /** Duration for "recent" change indicators */
  recent: 800,
  /** Duration for node highlight effects */
  highlight: 1500,
  /** Duration for pulse animations */
  pulse: 600,
} as const

/**
 * Standard node animation keyframes
 * Used for enter/exit animations
 */
export const NODE_ANIMATIONS = {
  /** Initial state for entering nodes */
  initial: {
    opacity: 0,
    scale: 0,
    x: -20,
    y: -10,
    rotate: -15,
  },
  /** Exit state for leaving nodes */
  exit: {
    opacity: 0,
    scale: 0,
    rotate: 15,
  },
} as const
