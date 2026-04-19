import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import OrganizationPage from '@/app/org/page'

// Mock the ReactFlowCanvas since we're only testing header
jest.mock('@/components/org-chart/react-flow-canvas', () => ({
  ReactFlowCanvas: () => <div data-testid="mock-canvas">Canvas</div>,
}))

describe('Organization Page Header Spacing', () => {
  it('should render header with "Organization" title', async () => {
    const Page = await OrganizationPage()
    render(Page)
    expect(screen.getByRole('heading', { name: /organization/i })).toBeInTheDocument()
  })

  it('should have responsive horizontal padding using clamp', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    
    // Should use clamp for horizontal padding
    expect(styles).toMatch(/clamp\(1rem,\s*5vw,\s*3rem\)/)
  })

  it('should maintain vertical padding of 32px (var(--sp-8))', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    
    expect(styles).toMatch(/var\(--sp-8\)/)
  })

  it('should have white background', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    
    expect(styles).toContain('background: var(--bg)')
  })

  it('should have bottom border', async () => {
    const Page = await OrganizationPage()
    const { container } = render(Page)
    const header = container.querySelector('header')
    const styles = header?.getAttribute('style')
    
    expect(styles).toContain('border-bottom: 1px solid var(--g200)')
  })
})
