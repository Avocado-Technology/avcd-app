import { describe, it, expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { AppTopBar } from '@/app/components/AppTopBar'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock SidebarTrigger since we're only testing spacing
jest.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle</button>,
}))

// Mock MobileNav
jest.mock('@/components/mobile-nav', () => ({
  MobileNav: () => <button data-testid="mobile-nav">Menu</button>,
}))

const mockSession = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    picture: null,
  },
}

describe('AppTopBar Spacing', () => {
  it('should use responsive padding via CSS clamp', () => {
    const { container } = render(<AppTopBar session={mockSession} />)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    
    // Should use clamp(1rem, 5vw, 3rem) for responsive padding
    expect(styles).toMatch(/clamp\(1rem,\s*5vw,\s*3rem\)/)
  })

  it('should have height of 56px', () => {
    const { container } = render(<AppTopBar session={mockSession} />)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    expect(styles).toContain('height: 56px')
  })

  it('should maintain sticky positioning', () => {
    const { container } = render(<AppTopBar session={mockSession} />)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    expect(styles).toContain('position: sticky')
    expect(styles).toContain('top: 0')
  })

  it('should have banner role for accessibility', () => {
    const { container } = render(<AppTopBar session={mockSession} />)
    const header = container.querySelector('header')
    expect(header?.getAttribute('role')).toBe('banner')
  })
})
