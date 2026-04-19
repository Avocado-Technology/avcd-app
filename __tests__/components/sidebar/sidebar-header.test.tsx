import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { SidebarHeader } from '@/components/sidebar/sidebar-header'

describe('SidebarHeader Component', () => {
  it('should render AVCD logo text', () => {
    render(<SidebarHeader />)
    expect(screen.getByText('AVCD')).toBeInTheDocument()
  })

  it('should render green status dot', () => {
    const { container } = render(<SidebarHeader />)
    const dot = container.querySelector('[data-testid="status-dot"]')
    expect(dot).toBeInTheDocument()
  })

  it('should use correct font family for logo', () => {
    render(<SidebarHeader />)
    const logo = screen.getByText('AVCD')
    expect(logo.className).toContain('font-sans')
  })

  it('should have correct font weight', () => {
    render(<SidebarHeader />)
    const logo = screen.getByText('AVCD')
    expect(logo.className).toContain('font-medium')
  })
})
