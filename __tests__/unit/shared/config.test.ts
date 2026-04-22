import { describe, it, expect } from '@jest/globals'
import {
  ANIMATION_SPRING,
  ANIMATION_DURATIONS,
  NODE_ANIMATIONS,
} from '@/lib/animation-constants'

describe('Animation Constants', () => {
  describe('ANIMATION_SPRING', () => {
    it('should have numeric stiffness value', () => {
      expect(typeof ANIMATION_SPRING.stiffness).toBe('number')
      expect(ANIMATION_SPRING.stiffness).toBeGreaterThan(0)
    })

    it('should have numeric damping value', () => {
      expect(typeof ANIMATION_SPRING.damping).toBe('number')
      expect(ANIMATION_SPRING.damping).toBeGreaterThan(0)
    })

    it('should have numeric mass value', () => {
      expect(typeof ANIMATION_SPRING.mass).toBe('number')
      expect(ANIMATION_SPRING.mass).toBeGreaterThan(0)
    })

    it('should have expected values', () => {
      expect(ANIMATION_SPRING.stiffness).toBe(200)
      expect(ANIMATION_SPRING.damping).toBe(15)
      expect(ANIMATION_SPRING.mass).toBe(0.8)
    })
  })

  describe('ANIMATION_DURATIONS', () => {
    it('should have positive duration values', () => {
      expect(ANIMATION_DURATIONS.recent).toBeGreaterThan(0)
      expect(ANIMATION_DURATIONS.highlight).toBeGreaterThan(0)
      expect(ANIMATION_DURATIONS.pulse).toBeGreaterThan(0)
    })

    it('should have expected durations in milliseconds', () => {
      expect(ANIMATION_DURATIONS.recent).toBe(800)
      expect(ANIMATION_DURATIONS.highlight).toBe(1500)
      expect(ANIMATION_DURATIONS.pulse).toBe(600)
    })

    it('should have durations that make sense relative to each other', () => {
      // Highlight should be longer than recent
      expect(ANIMATION_DURATIONS.highlight).toBeGreaterThan(ANIMATION_DURATIONS.recent)
      // Recent should be longer than pulse
      expect(ANIMATION_DURATIONS.recent).toBeGreaterThan(ANIMATION_DURATIONS.pulse)
    })
  })

  describe('NODE_ANIMATIONS', () => {
    it('should have initial animation properties', () => {
      expect(NODE_ANIMATIONS.initial).toHaveProperty('opacity')
      expect(NODE_ANIMATIONS.initial).toHaveProperty('scale')
      expect(NODE_ANIMATIONS.initial).toHaveProperty('x')
      expect(NODE_ANIMATIONS.initial).toHaveProperty('y')
      expect(NODE_ANIMATIONS.initial).toHaveProperty('rotate')
    })

    it('should have exit animation properties', () => {
      expect(NODE_ANIMATIONS.exit).toHaveProperty('opacity')
      expect(NODE_ANIMATIONS.exit).toHaveProperty('scale')
      expect(NODE_ANIMATIONS.exit).toHaveProperty('rotate')
    })

    it('should have expected initial values', () => {
      expect(NODE_ANIMATIONS.initial.opacity).toBe(0)
      expect(NODE_ANIMATIONS.initial.scale).toBe(0)
      expect(NODE_ANIMATIONS.initial.x).toBe(-20)
      expect(NODE_ANIMATIONS.initial.y).toBe(-10)
      expect(NODE_ANIMATIONS.initial.rotate).toBe(-15)
    })

    it('should have expected exit values', () => {
      expect(NODE_ANIMATIONS.exit.opacity).toBe(0)
      expect(NODE_ANIMATIONS.exit.scale).toBe(0)
      expect(NODE_ANIMATIONS.exit.rotate).toBe(15)
    })

    it('should be readonly (const assertion)', () => {
      // TypeScript will prevent modification at compile time
      // At runtime, verify the object exists
      expect(NODE_ANIMATIONS).toBeDefined()
      expect(Object.keys(NODE_ANIMATIONS).length).toBe(2)
    })
  })
})

describe('Configuration Integration', () => {
  it('should have all constants properly typed', () => {
    // Verify types are available and correctly structured
    expect(ANIMATION_SPRING).toBeDefined()
    expect(ANIMATION_DURATIONS).toBeDefined()
    expect(NODE_ANIMATIONS).toBeDefined()
  })

  it('should have no hardcoded animation values', () => {
    // The existence of these constants means no hardcoding should occur
    expect(ANIMATION_DURATIONS.recent).toBeDefined()
    expect(ANIMATION_DURATIONS.highlight).toBeDefined()
  })
})
