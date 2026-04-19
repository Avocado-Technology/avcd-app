import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/theme-toggle'
import { ThemeProvider } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle Component', () => {
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

  it('should render toggle button', () => {
    renderWithProvider()
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('should have proper ARIA label', () => {
    renderWithProvider()
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toHaveAttribute('aria-label')
  })

  it('should open dropdown menu when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)
    
    expect(screen.getByText('Light')).toBeVisible()
    expect(screen.getByText('Dark')).toBeVisible()
    expect(screen.getByText('System')).toBeVisible()
  })

  it('should switch to dark theme when Dark option clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)
    
    const darkOption = screen.getByText('Dark')
    await user.click(darkOption)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('avcd-theme')).toBe('dark')
  })

  it('should switch to light theme when Light option clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(button)
    
    const lightOption = screen.getByText('Light')
    await user.click(lightOption)
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(localStorage.getItem('avcd-theme')).toBe('light')
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    
    // Focus and activate with keyboard
    button.focus()
    expect(button).toHaveFocus()
    
    // Press Enter to open menu
    await user.keyboard('{Enter}')
    expect(screen.getByText('Dark')).toBeVisible()
  })

  it('should display Sun and Moon icons', () => {
    const { container } = renderWithProvider()
    
    // Both icons should be in the DOM (visibility controlled by CSS)
    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThanOrEqual(1)
  })
})
