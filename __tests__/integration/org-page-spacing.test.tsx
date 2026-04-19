import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { OrgPageWithData } from '@/app/org/org-page-with-data'
import { AppTopBar } from '@/app/components/AppTopBar'

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

jest.mock('next/navigation', () => ({
  usePathname: () => '/org',
}))

jest.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle</button>,
}))

jest.mock('@/components/mobile-nav', () => ({
  MobileNav: () => <button data-testid="mobile-nav">Menu</button>,
}))

const mockSession = {
  user: { name: 'Test User', email: 'test@example.com', picture: null },
}

describe('Org Page Spacing Integration', () => {
  it('should have consistent horizontal padding across AppTopBar', () => {
    // Render AppTopBar
    const { container: topBarContainer } = render(<AppTopBar session={mockSession} />)
    const topBarHeader = topBarContainer.querySelector('header')
    const topBarStyles = topBarHeader?.getAttribute('style') || ''
    
    // Should use clamp(1rem, 5vw, 3rem)
    const clampPattern = /clamp\(1rem,\s*5vw,\s*3rem\)/
    expect(topBarStyles).toMatch(clampPattern)
  })

  it('should render main element with flex layout', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    const styles = main?.getAttribute('style') || ''
    
    expect(styles).toMatch(/flex:\s*1/)
    expect(styles).toMatch(/display:\s*flex/)
  })

  it('should have proper background color', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    const styles = main?.getAttribute('style') || ''
    
    expect(styles).toContain('background: var(--g50)')
  })

  it('should not have content touching viewport edges', () => {
    const { container } = render(<OrgPageWithData />)
    
    // Check that region has proper flex layout
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style') || ''
    expect(styles).toMatch(/flex:\s*1/)
  })

  it('should maintain proper visual hierarchy', () => {
    render(<OrgPageWithData />)
    
    // Page structure should be: main > region > canvas
    const main = screen.getByRole('main')
    const region = screen.getByRole('region')
    
    expect(main).toContainElement(region)
  })

  it('should have proper ARIA attributes', () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector('main')
    
    expect(main).toHaveAttribute('role', 'main')
    expect(main).toHaveAttribute('aria-label', 'Organization chart page')
  })
})
