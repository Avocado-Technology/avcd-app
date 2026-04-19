import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrgChartSkeleton } from '@/components/org-chart/org-chart-skeleton'
import { OrgChartError } from '@/components/org-chart/org-chart-error'
import { OrgChartEmpty } from '@/components/org-chart/org-chart-empty'

describe('OrgChartSkeleton', () => {
  it('should render loading skeleton with hierarchical structure', () => {
    const { container } = render(<OrgChartSkeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('should render 7 skeleton nodes (1 org + 2 stores + 4 employees)', () => {
    const { container } = render(<OrgChartSkeleton />)
    
    // Count nodes by their dimensions
    const orgNode = container.querySelector('[style*="width: 280px"]')
    const storeNodes = container.querySelectorAll('[style*="width: 220px"]')
    const employeeNodes = container.querySelectorAll('[style*="width: 180px"]')
    
    expect(orgNode).toBeInTheDocument()
    expect(storeNodes.length).toBe(2)
    expect(employeeNodes.length).toBe(4)
  })

  it('should have proper ARIA attributes for accessibility', () => {
    const { container } = render(<OrgChartSkeleton />)
    const wrapper = container.firstChild as HTMLElement
    
    expect(wrapper).toHaveAttribute('role', 'status')
    expect(wrapper).toHaveAttribute('aria-live', 'polite')
    expect(wrapper).toHaveAttribute('aria-label', 'Loading organization chart')
  })

  it('should have screen reader text', () => {
    render(<OrgChartSkeleton />)
    const srText = screen.getByText('Loading organization chart')
    
    expect(srText).toBeInTheDocument()
    expect(srText).toHaveClass('sr-only')
  })

  it('should hide visual skeleton from screen readers', () => {
    const { container } = render(<OrgChartSkeleton />)
    const visualSkeleton = container.querySelector('[aria-hidden="true"]')
    
    expect(visualSkeleton).toBeInTheDocument()
  })
})

describe('OrgChartError', () => {
  it('should render error message', () => {
    const error = new Error('Network error')
    render(<OrgChartError error={error} reset={() => {}} />)
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('should call reset when button clicked', async () => {
    const user = userEvent.setup()
    const mockReset = jest.fn()
    render(<OrgChartError error={new Error('Test')} reset={mockReset} />)
    
    await user.click(screen.getByText(/try again/i))
    expect(mockReset).toHaveBeenCalledTimes(1)
  })
})

describe('OrgChartEmpty', () => {
  it('should render empty state message', () => {
    render(<OrgChartEmpty />)
    expect(screen.getByText(/no organization data/i)).toBeInTheDocument()
  })

  it('should render helpful instruction', () => {
    render(<OrgChartEmpty />)
    expect(screen.getByText(/add your first store/i)).toBeInTheDocument()
  })
})

describe('OrgChartSkeleton Layout', () => {
  it('should have full width and height', () => {
    const { container } = render(<OrgChartSkeleton />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-full')
    expect(skeleton).toHaveClass('w-full')
  })

  it('should use CSS Grid layout for hierarchy', () => {
    const { container } = render(<OrgChartSkeleton />)
    const gridContainer = container.querySelector('.grid')
    
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass('gap-12')
  })

  it('should center nodes horizontally', () => {
    const { container } = render(<OrgChartSkeleton />)
    const centeredContainers = container.querySelectorAll('.justify-center')
    
    // Should have containers for: org level, store level, employee level
    expect(centeredContainers.length).toBeGreaterThanOrEqual(3)
  })
})
