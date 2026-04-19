import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { OrgChartErrorBoundary } from '@/components/org-chart/org-chart-error-boundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('OrgChartErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    // Suppress console.error during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should render children when there is no error', () => {
    render(
      <OrgChartErrorBoundary>
        <div>Test content</div>
      </OrgChartErrorBoundary>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should catch rendering errors', () => {
    render(
      <OrgChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </OrgChartErrorBoundary>
    )
    
    // Should show error UI instead of throwing
    expect(screen.getByText(/Failed to load organization chart/i)).toBeInTheDocument()
  })

  it('should display error fallback UI when error occurs', () => {
    render(
      <OrgChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </OrgChartErrorBoundary>
    )
    
    // Check for error UI elements
    expect(screen.getByText(/Failed to load organization chart/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('should log error to console', () => {
    render(
      <OrgChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </OrgChartErrorBoundary>
    )
    
    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled()
    const errorCalls = consoleErrorSpy.mock.calls.filter(call => 
      call[0]?.includes?.('OrgChart error') || call[0]?.toString?.().includes?.('OrgChart error')
    )
    expect(errorCalls.length).toBeGreaterThan(0)
  })

  it('should reset error state when reset is clicked', () => {
    const { rerender } = render(
      <OrgChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </OrgChartErrorBoundary>
    )
    
    // Error UI should be shown
    expect(screen.getByText(/Failed to load organization chart/i)).toBeInTheDocument()
    
    // Click reset button
    const resetButton = screen.getByRole('button', { name: /try again/i })
    resetButton.click()
    
    // Re-render with no error
    rerender(
      <OrgChartErrorBoundary>
        <ThrowError shouldThrow={false} />
      </OrgChartErrorBoundary>
    )
    
    // Should show content again
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should not propagate error to parent components', () => {
    // Wrap in another try-catch to verify error doesn't escape
    let parentCaughtError = false
    
    try {
      render(
        <div>
          <OrgChartErrorBoundary>
            <ThrowError shouldThrow={true} />
          </OrgChartErrorBoundary>
          <div>Parent content</div>
        </div>
      )
    } catch (e) {
      parentCaughtError = true
    }
    
    expect(parentCaughtError).toBe(false)
    expect(screen.getByText('Parent content')).toBeInTheDocument()
  })

  it('should show error message from caught error', () => {
    render(
      <OrgChartErrorBoundary>
        <ThrowError shouldThrow={true} />
      </OrgChartErrorBoundary>
    )
    
    // Should display the error message
    expect(screen.getByText(/Test error/i)).toBeInTheDocument()
  })

  it('should accept custom key prop for force remount', () => {
    const { rerender } = render(
      <OrgChartErrorBoundary key="key-1">
        <ThrowError shouldThrow={true} />
      </OrgChartErrorBoundary>
    )
    
    // Error should be shown
    expect(screen.getByText(/Failed to load organization chart/i)).toBeInTheDocument()
    
    // Rerender with different key (forces remount and state reset)
    rerender(
      <OrgChartErrorBoundary key="key-2">
        <div>New content</div>
      </OrgChartErrorBoundary>
    )
    
    // Should show new content
    expect(screen.getByText('New content')).toBeInTheDocument()
  })
})
