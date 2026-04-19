import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { OrganizationNode } from '@/components/org-chart/nodes/organization-node'
import { StoreNode } from '@/components/org-chart/nodes/store-node'
import { applyElkLayout, transformOrgToNodes, transformOrgToEdges } from '@/components/org-chart/utils/layout-utils'
import { ReactFlowWrapper } from '@/__tests__/utils/reactFlowWrapper'

describe('Organization Chart Layout and Icons', () => {
  describe('Left-to-Right Layout', () => {
    it('should apply RIGHT direction when specified', async () => {
      const mockOrg = {
        id: 'org-1',
        name: 'Test Org',
        stores: [
          {
            id: 'store-1',
            name: 'Store 1',
            location: 'NYC',
            employees: []
          }
        ]
      }
      
      const nodes = transformOrgToNodes(mockOrg)
      const edges = transformOrgToEdges(mockOrg)
      const layoutedNodes = await applyElkLayout(nodes, edges, { direction: 'RIGHT' })
      
      // In RIGHT layout, org node should be leftmost (smallest x)
      const orgNode = layoutedNodes.find(n => n.id === 'org-1')
      const storeNode = layoutedNodes.find(n => n.id === 'store-1')
      
      expect(orgNode).toBeDefined()
      expect(storeNode).toBeDefined()
      expect(orgNode!.position.x).toBeLessThan(storeNode!.position.x)
    })
  })

  describe('Organization Node Icon', () => {
    it('should render with building icon', () => {
      const mockData = {
        id: 'org-1',
        name: 'Test Organization'
      }
      
      render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
      
      // Check for building icon (lucide-react Building2)
      const icon = screen.getByTestId('organization-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should display organization name', () => {
      const mockData = {
        id: 'org-1',
        name: 'Acme Corporation'
      }
      
      render(<OrganizationNode data={mockData} />, { wrapper: ReactFlowWrapper })
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    })
  })

  describe('Store Node Icon', () => {
    it('should render with store icon', () => {
      const mockData = {
        id: 'store-1',
        name: 'Main Store',
        location: 'New York',
        employeeCount: 5
      }
      
      render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
      
      // Check for store icon (lucide-react Store)
      const icon = screen.getByTestId('store-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should display store details', () => {
      const mockData = {
        id: 'store-1',
        name: 'Downtown Store',
        location: 'Manhattan',
        employeeCount: 3
      }
      
      render(<StoreNode data={mockData} />, { wrapper: ReactFlowWrapper })
      expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      expect(screen.getByText('Manhattan')).toBeInTheDocument()
      expect(screen.getByText('3 employees')).toBeInTheDocument()
    })
  })
})
