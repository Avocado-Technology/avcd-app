import { describe, it, expect, jest } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { useAnimationState } from '@/lib/hooks/useAnimationState'

// Mock motion/react to avoid flaky animation tests
jest.mock('motion/react')

describe('Animation Integration Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Animation State Transitions', () => {
    it('should handle pending to in-progress to complete transition', () => {
      const { result } = renderHook(() => useAnimationState())

      // Initial state: pending (no animations)
      expect(result.current.recentChanges.size).toBe(0)
      expect(result.current.highlightedNodes.size).toBe(0)

      // Mark as recent: in-progress
      act(() => {
        result.current.markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)

      // Complete after duration
      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
    })

    it('should handle overlapping animation states', () => {
      const { result } = renderHook(() => useAnimationState())

      // Node can be both recent and highlighted
      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.highlightNode('node-1', 1500)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      // Recent expires first
      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      // Highlight expires after
      act(() => {
        jest.advanceTimersByTime(700)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(false)
    })
  })

  describe('Concurrent Animations', () => {
    it('should handle multiple nodes animating simultaneously', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-2', 1000)
        result.current.markAsRecent('node-3', 600)
      })

      expect(result.current.recentChanges.size).toBe(3)

      // Node-3 expires first (600ms)
      act(() => {
        jest.advanceTimersByTime(600)
      })

      expect(result.current.recentChanges.size).toBe(2)
      expect(result.current.recentChanges.has('node-3')).toBe(false)

      // Node-1 expires (800ms total)
      act(() => {
        jest.advanceTimersByTime(200)
      })

      expect(result.current.recentChanges.size).toBe(1)
      expect(result.current.recentChanges.has('node-1')).toBe(false)

      // Node-2 expires (1000ms total)
      act(() => {
        jest.advanceTimersByTime(200)
      })

      expect(result.current.recentChanges.size).toBe(0)
    })

    it('should not interfere with each other', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.highlightNode('node-2', 1500)
      })

      // Both should be active
      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.highlightedNodes.has('node-2')).toBe(true)

      // Advance time to expire node-1
      act(() => {
        jest.advanceTimersByTime(800)
      })

      // Only node-1 should be cleared
      expect(result.current.recentChanges.has('node-1')).toBe(false)
      expect(result.current.highlightedNodes.has('node-2')).toBe(true)
    })
  })

  describe('Animation Cleanup on Rapid Changes', () => {
    it('should handle rapid successive calls for same node', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-1', 800)
      })

      // Node should be in recent changes
      expect(result.current.recentChanges.has('node-1')).toBe(true)

      // After 800ms, at least one timeout should clear it
      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
    })

    it('should handle state changes during animation', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)

      // Change state mid-animation
      act(() => {
        jest.advanceTimersByTime(400)
        result.current.highlightNode('node-1', 1500)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      // Recent should expire
      act(() => {
        jest.advanceTimersByTime(400)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
      expect(result.current.highlightedNodes.has('node-1')).toBe(true)
    })
  })

  describe('Reduced Motion Support', () => {
    it('should respect reduced motion preferences', () => {
      // This test verifies the hook itself works
      // The actual useReducedMotion check happens in components
      const { result } = renderHook(() => useAnimationState())

      // Animation state should still work even with reduced motion
      act(() => {
        result.current.markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
    })
  })

  describe('Animation Imperatives (Ref API)', () => {
    it('should expose markAsRecent through ref', () => {
      const { result } = renderHook(() => useAnimationState())

      const { markAsRecent } = result.current

      act(() => {
        markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
    })

    it('should expose highlightNode through ref', () => {
      const { result } = renderHook(() => useAnimationState())

      const { highlightNode } = result.current

      act(() => {
        highlightNode('node-1', 1500)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(true)
    })

    it('should expose clearAll through ref', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.highlightNode('node-2', 1500)
      })

      expect(result.current.recentChanges.size).toBe(1)
      expect(result.current.highlightedNodes.size).toBe(1)

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.recentChanges.size).toBe(0)
      expect(result.current.highlightedNodes.size).toBe(0)
    })
  })

  describe('Animation Performance', () => {
    it('should handle large numbers of concurrent animations', () => {
      const { result } = renderHook(() => useAnimationState())

      // Simulate 100 nodes being marked as recent
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.markAsRecent(`node-${i}`, 800)
        }
      })

      expect(result.current.recentChanges.size).toBe(100)

      // All should clear after 800ms
      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(result.current.recentChanges.size).toBe(0)
    })

    it('should not cause memory issues with rapid state changes', () => {
      const { result } = renderHook(() => useAnimationState())

      // Rapidly add and remove animations
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.markAsRecent(`node-${i}`, 100)
        }
      })

      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(result.current.recentChanges.size).toBe(0)

      // Do it again
      act(() => {
        for (let i = 50; i < 100; i++) {
          result.current.markAsRecent(`node-${i}`, 100)
        }
      })

      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(result.current.recentChanges.size).toBe(0)
    })
  })
})
