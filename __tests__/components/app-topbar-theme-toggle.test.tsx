import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AppTopBar } from '@/app/components/AppTopBar'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

const mockSession = {
  user: {
    name: 'Test User',
    email: 'test@example.com',
    picture: null,
  }
}

function renderWithProviders() {
  return render(
    <ThemeProvider>
      <SidebarProvider>
        <AppTopBar session={mockSession} />
      </SidebarProvider>
    </ThemeProvider>
  )
}

describe('AppTopBar with ThemeToggle', () => {
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

  it('should render theme toggle button in top bar', () => {
    renderWithProviders()
    
    const themeButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(themeButton).toBeInTheDocument()
  })

  it('should render theme toggle next to sign out button', () => {
    const { container } = renderWithProviders()
    
    const signOutLink = screen.getByText('Sign out')
    const themeButton = screen.getByRole('button', { name: /toggle theme/i })
    
    expect(signOutLink).toBeInTheDocument()
    expect(themeButton).toBeInTheDocument()
    
    // Both should be in the same parent container (right side of header)
    const header = container.querySelector('header')
    expect(header).toContainElement(themeButton)
    expect(header).toContainElement(signOutLink)
  })

  it('should have sign out button as last element', () => {
    const { container } = renderWithProviders()
    
    const header = container.querySelector('header')
    const children = Array.from(header?.children || [])
    const lastChild = children[children.length - 1]
    
    // Last child should contain the sign out link
    expect(lastChild?.textContent).toContain('Sign out')
  })
})
