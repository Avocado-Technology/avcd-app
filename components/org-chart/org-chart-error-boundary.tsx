import { Component, ReactNode } from 'react'
import { OrgChartError } from './org-chart-error'

interface OrgChartErrorBoundaryProps {
  children: ReactNode
}

interface OrgChartErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary for org chart components
 * Catches rendering errors and displays a fallback UI
 * instead of crashing the entire application
 */
export class OrgChartErrorBoundary extends Component<
  OrgChartErrorBoundaryProps,
  OrgChartErrorBoundaryState
> {
  constructor(props: OrgChartErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): OrgChartErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error for debugging
    console.error('OrgChart error:', error, errorInfo)
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return <OrgChartError error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}
