import { describe, it, expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { OrgPageWithData } from '@/app/org/org-page-with-data'

// Mock the useOrganizationTree hook
jest.mock('@/lib/hooks/use-organization-tree', () => ({
  useOrganizationTree: jest.fn(() => ({
    data: [{
      id: 'org-1',
      name: 'Organization',
      stores: [],
    }],
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}))

// Mock AnimatedOrgChart
jest.mock('@/components/org-chart/animated-org-chart', () => ({
  AnimatedOrgChart: ({ data }: { data: { name: string } }) => (
    <div data-testid="animated-org-chart">
      Animated Chart: {data.name}
    </div>
  ),
}))

describe('Organization Page Header Spacing', () => {
  it('should render main element with proper ARIA', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('role', 'main')
    expect(main).toHaveAttribute('aria-label', 'Organization chart page')
  })

  it('should render organization chart region', () => {
    const { container } = render(<OrgPageWithData />)
    const region = container.querySelector('[role="region"][aria-label*="Organization chart"]')
    expect(region).toBeInTheDocument()
  })

  it('should have flex layout for main element', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    const styles = main?.getAttribute('style')
    
    expect(styles).toMatch(/flex:\s*1/)
    expect(styles).toMatch(/display:\s*flex/)
  })

  it('should have background color', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    const styles = main?.getAttribute('style')
    
    expect(styles).toContain('background: var(--g50)')
  })

  it('should have minHeight: 0 to prevent overflow', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    const styles = main?.getAttribute('style')
    
    expect(styles).toMatch(/min-height:\s*0/)
  })
})
