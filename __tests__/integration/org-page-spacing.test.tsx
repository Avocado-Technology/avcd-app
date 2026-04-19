import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import OrganizationPage from '@/app/org/page'
import { AppTopBar } from '@/app/components/AppTopBar'

// Mock dependencies
jest.mock('@/components/org-chart/react-flow-canvas', () => ({
  ReactFlowCanvas: () => <div data-testid="canvas">Canvas</div>,
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
  it('should have consistent horizontal padding across AppTopBar and page header', async () => {
    // Render AppTopBar
    const { container: topBarContainer } = render(<AppTopBar session={mockSession} />)
    const topBarHeader = topBarContainer.querySelector('header')
    const topBarStyles = topBarHeader?.getAttribute('style') || ''
    
    // Render Org Page
    const Page = await OrganizationPage()
    const { container: pageContainer } = render(Page)
    const pageHeader = pageContainer.querySelector('header')
    const pageStyles = pageHeader?.getAttribute('style') || ''
    
    // Both should use clamp(1rem, 5vw, 3rem)
    const clampPattern = /clamp\(1rem,\s*5vw,\s*3rem\)/
    expect(topBarStyles).toMatch(clampPattern)
    expect(pageStyles).toMatch(clampPattern)
  })

  it('should have minimum 16px padding on smallest screens', async () => {
    // This verifies the clamp min value
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style') || ''
    
    // clamp starts at 1rem (16px)
    expect(styles).toMatch(/clamp\(1rem/)
  })

  it('should have maximum 48px padding on largest screens', async () => {
    // This verifies the clamp max value
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style') || ''
    
    // clamp ends at 3rem (48px)
    expect(styles).toMatch(/3rem\)/)
  })

  it('should not have content touching viewport edges', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    
    // Check that canvas region has padding
    const canvasRegion = container.querySelector('[role="region"]')
    const styles = canvasRegion?.getAttribute('style') || ''
    expect(styles).toContain('padding')
  })

  it('should maintain proper visual hierarchy', async () => {
    const Page = await OrganizationPage()
    render(Page)
    
    // Page structure should be: main > header + region > canvas
    const main = screen.getByRole('main')
    const heading = screen.getByRole('heading', { name: /organization/i })
    const region = screen.getByRole('region')
    
    expect(main).toContainElement(heading)
    expect(main).toContainElement(region)
  })

  it('should have consistent border styling', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style') || ''
    
    expect(styles).toContain('border-bottom: 1px solid var(--g200)')
  })
})
