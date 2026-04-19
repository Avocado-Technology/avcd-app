import { describe, it, expect, beforeAll } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { OrgPageWithData } from '@/app/org/org-page-with-data'

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
})

// Mock the useOrganizationTree hook
jest.mock('@/lib/hooks/use-organization-tree', () => ({
  useOrganizationTree: jest.fn(() => ({
    data: [{
      id: 'org-1',
      name: 'AVCD Corporation',
      stores: [],
    }],
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}))

// Mock the AnimatedOrgChart component
jest.mock('@/components/org-chart/animated-org-chart', () => ({
  AnimatedOrgChart: ({ data }: { data: { name: string } }) => (
    <div data-testid="animated-org-chart">
      Animated Chart: {data.name}
    </div>
  ),
}))

describe('Organization Page (Animated)', () => {
  it('should render AnimatedOrgChart component', () => {
    const { container } = render(<OrgPageWithData />)

    expect(screen.getByTestId('animated-org-chart')).toBeInTheDocument()
  })

  it('should maintain proper ARIA roles', () => {
    render(<OrgPageWithData />)

    const main = document.querySelector('main')
    expect(main).toHaveAttribute('role', 'main')
    expect(main).toHaveAttribute('aria-label', 'Organization chart page')
  })

  it('should pass mockOrgData to AnimatedOrgChart', () => {
    render(<OrgPageWithData />)

    expect(screen.getByText(/AVCD Corporation/i)).toBeInTheDocument()
  })

  it("should maintain responsive layout on main", () => {
    const { container } = render(<OrgPageWithData />)

    const main = container.querySelector("main")
    const cls = main?.getAttribute("class") || ""
    expect(cls).toMatch(/flex/)
    expect(cls).toMatch(/flex-col/)
    expect(cls).toMatch(/flex-1/)
  })
})
