/**
 * useReducedMotion Hook
 * 
 * Detects if the user has requested reduced motion via OS settings.
 * Respects WCAG 2.2 SC 2.3.3 (Animation from Interactions)
 * 
 * @returns {boolean} true if user prefers reduced motion
 * 
 * @example
 * ```tsx
 * import { motion } from 'framer-motion';
 * import { fadeInUp } from '@/lib/motion-variants';
 * import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
 * 
 * export function Card({ children }) {
 *   const shouldReduceMotion = useReducedMotion();
 * 
 *   return (
 *     <motion.div
 *       {...(shouldReduceMotion ? {} : fadeInUp)}
 *       className="card"
 *     >
 *       {children}
 *     </motion.div>
 *   );
 * }
 * ```
 */

'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR guard)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Legacy browsers (Safari < 14)
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}
