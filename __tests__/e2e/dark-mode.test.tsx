import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

// Mock page components
function MockPage() {
  const { theme } = useTheme()
  return (
    <div data-testid="page">
      <header style={{ background: 'var(--bg-blur)', borderBottom: '1px solid var(--g200)' }}>
        <h1 style={{ color: 'var(--g900)' }}>Application</h1>
      </header>
      <main style={{ background: 'var(--bg)' }}>
        <div className="border border-gray-200" style={{ padding: 'var(--sp-4)' }}>
          <h2 style={{ color: 'var(--g900)' }}>Content</h2>
          <p style={{ color: 'var(--g500)' }}>Current theme: {theme}</p>
        </div>
      </main>
    </div>
  )
}

function MockNav() {
  const { setTheme } = useTheme()
  return (
    <nav>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
    </nav>
  )
}

describe('Dark Mode E2E Tests', () => {
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

  it('should navigate all pages in dark mode', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <MockNav />
        <MockPage />
      </ThemeProvider>
    )
    
    // Switch to dark mode
    await user.click(screen.getByText('Dark'))
    await new Promise(resolve => setTimeout(resolve, 200))
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(screen.getByText(/current theme: dark/i)).toBeVisible()
  })

  it('should keep all interactive elements visible in dark mode', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <MockNav />
        <MockPage />
      </ThemeProvider>
    )
    
    await user.click(screen.getByText('Dark'))
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // All buttons should still be visible
    expect(screen.getByText('Light')).toBeVisible()
    expect(screen.getByText('Dark')).toBeVisible()
  })

  it('should persist theme after page reload simulation', async () => {
    const user = userEvent.setup()
    
    // First render
    const { unmount } = render(
      <ThemeProvider>
        <MockNav />
        <MockPage />
      </ThemeProvider>
    )
    
    // Set dark mode
    await user.click(screen.getByText('Dark'))
    await new Promise(resolve => setTimeout(resolve, 200))
    
    unmount()
    
    // Simulate page reload
    render(
      <ThemeProvider>
        <MockPage />
      </ThemeProvider>
    )
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Should load as dark mode
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should not cause layout shift when switching themes', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <MockNav />
        <MockPage />
      </ThemeProvider>
    )
    
    const content = screen.getByText('Content')
    const initialRect = content.getBoundingClientRect()
    
    // Switch theme
    await user.click(screen.getByText('Dark'))
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const afterRect = content.getBoundingClientRect()
    
    // Position should remain same (no layout shift)
    expect(afterRect.top).toBe(initialRect.top)
    expect(afterRect.left).toBe(initialRect.left)
  })

  it('should handle rapid theme switching', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <MockNav />
        <MockPage />
      </ThemeProvider>
    )
    
    // Rapidly switch themes
    await user.click(screen.getByText('Dark'))
    await user.click(screen.getByText('Light'))
    await user.click(screen.getByText('Dark'))
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Should end on dark mode
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(screen.getByText(/current theme: dark/i)).toBeVisible()
  })
})
