import { describe, it, expect, beforeAll } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import OrganizationPage from '@/app/org/page'

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
})

// Mock the AnimatedOrgChart component
jest.mock('@/components/org-chart/animated-org-chart', () => ({
  AnimatedOrgChart: ({ data }: any) => (
    <div data-testid="animated-org-chart">
      Animated Chart: {data.name}
    </div>
  ),
}))

describe('Organization Page (Animated)', () => {
  it('should render AnimatedOrgChart component', async () => {
    const page = await OrganizationPage()
    const { container } = render(page)

    expect(screen.getByTestId('animated-org-chart')).toBeInTheDocument()
  })

  it('should maintain proper ARIA roles', async () => {
    const page = await OrganizationPage()
    const { container } = render(page)

    const main = container.querySelector('main')
    expect(main).toHaveAttribute('role', 'main')
    expect(main).toHaveAttribute('aria-label', 'Organization chart page')
  })

  it('should pass mockOrgData to AnimatedOrgChart', async () => {
    const page = await OrganizationPage()
    render(page)

    expect(screen.getByText(/AVCD Corporation/i)).toBeInTheDocument()
  })

  it('should maintain responsive layout', async () => {
    const page = await OrganizationPage()
    const { container } = render(page)

    const main = container.querySelector('main')
    expect(main?.style.flex).toBeTruthy()
    expect(main?.style.display).toBe('flex')
  })
})
