import { describe, it, expect } from '@jest/globals'

describe('Motion Library Setup', () => {
  it('should have framer-motion installed', () => {
    const motion = require('framer-motion')
    expect(motion).toBeDefined()
  })

  it('should have motion components available', () => {
    const { motion } = require('framer-motion')
    expect(motion).toBeDefined()
    expect(motion.div).toBeDefined()
    expect(motion.button).toBeDefined()
  })

  it('should have AnimatePresence available', () => {
    const { AnimatePresence } = require('framer-motion')
    expect(AnimatePresence).toBeDefined()
  })

  it('should have useAnimation hook available', () => {
    const { useAnimation } = require('framer-motion')
    expect(useAnimation).toBeDefined()
  })

  it('should export fadeIn variant', () => {
    const { fadeIn } = require('../lib/motion-variants')
    
    expect(fadeIn).toBeDefined()
    expect(fadeIn.initial).toEqual({ opacity: 0 })
    expect(fadeIn.animate).toMatchObject({ opacity: 1 })
  })

  it('should export slideInFromLeft variant', () => {
    const { slideInFromLeft } = require('../lib/motion-variants')
    
    expect(slideInFromLeft).toBeDefined()
    expect(slideInFromLeft.initial.x).toBeDefined()
    expect(slideInFromLeft.animate.x).toBe(0)
  })

  it('should export scaleIn variant', () => {
    const { scaleIn } = require('../lib/motion-variants')
    
    expect(scaleIn).toBeDefined()
    expect(scaleIn.initial.scale).toBeDefined()
    expect(scaleIn.animate.scale).toBe(1)
  })
})
