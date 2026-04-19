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

  it("should render main element with flex layout", () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector("main")
    const cls = main?.getAttribute("class") || ""
    expect(cls).toMatch(/flex/)
    expect(cls).toMatch(/flex-1/)
    expect(cls).toMatch(/flex-col/)
  })

  it("should have proper background color on main", () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector("main")
    const cls = main?.getAttribute("class") || ""
    expect(cls).toContain("bg-[var(--g50)]")
  })

  it("should use zero padding on small viewports and sp-6 at lg+ (className)", () => {
    const { container } = render(<OrgPageWithData />)
    const main = container.querySelector("main")
    const cls = main?.getAttribute("class") || ""
    expect(cls).toMatch(/p-0/)
    expect(cls).toMatch(/lg:p-\[var\(--sp-6\)\]/)
  })

  it("should have region with flex layout for the chart", () => {
    const { container } = render(<OrgPageWithData />)
    const canvasRegion = container.querySelector('[role="region"]')
    const cls = canvasRegion?.getAttribute("class") || ""
    expect(cls).toMatch(/flex-1/)
    expect(cls).toMatch(/flex-col/)
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
