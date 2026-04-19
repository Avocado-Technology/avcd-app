import { renderHook, act } from '@testing-library/react'
import { useAnimationState } from '@/lib/hooks/useAnimationState'

describe('useAnimationState', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('markAsRecent', () => {
    it('should add node to recentChanges set', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1')
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
    })

    it('should remove node from recentChanges after duration', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
    })

    it('should clear setTimeout when component unmounts before timeout completes', () => {
      const { result, unmount } = renderHook(() => useAnimationState())
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      act(() => {
        result.current.markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)

      // Unmount before timeout completes
      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      
      clearTimeoutSpy.mockRestore()
    })

    it('should handle multiple concurrent animations', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-2', 1000)
        result.current.markAsRecent('node-3', 600)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.recentChanges.has('node-2')).toBe(true)
      expect(result.current.recentChanges.has('node-3')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(600)
      })

      expect(result.current.recentChanges.has('node-3')).toBe(false)
      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.recentChanges.has('node-2')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(200)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
      expect(result.current.recentChanges.has('node-2')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(200)
      })

      expect(result.current.recentChanges.has('node-2')).toBe(false)
    })

    it('should clear all pending timeouts on unmount', () => {
      const { result, unmount } = renderHook(() => useAnimationState())
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-2', 1000)
        result.current.markAsRecent('node-3', 600)
      })

      // Unmount with all timeouts pending
      unmount()

      // Should have cleared all 3 timeouts
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(3)
      
      clearTimeoutSpy.mockRestore()
    })

    it('should not cause setState warnings after unmount', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const { result, unmount } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
      })

      unmount()

      // Try to run the pending timeout
      act(() => {
        jest.advanceTimersByTime(800)
      })

      // Should not have any console errors about setState on unmounted component
      const stateUpdateWarnings = consoleErrorSpy.mock.calls.filter(call =>
        call[0]?.toString().includes('setState') || 
        call[0]?.toString().includes('unmounted')
      )
      expect(stateUpdateWarnings.length).toBe(0)

      consoleErrorSpy.mockRestore()
    })
  })

  describe('highlightNode', () => {
    it('should add node to highlightedNodes set', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.highlightNode('node-1')
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(true)
    })

    it('should remove node from highlightedNodes after duration', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.highlightNode('node-1', 1500)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(1500)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(false)
    })

    it('should clear setTimeout when component unmounts before timeout completes', () => {
      const { result, unmount } = renderHook(() => useAnimationState())
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      act(() => {
        result.current.highlightNode('node-1', 1500)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      
      clearTimeoutSpy.mockRestore()
    })

    it('should handle multiple concurrent highlights', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.highlightNode('node-1', 1000)
        result.current.highlightNode('node-2', 1500)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(true)
      expect(result.current.highlightedNodes.has('node-2')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(false)
      expect(result.current.highlightedNodes.has('node-2')).toBe(true)
    })
  })

  describe('clearAll', () => {
    it('should clear both recentChanges and highlightedNodes', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1')
        result.current.highlightNode('node-2')
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.highlightedNodes.has('node-2')).toBe(true)

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.recentChanges.size).toBe(0)
      expect(result.current.highlightedNodes.size).toBe(0)
    })

    it('should clear all pending timeouts', () => {
      const { result } = renderHook(() => useAnimationState())
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-2', 1000)
        result.current.highlightNode('node-3', 1500)
      })

      act(() => {
        result.current.clearAll()
      })

      // Should have cleared all 3 pending timeouts
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(3)
      
      clearTimeoutSpy.mockRestore()
    })

    it('should prevent timeouts from executing after clearAll', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.highlightNode('node-2', 1500)
      })

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.recentChanges.size).toBe(0)
      expect(result.current.highlightedNodes.size).toBe(0)

      // Advance timers - nothing should be added back
      act(() => {
        jest.advanceTimersByTime(2000)
      })

      expect(result.current.recentChanges.size).toBe(0)
      expect(result.current.highlightedNodes.size).toBe(0)
    })
  })

  describe('mixed scenarios', () => {
    it('should handle both markAsRecent and highlightNode on same node', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.highlightNode('node-1', 1500)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)
      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(false)
      expect(result.current.highlightedNodes.has('node-1')).toBe(true)

      act(() => {
        jest.advanceTimersByTime(700)
      })

      expect(result.current.highlightedNodes.has('node-1')).toBe(false)
    })

    it('should handle rapid successive calls for same node', () => {
      const { result } = renderHook(() => useAnimationState())

      act(() => {
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-1', 800)
        result.current.markAsRecent('node-1', 800)
      })

      expect(result.current.recentChanges.has('node-1')).toBe(true)

      // All timeouts should be tracked and cleared on unmount
      const { unmount } = renderHook(() => useAnimationState())
      unmount()
    })
  })
})
