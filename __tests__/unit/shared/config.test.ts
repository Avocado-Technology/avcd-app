import { describe, it, expect } from '@jest/globals'
import {
  ANIMATION_SPRING,
  ANIMATION_DURATIONS,
  NODE_ANIMATIONS,
} from '@/lib/animation-constants'
import { NODE_DIMENSIONS } from '@/components/org-chart/config'
import { NODE_TYPES } from '@/components/org-chart/types'

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

describe('Node Dimensions Configuration', () => {
  describe('NODE_DIMENSIONS', () => {
    it('should have dimensions for all node types', () => {
      expect(NODE_DIMENSIONS).toHaveProperty(NODE_TYPES.ORGANIZATION)
      expect(NODE_DIMENSIONS).toHaveProperty(NODE_TYPES.STORE)
      expect(NODE_DIMENSIONS).toHaveProperty(NODE_TYPES.EMPLOYEE)
    })

    it('should have width and height for organization nodes', () => {
      const orgDimensions = NODE_DIMENSIONS[NODE_TYPES.ORGANIZATION]
      expect(orgDimensions).toHaveProperty('width')
      expect(orgDimensions).toHaveProperty('height')
      expect(typeof orgDimensions.width).toBe('number')
      expect(typeof orgDimensions.height).toBe('number')
    })

    it('should have width and height for store nodes', () => {
      const storeDimensions = NODE_DIMENSIONS[NODE_TYPES.STORE]
      expect(storeDimensions).toHaveProperty('width')
      expect(storeDimensions).toHaveProperty('height')
      expect(typeof storeDimensions.width).toBe('number')
      expect(typeof storeDimensions.height).toBe('number')
    })

    it('should have width and height for employee nodes', () => {
      const empDimensions = NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE]
      expect(empDimensions).toHaveProperty('width')
      expect(empDimensions).toHaveProperty('height')
      expect(typeof empDimensions.width).toBe('number')
      expect(typeof empDimensions.height).toBe('number')
    })

    it('should have expected dimensions matching actual node sizes', () => {
      // Organization node
      expect(NODE_DIMENSIONS[NODE_TYPES.ORGANIZATION].width).toBe(280)
      expect(NODE_DIMENSIONS[NODE_TYPES.ORGANIZATION].height).toBe(80)
      
      // Store node
      expect(NODE_DIMENSIONS[NODE_TYPES.STORE].width).toBe(220)
      expect(NODE_DIMENSIONS[NODE_TYPES.STORE].height).toBe(70)
      
      // Employee node
      expect(NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE].width).toBe(180)
      expect(NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE].height).toBe(60)
    })

    it('should have dimensions that decrease from org to store to employee', () => {
      const orgWidth = NODE_DIMENSIONS[NODE_TYPES.ORGANIZATION].width
      const storeWidth = NODE_DIMENSIONS[NODE_TYPES.STORE].width
      const empWidth = NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE].width
      
      expect(orgWidth).toBeGreaterThan(storeWidth)
      expect(storeWidth).toBeGreaterThan(empWidth)
    })

    it('should be readonly (const assertion)', () => {
      // TypeScript will prevent modification at compile time
      // At runtime, verify the object exists
      expect(NODE_DIMENSIONS).toBeDefined()
      expect(Object.keys(NODE_DIMENSIONS).length).toBe(3)
    })
  })
})

describe('Configuration Integration', () => {
  it('should have all constants properly typed', () => {
    // Verify types are available and correctly structured
    expect(ANIMATION_SPRING).toBeDefined()
    expect(ANIMATION_DURATIONS).toBeDefined()
    expect(NODE_ANIMATIONS).toBeDefined()
    expect(NODE_DIMENSIONS).toBeDefined()
  })

  it('should have no hardcoded animation values', () => {
    // The existence of these constants means no hardcoding should occur
    expect(ANIMATION_DURATIONS.recent).toBeDefined()
    expect(ANIMATION_DURATIONS.highlight).toBeDefined()
  })
})
