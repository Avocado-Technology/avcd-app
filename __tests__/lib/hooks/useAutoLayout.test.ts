import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import * as ReactFlow from 'reactflow'
import { ReactFlowProvider } from 'reactflow'
import { useAutoLayout } from '@/lib/hooks/useAutoLayout'

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(ReactFlowProvider, null, children)
}

describe('useAutoLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call setNodes with layouted positions when nodesInitialized', async () => {
    const mockSetNodes = jest.fn()
    const mockGetNodes = jest.fn(() => [
      { id: 'node-1', position: { x: 0, y: 0 }, data: {} }
    ])
    const mockGetEdges = jest.fn(() => [])
    
    jest.spyOn(ReactFlow, 'useNodesInitialized').mockReturnValue(true)
    jest.spyOn(ReactFlow, 'useReactFlow').mockReturnValue({
      setNodes: mockSetNodes,
      getNodes: mockGetNodes,
      getEdges: mockGetEdges,
      fitView: jest.fn()
    })

    renderHook(() => useAutoLayout({ direction: 'RIGHT' }), { wrapper })

    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled()
      expect(mockGetNodes).toHaveBeenCalled()
    })
  })

  it('should not run layout when nodesInitialized is false', () => {
    const mockSetNodes = jest.fn()
    jest.spyOn(ReactFlow, 'useNodesInitialized').mockReturnValue(false)
    jest.spyOn(ReactFlow, 'useReactFlow').mockReturnValue({
      setNodes: mockSetNodes,
      getNodes: jest.fn(() => []),
      getEdges: jest.fn(() => []),
      fitView: jest.fn()
    })

    renderHook(() => useAutoLayout(), { wrapper })

    expect(mockSetNodes).not.toHaveBeenCalled()
  })

  it('should apply fitView after layout with animation', async () => {
    const mockFitView = jest.fn()
    const mockGetNodes = jest.fn(() => [{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }])
    
    jest.spyOn(ReactFlow, 'useNodesInitialized').mockReturnValue(true)
    jest.spyOn(ReactFlow, 'useReactFlow').mockReturnValue({
      setNodes: jest.fn(),
      getNodes: mockGetNodes,
      getEdges: jest.fn(() => []),
      fitView: mockFitView
    })

    renderHook(() => useAutoLayout(), { wrapper })

    await waitFor(() => {
      expect(mockFitView).toHaveBeenCalledWith({ duration: 800 })
    }, { timeout: 1500 })
  })

  it('should expose applyAutoLayout callback for manual triggering', async () => {
    jest.spyOn(ReactFlow, 'useNodesInitialized').mockReturnValue(true)
    jest.spyOn(ReactFlow, 'useReactFlow').mockReturnValue({
      setNodes: jest.fn(),
      getNodes: jest.fn(() => []),
      getEdges: jest.fn(() => []),
      fitView: jest.fn()
    })
    
    const { result } = renderHook(() => useAutoLayout(), { wrapper })

    expect(result.current.applyAutoLayout).toBeDefined()
    expect(typeof result.current.applyAutoLayout).toBe('function')
    
    await result.current.applyAutoLayout()
  })

  it('should cleanup timers on unmount', async () => {
    jest.useFakeTimers()
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    jest.spyOn(ReactFlow, 'useNodesInitialized').mockReturnValue(true)
    jest.spyOn(ReactFlow, 'useReactFlow').mockReturnValue({
      setNodes: jest.fn(),
      getNodes: jest.fn(() => [{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }]),
      getEdges: jest.fn(() => []),
      fitView: jest.fn()
    })

    const { unmount } = renderHook(() => useAutoLayout(), { wrapper })

    // Wait for layout to complete and timeout to be set
    await waitFor(() => {
      expect(clearTimeoutSpy).not.toHaveBeenCalled()
    })

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
    jest.useRealTimers()
  })
})
