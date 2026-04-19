import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AnimatedStoreNode } from '@/components/org-chart/nodes/animated-store-node'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('AnimatedStoreNode Component', () => {
  const mockData = {
    id: 'store-1',
    name: 'Downtown Store',
    location: 'New York, NY',
    employeeCount: 5,
  }

  it('should render with Motion wrapper', () => {
    render(<AnimatedStoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('Downtown Store')).toBeInTheDocument()
  })

  it('should show NEW badge when isRecent is true', () => {
    const dataWithRecent = { ...mockData, isRecent: true }
    render(<AnimatedStoreNode data={dataWithRecent} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('should display employee count', () => {
    render(<AnimatedStoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('5 employees')).toBeInTheDocument()
  })

  it('should preserve store icon', () => {
    const { container } = render(<AnimatedStoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const icon = container.querySelector('[data-testid="store-icon"]')
    expect(icon).toBeInTheDocument()
  })
})
