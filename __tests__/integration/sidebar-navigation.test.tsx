import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function renderWithProvider(user: any, currentPath: string) {
  return render(
    <SidebarProvider>
      <AppSidebar user={user} currentPath={currentPath} />
    </SidebarProvider>
  )
}

describe('Sidebar Navigation Flow', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    picture: null,
  }

  beforeEach(() => {
    mockMatchMedia('(min-width: 1024px)')
  })

  afterEach(() => {
    restoreMatchMedia()
  })

  it('should navigate from MCP Setup to Organization', () => {
    renderWithProvider(mockUser, '/')

    const orgLink = screen.getByText('Organization').closest('a')
    expect(orgLink).toHaveAttribute('href', '/org')
  })

  it('should show active state on current page', () => {
    renderWithProvider(mockUser, '/org')

    const orgLink = screen.getByText('Organization').closest('a')
    expect(orgLink?.className).toContain('bg-gray-100')
  })

  it('should show all navigation sections', () => {
    renderWithProvider(mockUser, '/')

    // Header
    expect(screen.getByText('AVCD')).toBeInTheDocument()
    
    // Navigation items
    expect(screen.getByText('MCP Setup')).toBeInTheDocument()
    expect(screen.getByText('Organization')).toBeInTheDocument()
    
    // Footer
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should render both navigation items as links', () => {
    renderWithProvider(mockUser, '/')

    const mcpLink = screen.getByText('MCP Setup').closest('a')
    const orgLink = screen.getByText('Organization').closest('a')

    expect(mcpLink).toHaveAttribute('href', '/')
    expect(orgLink).toHaveAttribute('href', '/org')
  })
})
