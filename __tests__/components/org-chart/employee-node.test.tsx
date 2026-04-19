import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { EmployeeNode } from '@/components/org-chart/nodes/employee-node'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('EmployeeNode Component', () => {
  const mockData = {
    id: 'emp-1',
    name: 'John Doe',
    role: 'Manager',
  }

  it('should render employee name', () => {
    render(<EmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should render employee role', () => {
    render(<EmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('should have correct dimensions', () => {
    const { container } = render(<EmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node.style.width).toBe('180px')
  })

  it('should use compact padding', () => {
    const { container } = render(<EmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node).toHaveClass('p-4')
  })

  it('should render avatar placeholder', () => {
    const { container } = render(<EmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const avatar = container.querySelector('[data-testid="employee-avatar"]')
    expect(avatar).toBeInTheDocument()
  })

  it('should display initials in avatar', () => {
    render(<EmployeeNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})
