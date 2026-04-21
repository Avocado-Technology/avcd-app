import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function renderWithProvider(
  user: { name?: string | null; email?: string | null; picture?: string | null },
  currentPath: string,
) {
  return render(
    <SidebarProvider>
      <AppSidebar user={user} currentPath={currentPath} />
    </SidebarProvider>
  )
}

describe('AppSidebar Component', () => {
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

  it('should render sidebar header', () => {
    renderWithProvider(mockUser, '/')
    expect(screen.getByText('AVCD')).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    renderWithProvider(mockUser, '/')
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Organization')).toBeInTheDocument()
    expect(screen.getByText('Finance')).toBeInTheDocument()
  })

  it('should render footer with user info', () => {
    renderWithProvider(mockUser, '/')
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render as collapsible sidebar', () => {
    const { container } = renderWithProvider(mockUser, '/')
    const sidebar = container.querySelector('[data-sidebar="sidebar"]')
    expect(sidebar).toBeInTheDocument()
  })
})
