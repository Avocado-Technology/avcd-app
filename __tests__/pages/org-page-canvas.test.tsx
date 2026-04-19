import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import OrganizationPage from '@/app/org/page'

// Mock ReactFlowCanvas
jest.mock('@/components/org-chart/react-flow-canvas', () => ({
  ReactFlowCanvas: ({ data }: any) => (
    <div data-testid="react-flow-canvas">Canvas with {data.stores?.length || 0} stores</div>
  ),
}))

describe('Organization Page Canvas Container', () => {
  it('should wrap canvas in a padded container', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    
    const canvasRegion = container.querySelector('[role="region"][aria-label*="Organization chart"]')
    expect(canvasRegion).toBeInTheDocument()
  })

  it('should have responsive padding around canvas using clamp', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style')
    
    // Should have padding using clamp (1rem to 2rem)
    expect(styles).toMatch(/padding.*clamp/)
  })

  it('should maintain flex: 1 for canvas region', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style')
    
    expect(styles).toMatch(/flex:\s*1/)
  })

  it('should have minHeight: 0 to prevent overflow', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style')
    
    expect(styles).toMatch(/min-height:\s*0/)
  })

  it('should render ReactFlowCanvas inside padded region', async () => {
    const Page = await OrganizationPage()
    render(Page)
    
    expect(screen.getByTestId('react-flow-canvas')).toBeInTheDocument()
  })
})
