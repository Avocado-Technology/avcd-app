import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

// Test component to access theme context
function TestComponent() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  )
}

describe('ThemeProvider Integration', () => {
  beforeEach(() => {
    // Clean up localStorage and DOM before each test
    localStorage.clear()
    document.documentElement.className = ''
    // Mock matchMedia for desktop/light mode by default
    mockMatchMedia('(min-width: 1024px)')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    restoreMatchMedia()
  })

  it('should wrap app content and provide theme context', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(getByTestId('current-theme')).toBeInTheDocument()
  })

  it('should default to system theme', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(getByTestId('current-theme')).toHaveTextContent('system')
  })

  it('should apply .light class to HTML when theme is light', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const lightButton = getByText('Set Light')
    lightButton.click()
    
    // Wait for effect to run
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should apply .dark class to HTML when theme is dark', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const darkButton = getByText('Set Dark')
    darkButton.click()
    
    // Wait for effect to run
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
  })

  it('should apply correct class when theme is system', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const systemButton = getByText('Set System')
    systemButton.click()
    
    // Wait for effect to run
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should apply light since mockMatchMedia is set to light mode
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})
