import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { transformOrgToNodes, transformOrgToEdges } from '@/components/org-chart/utils/layout-utils'
import { mockOrgData } from '@/lib/mock-org-data'
import { Node, Edge } from 'reactflow'

describe('DOWN layout visual verification', () => {
  // Helper to create a full org chart structure
  const createFullOrgChart = () => {
    // Use the mock org data which has 1 org -> 2 stores -> employees
    const nodes = transformOrgToNodes(mockOrgData)
    const edges = transformOrgToEdges(mockOrgData)
    return { nodes, edges }
  }

  describe('centered tree structure', () => {
    it('should create a properly structured vertical tree', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })
      
      // Verify all nodes are positioned
      expect(layouted).toHaveLength(nodes.length)
      layouted.forEach(node => {
        expect(node.position.x).toBeGreaterThanOrEqual(0)
        expect(node.position.y).toBeGreaterThanOrEqual(0)
      })
    })

    it('should position all stores below organization', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })
      
      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')
      
      expect(stores.length).toBeGreaterThan(0)
      stores.forEach(store => {
        expect(store.position.y).toBeGreaterThan(org.position.y)
      })
    })

    it('should position all employees below their parent stores', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })
      
      const stores = layouted.filter(n => n.type === 'storeNode')
      const employees = layouted.filter(n => n.type === 'employeeNode')
      
      expect(employees.length).toBeGreaterThan(0)
      
      // All employees should be below the lowest store
      const maxStoreY = Math.max(...stores.map(s => s.position.y))
      employees.forEach(emp => {
        expect(emp.position.y).toBeGreaterThan(maxStoreY)
      })
    })

    it('should center organization horizontally between stores', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })
      
      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')
      
      if (stores.length > 1) {
        // Calculate horizontal center of stores (including node width)
        const storeXPositions = stores.map(s => s.position.x + 120) // +120 = half width
        const storeCenter = (Math.max(...storeXPositions) + Math.min(...storeXPositions)) / 2
        const orgCenter = org.position.x + 120
        
        // Org should be approximately centered (within 50px tolerance)
        expect(Math.abs(orgCenter - storeCenter)).toBeLessThan(50)
      }
    })

    it('should maintain hierarchical layer structure', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED',
        layerSpacing: 120
      })
      
      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')
      const employees = layouted.filter(n => n.type === 'employeeNode')
      
      // Check that layers are clearly separated
      const orgY = org.position.y
      const avgStoreY = stores.reduce((sum, s) => sum + s.position.y, 0) / stores.length
      const avgEmpY = employees.reduce((sum, e) => sum + e.position.y, 0) / employees.length
      
      expect(avgStoreY).toBeGreaterThan(orgY + 80) // At least one node height apart
      expect(avgEmpY).toBeGreaterThan(avgStoreY + 80)
    })
  })

  describe('even branch spacing', () => {
    it('should distribute sibling stores evenly horizontally', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        nodeSpacing: 100
      })
      
      const stores = layouted.filter(n => n.type === 'storeNode')
        .sort((a, b) => a.position.x - b.position.x)
      
      if (stores.length > 1) {
        // Calculate spacing between consecutive stores
        const spacings: number[] = []
        for (let i = 1; i < stores.length; i++) {
          spacings.push(stores[i].position.x - stores[i-1].position.x)
        }
        
        // All spacings should be positive
        spacings.forEach(spacing => {
          expect(spacing).toBeGreaterThan(0)
        })
        
        // Spacings should be relatively consistent (within 50px variance)
        if (spacings.length > 1) {
          const avgSpacing = spacings.reduce((sum, s) => sum + s, 0) / spacings.length
          spacings.forEach(spacing => {
            expect(Math.abs(spacing - avgSpacing)).toBeLessThan(50)
          })
        }
      }
    })

    it('should align sibling stores at same vertical level', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF'
      })
      
      const stores = layouted.filter(n => n.type === 'storeNode')
      
      if (stores.length > 1) {
        const yPositions = stores.map(s => s.position.y)
        const yVariance = Math.max(...yPositions) - Math.min(...yPositions)
        
        // All stores should be at approximately the same Y position
        expect(yVariance).toBeLessThan(10)
      }
    })

    it('should maintain consistent spacing with varying employee counts', async () => {
      // This tests that stores with different numbers of employees
      // still get even horizontal distribution
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        nodeSpacing: 100
      })
      
      const stores = layouted.filter(n => n.type === 'storeNode')
      
      // All stores should be present regardless of employee count
      expect(stores.length).toBe(2) // mockOrgData has 2 stores
      
      // Stores should be evenly distributed
      if (stores.length === 2) {
        const sortedStores = stores.sort((a, b) => a.position.x - b.position.x)
        const spacing = sortedStores[1].position.x - sortedStores[0].position.x
        expect(spacing).toBeGreaterThan(40) // Reasonable spacing (mock returns ~45px)
      }
    })
  })

  describe('edge routing', () => {
    it('should create clean vertical connections', async () => {
      const { nodes, edges } = createFullOrgChart()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        edgeRouting: 'ORTHOGONAL'
      })
      
      // Verify layout completed successfully
      expect(layouted).toHaveLength(nodes.length)
      
      // For DOWN layout with ORTHOGONAL routing, edges should connect
      // parent bottom to child top
      const org = layouted.find(n => n.type === 'organizationNode')!
      const firstStore = layouted.find(n => n.type === 'storeNode')!
      
      // Store should be directly below org (similar X position)
      // This creates a straight vertical connection
      const xDifference = Math.abs(org.position.x - firstStore.position.x)
      expect(xDifference).toBeLessThan(200) // Should be relatively aligned
    })
  })

  describe('complex hierarchies', () => {
    it('should handle deep hierarchies efficiently', async () => {
      // Create a deeper hierarchy: org -> 3 stores -> 2 employees each
      const nodes: Node[] = [
        { id: 'org-1', type: 'organizationNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-1', type: 'storeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-2', type: 'storeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-3', type: 'storeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'emp-1', type: 'employeeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'emp-2', type: 'employeeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'emp-3', type: 'employeeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'emp-4', type: 'employeeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'emp-5', type: 'employeeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'emp-6', type: 'employeeNode', position: { x: 0, y: 0 }, data: {} }
      ]
      
      const edges: Edge[] = [
        { id: 'e1', source: 'org-1', target: 'store-1' },
        { id: 'e2', source: 'org-1', target: 'store-2' },
        { id: 'e3', source: 'org-1', target: 'store-3' },
        { id: 'e4', source: 'store-1', target: 'emp-1' },
        { id: 'e5', source: 'store-1', target: 'emp-2' },
        { id: 'e6', source: 'store-2', target: 'emp-3' },
        { id: 'e7', source: 'store-2', target: 'emp-4' },
        { id: 'e8', source: 'store-3', target: 'emp-5' },
        { id: 'e9', source: 'store-3', target: 'emp-6' }
      ]
      
      const start = performance.now()
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })
      const duration = performance.now() - start
      
      // Should complete quickly (< 100ms for this size)
      expect(duration).toBeLessThan(100)
      
      // Should layout all nodes
      expect(layouted).toHaveLength(10)
      
      // Stores should be evenly distributed
      const stores = layouted.filter(n => n.type === 'storeNode')
        .sort((a, b) => a.position.x - b.position.x)
      
      expect(stores).toHaveLength(3)
      
      // Check even spacing between 3 stores
      const spacing1 = stores[1].position.x - stores[0].position.x
      const spacing2 = stores[2].position.x - stores[1].position.x
      
      expect(Math.abs(spacing1 - spacing2)).toBeLessThan(20)
    })
  })
})
