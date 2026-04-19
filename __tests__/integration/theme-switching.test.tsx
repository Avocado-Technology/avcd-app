import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

// Mock component that uses theme
function ThemedPage() {
  const { theme } = useTheme()
  return (
    <div data-testid="page">
      <p data-testid="current-theme">{theme}</p>
      <div style={{ background: 'var(--bg)', color: 'var(--g900)' }}>
        Themed content
      </div>
    </div>
  )
}

// Mock navigation component
function NavWithTheme() {
  const { setTheme } = useTheme()
  return (
    <nav>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </nav>
  )
}

describe('Theme Switching Integration', () => {
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

  it('should allow user to switch theme from navigation', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <NavWithTheme />
        <ThemedPage />
      </ThemeProvider>
    )
    
    const darkButton = screen.getByText('Dark')
    await user.click(darkButton)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('should persist theme after component remount', async () => {
    const user = userEvent.setup()
    
    // First render and set theme
    const { unmount } = render(
      <ThemeProvider>
        <NavWithTheme />
      </ThemeProvider>
    )
    
    const darkButton = screen.getByText('Dark')
    await user.click(darkButton)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    unmount()
    
    // Re-render (simulates navigation)
    render(
      <ThemeProvider>
        <ThemedPage />
      </ThemeProvider>
    )
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Theme should be loaded from localStorage
    expect(localStorage.getItem('avcd-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should maintain theme preference across multiple components', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <NavWithTheme />
        <ThemedPage />
        <ThemedPage />
      </ThemeProvider>
    )
    
    const darkButton = screen.getByText('Dark')
    await user.click(darkButton)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // All components should see the same theme
    const themeDisplays = screen.getAllByTestId('current-theme')
    themeDisplays.forEach(display => {
      expect(display).toHaveTextContent('dark')
    })
  })

  it('should handle system theme detection', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <NavWithTheme />
        <ThemedPage />
      </ThemeProvider>
    )
    
    const systemButton = screen.getByText('System')
    await user.click(systemButton)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
    // Should apply light since mockMatchMedia returns light mode
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})
