import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from '@/components/mobile-nav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function renderWithProvider(user: any, currentPath: string) {
  return render(
    <SidebarProvider>
      <MobileNav user={user} currentPath={currentPath} />
    </SidebarProvider>
  )
}

describe('MobileNav Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    picture: null,
  }

  beforeEach(() => {
    mockMatchMedia('(max-width: 767px)')
  })

  afterEach(() => {
    restoreMatchMedia()
  })

  it('should render hamburger menu button', () => {
    renderWithProvider(mockUser, '/')
    const button = screen.getByLabelText(/open navigation menu/i)
    expect(button).toBeInTheDocument()
  })

  it('should have touch-friendly button size (48x48px)', () => {
    renderWithProvider(mockUser, '/')
    const button = screen.getByLabelText(/open navigation menu/i)
    expect(button).toHaveClass('h-12')
    expect(button).toHaveClass('w-12')
  })

  it('should open drawer when hamburger is clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider(mockUser, '/')
    
    const button = screen.getByLabelText(/open navigation menu/i)
    await user.click(button)
    
    expect(screen.getByText('MCP Setup')).toBeVisible()
    expect(screen.getByText('Organization')).toBeVisible()
  })

  it('should render full navigation in drawer', async () => {
    const user = userEvent.setup()
    renderWithProvider(mockUser, '/')
    
    const button = screen.getByLabelText(/open navigation menu/i)
    await user.click(button)
    
    expect(screen.getByText('AVCD')).toBeVisible()
    expect(screen.getByText('John Doe')).toBeVisible()
  })
})
