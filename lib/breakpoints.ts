'use client'

import { useEffect, useState } from 'react'

export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
} as const

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')

  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.matchMedia(breakpoints.mobile).matches) {
        setBreakpoint('mobile')
      } else if (window.matchMedia(breakpoints.tablet).matches) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    updateBreakpoint()

    const mobileQuery = window.matchMedia(breakpoints.mobile)
    const tabletQuery = window.matchMedia(breakpoints.tablet)
    const desktopQuery = window.matchMedia(breakpoints.desktop)

    mobileQuery.addEventListener('change', updateBreakpoint)
    tabletQuery.addEventListener('change', updateBreakpoint)
    desktopQuery.addEventListener('change', updateBreakpoint)

    return () => {
      mobileQuery.removeEventListener('change', updateBreakpoint)
      tabletQuery.removeEventListener('change', updateBreakpoint)
      desktopQuery.removeEventListener('change', updateBreakpoint)
    }
  }, [])

  return breakpoint
}
