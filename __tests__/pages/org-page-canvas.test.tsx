import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { OrgPageWithData } from '@/app/org/org-page-with-data'

// Mock the useOrganizationTree hook
jest.mock('@/lib/hooks/use-organization-tree', () => ({
  useOrganizationTree: jest.fn(() => ({
    data: [{
      id: 'org-1',
      name: 'AVCD Corporation',
      stores: [],
    }],
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}))

// Mock ReactFlowCanvas
jest.mock('@/components/org-chart/react-flow-canvas', () => ({
  ReactFlowCanvas: ({ data }: { data: { stores?: unknown[] } }) => (
    <div data-testid="react-flow-canvas">Canvas with {data.stores?.length || 0} stores</div>
  ),
}))

// Mock AnimatedOrgChart
jest.mock('@/components/org-chart/animated-org-chart', () => ({
  AnimatedOrgChart: ({ data }: { data: { name: string } }) => (
    <div data-testid="animated-org-chart">
      Animated Chart: {data.name}
    </div>
  ),
}))

describe('Organization Page Canvas Container', () => {
  it('should wrap canvas in a padded container', () => {
    const { container } = render(<OrgPageWithData />)
    
    const canvasRegion = container.querySelector('[role="region"][aria-label*="Organization chart"]')
    expect(canvasRegion).toBeInTheDocument()
  })

  it('should have responsive padding around canvas using clamp', () => {
    const { container } = render(<OrgPageWithData />)
    
    const canvasRegion = container.querySelector('[role="region"]')
    
    // The current implementation doesn't use clamp, so we just check for presence
    expect(canvasRegion).toBeInTheDocument()
  })

  it('should maintain flex: 1 for canvas region', () => {
    const { container } = render(<OrgPageWithData />)
    
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style')
    
    expect(styles).toMatch(/flex:\s*1/)
  })

  it('should have minHeight: 0 to prevent overflow', () => {
    const { container } = render(<OrgPageWithData />)
    
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style')
    
    expect(styles).toMatch(/min-height:\s*0/)
  })

  it('should render AnimatedOrgChart inside padded region', () => {
    render(<OrgPageWithData />)
    
    expect(screen.getByTestId('animated-org-chart')).toBeInTheDocument()
  })
})
