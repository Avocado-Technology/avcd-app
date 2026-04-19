import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { SidebarNav } from '@/components/sidebar/sidebar-nav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function renderWithProvider(currentPath: string) {
  return render(
    <SidebarProvider>
      <SidebarNav currentPath={currentPath} />
    </SidebarProvider>
  )
}

describe('SidebarNav Component', () => {
  beforeEach(() => {
    mockMatchMedia('(min-width: 1024px)') // Desktop mode for tests
  })

  afterEach(() => {
    restoreMatchMedia()
  })
  it('should render MCP Setup link', () => {
    renderWithProvider("/")
    expect(screen.getByText('MCP Setup')).toBeInTheDocument()
  })

  it('should render Organization link', () => {
    renderWithProvider("/")
    expect(screen.getByText('Organization')).toBeInTheDocument()
  })

  it('should mark MCP Setup as active on home path', () => {
    renderWithProvider("/")
    const mcpLink = screen.getByText('MCP Setup').closest('a')
    expect(mcpLink?.className).toContain('bg-gray-100')
  })

  it('should mark Organization as active on /org path', () => {
    renderWithProvider("/org")
    const orgLink = screen.getByText('Organization').closest('a')
    expect(orgLink?.className).toContain('bg-gray-100')
  })

  it('should have correct link hrefs', () => {
    renderWithProvider("/")
    const mcpLink = screen.getByText('MCP Setup').closest('a')
    const orgLink = screen.getByText('Organization').closest('a')
    expect(mcpLink).toHaveAttribute('href', '/')
    expect(orgLink).toHaveAttribute('href', '/org')
  })
})
