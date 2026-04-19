import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import { AnimatedOrgChart } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

// Mock motion/react to avoid flaky animation tests
jest.mock('motion/react')

describe('Org Chart Workflow Integration Tests', () => {
  describe('Full Load Workflow', () => {
    it('should load and render complete org chart', async () => {
      render(<AnimatedOrgChart data={mockOrgData} />, { wrapper: ReactFlowWrapper })

      // Wait for ReactFlow to render
      await waitFor(() => {
        // Organization should be rendered
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Stores should be rendered
      expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      expect(screen.getByText('Uptown Store')).toBeInTheDocument()

      // Employees should be rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument()
    })

    it('should render with correct node types', async () => {
      const { container } = render(<AnimatedOrgChart data={mockOrgData} />, { wrapper: ReactFlowWrapper })

      await waitFor(() => {
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Check for org icon
      const orgIcon = container.querySelector('[data-testid="organization-icon"]')
      expect(orgIcon).toBeInTheDocument()

      // Check for store icons
      const storeIcons = container.querySelectorAll('[data-testid="store-icon"]')
      expect(storeIcons.length).toBeGreaterThan(0)

      // Check for employee avatars
      const employeeAvatars = container.querySelectorAll('[data-testid="employee-avatar"]')
      expect(employeeAvatars.length).toBeGreaterThan(0)
    })
  })

  describe('Data Update Workflow', () => {
    it('should update when data changes', async () => {
      const { rerender } = render(
        <AnimatedOrgChart data={mockOrgData} />,
        { wrapper: ReactFlowWrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Update with new data
      const updatedData = {
        ...mockOrgData,
        name: 'Updated Corporation',
      }

      rerender(<AnimatedOrgChart data={updatedData} />)

      await waitFor(() => {
        expect(screen.getByText('Updated Corporation')).toBeInTheDocument()
      })
    })

    it('should handle adding new employees', async () => {
      const { rerender } = render(
        <AnimatedOrgChart data={mockOrgData} />,
        { wrapper: ReactFlowWrapper }
      )

      await waitFor(() => {
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Add new employee
      const updatedData = {
        ...mockOrgData,
        stores: [
          {
            ...mockOrgData.stores[0],
            employees: [
              ...mockOrgData.stores[0].employees,
              {
                id: 'emp-new',
                name: 'New Employee',
                role: 'Trainee',
                email: 'new@avcd.com',
              },
            ],
          },
          ...mockOrgData.stores.slice(1),
        ],
      }

      rerender(<AnimatedOrgChart data={updatedData} />)

      await waitFor(() => {
        expect(screen.getByText('New Employee')).toBeInTheDocument()
      })
    })
  })

  describe('Empty State Handling', () => {
    it('should show empty state when no stores', () => {
      const emptyData = {
        id: 'org-1',
        name: 'Empty Org',
        stores: [],
      }

      render(<AnimatedOrgChart data={emptyData} />, { wrapper: ReactFlowWrapper })

      expect(screen.getByText(/No organization data/i)).toBeInTheDocument()
    })
  })

  describe('ReactFlow Integration', () => {
    it('should render with ReactFlow wrapper', async () => {
      const { container } = render(<AnimatedOrgChart data={mockOrgData} />, { wrapper: ReactFlowWrapper })

      await waitFor(() => {
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Chart should be in an application role container
      const chartApp = screen.getByRole('application')
      expect(chartApp).toBeInTheDocument()
    })

    it('should handle node rendering', async () => {
      const { container } = render(<AnimatedOrgChart data={mockOrgData} />, { wrapper: ReactFlowWrapper })

      await waitFor(() => {
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Verify multiple nodes are rendered
      expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(<AnimatedOrgChart data={mockOrgData} />, { wrapper: ReactFlowWrapper })

      await waitFor(() => {
        const chartApp = screen.getByRole('application', { name: /Interactive animated organization chart/i })
        expect(chartApp).toBeInTheDocument()
      })

      // Verify application role is present
      expect(screen.getByRole('application')).toBeInTheDocument()
    })

    it('should have proper test IDs for key elements', async () => {
      const { container } = render(<AnimatedOrgChart data={mockOrgData} />, { wrapper: ReactFlowWrapper })

      await waitFor(() => {
        expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
      })

      // Organization icon
      expect(container.querySelector('[data-testid="organization-icon"]')).toBeInTheDocument()

      // Store icons
      expect(container.querySelectorAll('[data-testid="store-icon"]').length).toBeGreaterThan(0)

      // Employee avatars
      expect(container.querySelectorAll('[data-testid="employee-avatar"]').length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('should render large org chart without crashing', async () => {
      // Create a larger org structure
      const largeOrg = {
        id: 'org-1',
        name: 'Large Corporation',
        stores: Array.from({ length: 10 }, (_, i) => ({
          id: `store-${i}`,
          name: `Store ${i}`,
          location: `Location ${i}`,
          employees: Array.from({ length: 5 }, (_, j) => ({
            id: `emp-${i}-${j}`,
            name: `Employee ${i}-${j}`,
            role: 'Worker',
            email: `emp${i}${j}@corp.com`,
          })),
        })),
      }

      render(<AnimatedOrgChart data={largeOrg} />, { wrapper: ReactFlowWrapper })

      await waitFor(() => {
        expect(screen.getByText('Large Corporation')).toBeInTheDocument()
      })

      // Should have rendered all stores and employees
      expect(screen.getByText('Store 0')).toBeInTheDocument()
      expect(screen.getByText('Store 9')).toBeInTheDocument()
    })
  })
})
