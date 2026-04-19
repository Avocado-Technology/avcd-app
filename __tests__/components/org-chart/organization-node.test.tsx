import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { OrganizationNode } from '@/components/org-chart/nodes/organization-node'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('OrganizationNode Component', () => {
  const mockData = {
    id: 'org-1',
    name: 'AVCD Corporation',
  }

  it('should render organization name', () => {
    render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
  })

  it('should have card styling', () => {
    const { container } = render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node).toHaveClass('border-gray-200')
    expect(node).toHaveClass('rounded-xl')
  })

  it('should have correct dimensions', () => {
    const { container } = render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node.style.width).toBe('280px')
  })

  it('should use correct font weight for name', () => {
    render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const name = screen.getByText('AVCD Corporation')
    expect(name.className).toContain('font-semibold')
  })

  it('should have hover effect class', () => {
    const { container } = render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const node = container.firstChild as HTMLElement
    expect(node.className).toContain('hover:border-gray-400')
  })
})
