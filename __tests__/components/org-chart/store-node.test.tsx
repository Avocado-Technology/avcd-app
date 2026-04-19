import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { StoreNode } from '@/components/org-chart/nodes/store-node'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('StoreNode Component', () => {
  const mockData = {
    id: 'store-1',
    name: 'Downtown Store',
    location: 'New York, NY',
    employeeCount: 5,
  }

  it('should render store name', () => {
    render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('Downtown Store')).toBeInTheDocument()
  })

  it('should render location', () => {
    render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
  })

  it('should render employee count', () => {
    render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText(/5 employees/i)).toBeInTheDocument()
  })

  it('should have correct dimensions', () => {
    const { container } = render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node.style.width).toBe('220px')
  })

  it('should use mono font for metadata', () => {
    render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const location = screen.getByText('New York, NY')
    expect(location.className).toContain('font-mono')
  })

  it('should have card styling', () => {
    const { container } = render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node).toHaveClass('border-gray-200')
    expect(node).toHaveClass('rounded-xl')
  })
})
