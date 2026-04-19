/**
 * Motion Animation Variants for Avocado Design System
 * 
 * Principles:
 * - Purpose-driven: Animations guide attention, explain state, or provide feedback
 * - Interruptible: Users are never locked waiting for animations
 * - Contextual: Elements animate from/to meaningful locations
 * - Performant: Only animate transform and opacity (GPU-accelerated)
 * - Accessible: Respects prefers-reduced-motion automatically
 * 
 * Based on 2026 animation best practices and WCAG 2.2 compliance
 */

// ============================================================================
// TIMING CONSTANTS (milliseconds)
// ============================================================================

export const timings = {
  micro: 100,       // Icon state changes, checkbox toggles
  fast: 150,        // Hover transitions, color changes
  base: 250,        // Button clicks, menu reveals
  moderate: 350,    // Slide panels, card flips
  slow: 500,        // Page transitions, modal entrances
  dramatic: 700,    // Hero reveals, onboarding steps
  skeleton: 1500,   // Shimmer animation loop
} as const;

// ============================================================================
// EASING CURVES (cubic-bezier values)
// ============================================================================

export const easings = {
  // Smooth deceleration — for most UI transitions
  easeOut: [0.16, 1, 0.3, 1] as const,
  
  // Fast & responsive — for feedback & state changes  
  snappy: [0.4, 0, 0.2, 1] as const,
  
  // Gentle spring — for button clicks & micro-interactions
  spring: [0.34, 1.56, 0.64, 1] as const,
  
  // Smooth both ways — for reversible animations (expand/collapse)
  smooth: [0.65, 0, 0.35, 1] as const,
  
  // Linear — ONLY for opacity, color, rotation (spinners)
  linear: [0, 0, 1, 1] as const,
} as const;

// ============================================================================
// CORE ANIMATION VARIANTS
// ============================================================================

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: timings.base / 1000,
      ease: easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    y: -12,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.snappy,
    },
  },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: timings.base / 1000,
      ease: easings.linear, // Linear for opacity
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.linear,
    },
  },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: timings.base / 1000,
      ease: easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.snappy,
    },
  },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: timings.base / 1000,
      ease: easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.snappy,
    },
  },
};

export const slideInFromTop = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.snappy,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: timings.base / 1000,
      ease: easings.spring, // Gentle spring for scale
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.snappy,
    },
  },
};

// ============================================================================
// SPECIALIZED VARIANTS
// ============================================================================

// Stagger container for sequential reveals (lists, grids)
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,      // 60ms between each child
      delayChildren: 0.03,        // 30ms before first child starts
    },
  },
};

// Button click feedback (for use with whileTap)
export const buttonTap = {
  scale: 0.97,
  transition: {
    duration: timings.micro / 1000,
    ease: easings.snappy,
  },
};

// Modal/Dialog entrance
export const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: timings.moderate / 1000,
      ease: easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.snappy,
    },
  },
};

// Backdrop fade (for modals, overlays)
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: timings.base / 1000,
      ease: easings.linear,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: timings.fast / 1000,
      ease: easings.linear,
    },
  },
};

// Slide-up panel (mobile drawer, bottom sheets)
export const slideUpPanel = {
  initial: { y: '100%' },
  animate: { 
    y: 0,
    transition: {
      duration: timings.moderate / 1000,
      ease: easings.easeOut,
    },
  },
  exit: { 
    y: '100%',
    transition: {
      duration: timings.base / 1000,
      ease: easings.snappy,
    },
  },
};

// Expand/collapse (for accordions, dropdowns)
export const expandCollapse = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      height: {
        duration: timings.moderate / 1000,
        ease: easings.smooth,
      },
      opacity: {
        duration: timings.fast / 1000,
        ease: easings.linear,
      },
    },
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: {
      height: {
        duration: timings.base / 1000,
        ease: easings.smooth,
      },
      opacity: {
        duration: timings.micro / 1000,
        ease: easings.linear,
      },
    },
  },
};

// Loading spinner (continuous rotation)
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: easings.linear,
      repeat: Infinity,
    },
  },
};

// Success checkmark animation
export const successCheckmark = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: timings.moderate / 1000,
      ease: easings.spring, // Bounce for celebration
    },
  },
};

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

export const defaultTransition = {
  duration: timings.slow / 1000,
  ease: easings.easeOut,
};

export const fastTransition = {
  duration: timings.fast / 1000,
  ease: easings.snappy,
};
