import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrgChartSkeleton } from '@/components/org-chart/org-chart-skeleton'
import { OrgChartError } from '@/components/org-chart/org-chart-error'
import { OrgChartEmpty } from '@/components/org-chart/org-chart-empty'

describe('OrgChartSkeleton', () => {
  it('should render loading skeleton', () => {
    render(<OrgChartSkeleton />)
    expect(screen.getByText(/loading organization chart/i)).toBeInTheDocument()
  })

  it('should show skeleton shimmer elements', () => {
    const { container } = render(<OrgChartSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
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
