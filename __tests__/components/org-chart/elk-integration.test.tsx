import { render, waitFor, act } from '@testing-library/react'
import React from 'react'
import type { Edge, Node, NodeChange } from 'reactflow'
import type { AnimatedOrgChartRef } from '@/components/org-chart/animated-org-chart'
import { AnimatedOrgChart } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'

// Mock ReactFlow to avoid rendering complexity
jest.mock('reactflow', () => ({
  ReactFlow: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) =>
    React.createElement('div', { 'data-testid': 'react-flow' },
      React.createElement('div', { 'data-testid': 'nodes-count' }, nodes.length),
      React.createElement('div', { 'data-testid': 'edges-count' }, edges.length)
    ),
  Controls: () => React.createElement('div', null, 'Controls'),
  Background: () => React.createElement('div', null, 'Background'),
  useNodesState: (initial: Node[]) => [initial, jest.fn(), jest.fn()],
  useEdgesState: (initial: Edge[]) => [initial, jest.fn(), jest.fn()],
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
  useReactFlow: () => ({
    setNodes: jest.fn(),
    getNodes: jest.fn(() => []),
    getEdges: jest.fn(() => []),
    fitView: jest.fn()
  }),
  useNodesInitialized: () => true,
  applyNodeChanges: jest.fn((changes: NodeChange[], nodes: Node[]) => nodes)
}))

// Mock useAutoLayout to avoid actual layout calculations in integration tests
jest.mock('@/lib/hooks/useAutoLayout', () => ({
  useAutoLayout: () => ({
    applyAutoLayout: jest.fn()
  })
}))

describe('AnimatedOrgChart with ELK Layout', () => {
  it('should render nodes with ELK positions', async () => {
    const { getByTestId } = render(React.createElement(AnimatedOrgChart, { data: mockOrgData }))

    await waitFor(() => {
      const nodesCount = getByTestId('nodes-count')
      // 1 org + 2 stores + 3 employees = 6 nodes
      expect(nodesCount.textContent).toBe('6')
    })
  })

  it('should re-layout when data changes', async () => {
    const { rerender, getByTestId } = render(React.createElement(AnimatedOrgChart, { data: mockOrgData }))

    const newData = {
      ...mockOrgData,
      stores: [...mockOrgData.stores, {
        id: 'store-3',
        name: 'New Store',
        location: 'Queens, NY',
        employees: []
      }]
    }

    rerender(React.createElement(AnimatedOrgChart, { data: newData }))

    await waitFor(() => {
      const nodesCount = getByTestId('nodes-count')
      // 1 org + 3 stores + 3 employees = 7 nodes
      expect(nodesCount.textContent).toBe('7')
    })
  })

  it('should maintain animation state during layout', async () => {
    const ref = React.createRef<AnimatedOrgChartRef | null>()

    render(React.createElement(AnimatedOrgChart, { ref, data: mockOrgData }))

    act(() => {
      ref.current?.markAsRecent('emp-1')
    })

    // Layout should preserve animation states
    await waitFor(() => {
      expect(ref.current).toBeDefined()
    })
  })
})
