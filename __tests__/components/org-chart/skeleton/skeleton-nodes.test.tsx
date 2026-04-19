/**
 * Unit tests for skeleton node components
 * 
 * Tests dimensions, colors, structure, and accessibility
 */

import { render } from '@testing-library/react'
import {
  OrganizationNodeSkeleton,
  StoreNodeSkeleton,
  EmployeeNodeSkeleton,
} from '@/components/org-chart/skeleton/skeleton-nodes'

describe('Skeleton Node Components', () => {
  describe('OrganizationNodeSkeleton', () => {
    it('should render with correct dimensions', () => {
      const { container } = render(<OrganizationNodeSkeleton />)
      const node = container.firstChild as HTMLElement

      expect(node).toBeInTheDocument()
      expect(node).toHaveStyle({ width: '280px', minHeight: '80px' })
    })

    it('should use design system tokens', () => {
      const { container } = render(<OrganizationNodeSkeleton />)
      const node = container.firstChild as HTMLElement

      expect(node).toHaveStyle({
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
        padding: 'var(--sp-6)',
      })
    })

    it('should render icon and name skeleton elements', () => {
      const { container } = render(<OrganizationNodeSkeleton />)
      
      // Icon skeleton (40px)
      const iconSkeleton = container.querySelector('[style*="width: 40px"]')
      expect(iconSkeleton).toBeInTheDocument()
      expect(iconSkeleton).toHaveStyle({ background: 'var(--g300)' })
      
      // Name skeleton
      const nameSkeleton = container.querySelector('.h-6')
      expect(nameSkeleton).toBeInTheDocument()
    })

    it('should have rounded-xl styling', () => {
      const { container } = render(<OrganizationNodeSkeleton />)
      const node = container.firstChild as HTMLElement
      
      expect(node).toHaveClass('rounded-xl')
    })
  })

  describe('StoreNodeSkeleton', () => {
    it('should render with correct dimensions', () => {
      const { container } = render(<StoreNodeSkeleton />)
      const node = container.firstChild as HTMLElement

      expect(node).toBeInTheDocument()
      expect(node).toHaveStyle({ width: '220px', minHeight: '70px' })
    })

    it('should use design system tokens', () => {
      const { container } = render(<StoreNodeSkeleton />)
      const node = container.firstChild as HTMLElement

      expect(node).toHaveStyle({
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
        padding: 'var(--sp-5)',
      })
    })

    it('should render icon, name, location, and count skeleton elements', () => {
      const { container } = render(<StoreNodeSkeleton />)
      
      // Icon skeleton (28px)
      const iconSkeleton = container.querySelector('[style*="width: 28px"]')
      expect(iconSkeleton).toBeInTheDocument()
      expect(iconSkeleton).toHaveStyle({ background: 'var(--g300)' })
      
      // Name, location, and count skeletons
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThanOrEqual(3) // name, location, count
    })

    it('should have flex-col layout', () => {
      const { container } = render(<StoreNodeSkeleton />)
      const contentContainer = container.querySelector('.flex.flex-col')
      
      expect(contentContainer).toBeInTheDocument()
    })
  })

  describe('EmployeeNodeSkeleton', () => {
    it('should render with correct dimensions', () => {
      const { container } = render(<EmployeeNodeSkeleton />)
      const node = container.firstChild as HTMLElement

      expect(node).toBeInTheDocument()
      expect(node).toHaveStyle({ width: '180px', minHeight: '60px' })
    })

    it('should use design system tokens', () => {
      const { container } = render(<EmployeeNodeSkeleton />)
      const node = container.firstChild as HTMLElement

      expect(node).toHaveStyle({
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
        padding: 'var(--sp-4)',
      })
    })

    it('should render avatar and content skeleton elements', () => {
      const { container } = render(<EmployeeNodeSkeleton />)
      
      // Avatar skeleton (32px circle)
      const avatarSkeleton = container.querySelector('[style*="width: 32px"]')
      expect(avatarSkeleton).toBeInTheDocument()
      expect(avatarSkeleton).toHaveClass('rounded-full')
      expect(avatarSkeleton).toHaveStyle({ background: 'var(--g300)' })
      
      // Name and role skeletons
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThanOrEqual(2) // name, role
    })

    it('should have items-center layout', () => {
      const { container } = render(<EmployeeNodeSkeleton />)
      const contentContainer = container.querySelector('.flex.items-center')
      
      expect(contentContainer).toBeInTheDocument()
    })
  })

  describe('Animation and Accessibility', () => {
    it('should have pulse animation on skeleton elements', () => {
      const { container } = render(<OrganizationNodeSkeleton />)
      const skeleton = container.querySelector('.animate-pulse')
      
      expect(skeleton).toBeInTheDocument()
    })

    it('should use consistent color scheme across all nodes', () => {
      const { container: orgContainer } = render(<OrganizationNodeSkeleton />)
      const { container: storeContainer } = render(<StoreNodeSkeleton />)
      const { container: empContainer } = render(<EmployeeNodeSkeleton />)
      
      // All nodes should use --g300 for skeleton elements
      const orgIcon = orgContainer.querySelector('[style*="var(--g300)"]')
      const storeIcon = storeContainer.querySelector('[style*="var(--g300)"]')
      const empAvatar = empContainer.querySelector('[style*="var(--g300)"]')
      
      expect(orgIcon).toBeInTheDocument()
      expect(storeIcon).toBeInTheDocument()
      expect(empAvatar).toBeInTheDocument()
    })
  })
})
