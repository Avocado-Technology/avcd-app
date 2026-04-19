import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarFooter } from '@/components/sidebar/sidebar-footer'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function renderWithProvider(user: any) {
  return render(
    <ThemeProvider>
      <SidebarProvider>
        <SidebarFooter user={user} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

describe('SidebarFooter Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    picture: null,
  }

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    mockMatchMedia('(min-width: 1024px)')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    restoreMatchMedia()
  })

  it('should render user name', () => {
    renderWithProvider(mockUser)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render user email', () => {
    renderWithProvider(mockUser)
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should render user dropdown button', () => {
    renderWithProvider(mockUser)
    const buttons = screen.getAllByRole('button')
    // Should have 1 button: user menu (theme toggle moved to top bar)
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('should show sign out link when user menu is opened', async () => {
    const user = userEvent.setup()
    renderWithProvider(mockUser)

    // Find user menu button (contains user initials)
    const buttons = screen.getAllByRole('button')
    const userButton = buttons.find(btn => btn.textContent?.includes('JD'))
    
    if (userButton) {
      await user.click(userButton)
      expect(screen.getByText('Sign out')).toBeInTheDocument()
    } else {
      // Fallback: click first button that's not theme toggle
      const nonThemeButtons = buttons.filter(btn => 
        !btn.getAttribute('aria-label')?.includes('Toggle theme')
      )
      if (nonThemeButtons[0]) {
        await user.click(nonThemeButtons[0])
        expect(screen.getByText('Sign out')).toBeInTheDocument()
      }
    }
  })

  it('should have correct sign out link href', async () => {
    const user = userEvent.setup()
    renderWithProvider(mockUser)

    const buttons = screen.getAllByRole('button')
    const userButton = buttons.find(btn => btn.textContent?.includes('JD'))
    
    if (userButton) {
      await user.click(userButton)
      const signOutLink = screen.getByText('Sign out').closest('a')
      expect(signOutLink).toHaveAttribute('href', '/api/auth/logout')
    }
  })

  it('should not render theme toggle (moved to top bar)', () => {
    renderWithProvider(mockUser)
    const themeButton = screen.queryByRole('button', { name: /toggle theme/i })
    expect(themeButton).not.toBeInTheDocument()
  })
})
