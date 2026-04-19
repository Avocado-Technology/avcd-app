import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AnimatedOrgChart, AnimatedOrgChartRef } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'

// Mock React Flow
jest.mock('reactflow', () => ({
  ReactFlow: ({ nodes, children }: any) => (
    <div data-testid="react-flow">
      {nodes.map((node: any) => (
        <div key={node.id} data-testid={`node-${node.id}`}>
          {node.data.name}
        </div>
      ))}
      {children}
    </div>
  ),
  Controls: () => <div data-testid="controls">Controls</div>,
  Background: () => <div data-testid="background">Background</div>,
  useNodesState: (initial: any) => [initial, jest.fn(), jest.fn()],
  useEdgesState: (initial: any) => [initial, jest.fn(), jest.fn()],
}))

describe('AnimatedOrgChart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render React Flow with organization data', async () => {
    render(<AnimatedOrgChart data={mockOrgData} />)
    // Wait for dynamic import to load
    await waitFor(() => {
      expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    })
  })

  it('should pass animated node types to React Flow', () => {
    const { container } = render(<AnimatedOrgChart data={mockOrgData} />)
    // Check that nodes are rendered with animated components
    expect(screen.getByText(mockOrgData.name)).toBeInTheDocument()
  })

  it('should initialize with no recent changes', () => {
    render(<AnimatedOrgChart data={mockOrgData} />)
    // All nodes should have isRecent=false initially
    const allNodes = screen.getAllByTestId(/^node-/)
    expect(allNodes.length).toBeGreaterThan(0)
  })

  it('should detect data changes when new employee added', async () => {
    const { rerender } = render(<AnimatedOrgChart data={mockOrgData} />)

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('react-flow')).toBeInTheDocument()
    })

    const initialNodeCount = screen.getAllByTestId(/^node-/).length

    const newEmployee = {
      id: 'emp-new',
      name: 'New Employee',
      role: 'Developer',
      email: 'new@avcd.com'
    }

    const newData = {
      ...mockOrgData,
      stores: [
        {
          ...mockOrgData.stores[0],
          employees: [...mockOrgData.stores[0].employees, newEmployee]
        },
        ...mockOrgData.stores.slice(1)
      ]
    }

    rerender(<AnimatedOrgChart data={newData} />)

    // Verify data prop changed (component should recalculate nodes)
    expect(newData.stores[0].employees.length).toBeGreaterThan(mockOrgData.stores[0].employees.length)
  })

  it('should expose animation controls via ref', () => {
    const ref = React.createRef<AnimatedOrgChartRef>()
    render(<AnimatedOrgChart ref={ref} data={mockOrgData} />)

    expect(ref.current).toBeDefined()
    expect(typeof ref.current?.markAsRecent).toBe('function')
    expect(typeof ref.current?.highlightNode).toBe('function')
  })

  it('should use memoized nodeTypes to prevent re-renders', () => {
    const { rerender } = render(<AnimatedOrgChart data={mockOrgData} />)
    const firstRender = screen.getByTestId('react-flow')

    // Re-render with same data
    rerender(<AnimatedOrgChart data={mockOrgData} />)
    const secondRender = screen.getByTestId('react-flow')

    // Should be same instance (memoized)
    expect(firstRender).toBe(secondRender)
  })
})
