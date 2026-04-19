import { createElement, Fragment, ReactNode } from 'react'

/**
 * Mock for motion/react (Framer Motion) to avoid flaky animation tests
 * This mock returns standard div elements instead of animated components
 */

// Mock motion components - return regular divs
export const motion = new Proxy(
  {},
  {
    get: (target, prop) => {
      return ({ children, ...props }: any) => {
        // Filter out motion-specific props to avoid React warnings
        const {
          initial,
          animate,
          exit,
          transition,
          whileHover,
          whileTap,
          variants,
          ...htmlProps
        } = props
        
        return createElement(prop as string, htmlProps, children)
      }
    },
  }
)

// Mock AnimatePresence - just render children
export const AnimatePresence = ({ children }: { children: ReactNode }) => 
  createElement(Fragment, null, children)

// Mock useReducedMotion - always return false (animations enabled)
export const useReducedMotion = () => false

// Mock useMotionValue - return an object with get/set methods
export const useMotionValue = (initial: any) => ({
  get: () => initial,
  set: () => {},
  onChange: () => () => {},
})

// Mock useTransform - just return the input
export const useTransform = (value: any) => value

// Mock useSpring - just return the input
export const useSpring = (value: any) => value

// Mock useScroll - return mock scroll values
export const useScroll = () => ({
  scrollX: { get: () => 0, set: () => {} },
  scrollY: { get: () => 0, set: () => {} },
  scrollXProgress: { get: () => 0, set: () => {} },
  scrollYProgress: { get: () => 0, set: () => {} },
})

// Mock useInView - always return true
export const useInView = () => true

// Mock useAnimation - return mock controls
export const useAnimation = () => ({
  start: async () => {},
  stop: () => {},
  set: () => {},
})
