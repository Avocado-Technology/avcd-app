import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { AnimatedOrganizationNode } from '@/components/org-chart/nodes/animated-organization-node'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('AnimatedOrganizationNode Component', () => {
  const mockData = {
    id: 'org-1',
    name: 'AVCD Corporation',
  }

  it('should render with Motion wrapper', () => {
    render(<AnimatedOrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
  })

  it('should not show NEW badge (org node is never new)', () => {
    render(<AnimatedOrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    expect(screen.queryByText('NEW')).not.toBeInTheDocument()
  })

  it('should preserve organization icon', () => {
    const { container } = render(<AnimatedOrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
    const icon = container.querySelector('[data-testid="organization-icon"]')
    expect(icon).toBeInTheDocument()
  })
})
