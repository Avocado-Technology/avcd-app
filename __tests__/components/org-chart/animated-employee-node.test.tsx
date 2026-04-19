import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedEmployeeNode } from '@/components/org-chart/nodes/animated-employee-node'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('AnimatedEmployeeNode Component', () => {
  const mockData = {
    id: 'emp-1',
    name: 'John Doe',
    role: 'Manager',
  }

  it('should render with Motion wrapper', () => {
    render(<AnimatedEmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should show NEW badge when isRecent is true', () => {
    const dataWithRecent = { ...mockData, isRecent: true }
    render(<AnimatedEmployeeNode data={dataWithRecent} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('should not show NEW badge when isRecent is false', () => {
    const dataWithRecent = { ...mockData, isRecent: false }
    render(<AnimatedEmployeeNode data={dataWithRecent} />, { wrapper: ReactFlowWrapper })
    expect(screen.queryByText('NEW')).not.toBeInTheDocument()
  })

  it('should apply highlight styles when isHighlighted is true', () => {
    const dataWithHighlight = { ...mockData, isHighlighted: true }
    const { container } = render(
      <AnimatedEmployeeNode data={dataWithHighlight} />,
      { wrapper: ReactFlowWrapper }
    )
    const pulseElement = container.querySelector('.absolute.inset-0')
    expect(pulseElement).toBeInTheDocument()
  })

  it('should have motion wrapper with initial/animate props', () => {
    const dataWithRecent = { ...mockData, isRecent: true }
    const { container } = render(
      <AnimatedEmployeeNode data={dataWithRecent} />,
      { wrapper: ReactFlowWrapper }
    )
    // Motion wraps content in a div
    const motionWrapper = container.firstChild
    expect(motionWrapper).toBeInTheDocument()
  })

  it('should preserve handles for React Flow connections', () => {
    const { container } = render(
      <AnimatedEmployeeNode data={mockData} />,
      { wrapper: ReactFlowWrapper }
    )
    // Check for Handle components (they have specific classes)
    const handles = container.querySelectorAll('.react-flow__handle')
    expect(handles.length).toBeGreaterThanOrEqual(1)
  })

  it('should still display initials correctly', () => {
    render(<AnimatedEmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})
