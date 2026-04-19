import { describe, it, expect, beforeEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

function TestComponent() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    mockMatchMedia('(prefers-color-scheme: light)')
  })

  afterEach(() => {
    restoreMatchMedia()
  })

  it('should provide theme context', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('system')
  })

  it('should toggle between light and dark themes', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    await user.click(screen.getByText('Dark'))
    expect(document.documentElement).toHaveClass('dark')
    
    await user.click(screen.getByText('Light'))
    expect(document.documentElement).toHaveClass('light')
  })
})
