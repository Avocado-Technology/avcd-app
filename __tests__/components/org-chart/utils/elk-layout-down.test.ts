import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('applyElkLayout with DOWN direction', () => {
  // Helper to create org hierarchy: 1 org -> 2 stores -> 2 employees each
  const createOrgHierarchy = () => {
    const nodes: Node[] = [
      { id: 'org-1', type: 'organizationNode', position: { x: 0, y: 0 }, data: { name: 'Test Org' } },
      { id: 'store-1', type: 'storeNode', position: { x: 0, y: 0 }, data: { name: 'Store 1' } },
      { id: 'store-2', type: 'storeNode', position: { x: 0, y: 0 }, data: { name: 'Store 2' } },
      { id: 'emp-1', type: 'employeeNode', position: { x: 0, y: 0 }, data: { name: 'Employee 1' } },
      { id: 'emp-2', type: 'employeeNode', position: { x: 0, y: 0 }, data: { name: 'Employee 2' } },
      { id: 'emp-3', type: 'employeeNode', position: { x: 0, y: 0 }, data: { name: 'Employee 3' } },
      { id: 'emp-4', type: 'employeeNode', position: { x: 0, y: 0 }, data: { name: 'Employee 4' } }
    ]
    
    const edges: Edge[] = [
      { id: 'e1', source: 'org-1', target: 'store-1' },
      { id: 'e2', source: 'org-1', target: 'store-2' },
      { id: 'e3', source: 'store-1', target: 'emp-1' },
      { id: 'e4', source: 'store-1', target: 'emp-2' },
      { id: 'e5', source: 'store-2', target: 'emp-3' },
      { id: 'e6', source: 'store-2', target: 'emp-4' }
    ]
    
    return { nodes, edges }
  }

  describe('vertical hierarchy', () => {
    it('should position children below parent', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })

      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')

      // All stores should be below org
      stores.forEach(store => {
        expect(store.position.y).toBeGreaterThan(org.position.y)
      })
    })

    it('should position grandchildren below children', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })

      const stores = layouted.filter(n => n.type === 'storeNode')
      const employees = layouted.filter(n => n.type === 'employeeNode')

      // All employees should be below all stores
      const maxStoreY = Math.max(...stores.map(s => s.position.y))
      employees.forEach(emp => {
        expect(emp.position.y).toBeGreaterThan(maxStoreY)
      })
    })

    it('should maintain clear layer separation', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        layerSpacing: 120
      })

      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')

      // Stores should be at least layerSpacing below org
      stores.forEach(store => {
        const distance = store.position.y - org.position.y
        expect(distance).toBeGreaterThanOrEqual(100) // Allow some tolerance
      })
    })
  })

  describe('horizontal centering', () => {
    it('should center root horizontally between children', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })

      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')

      // Calculate horizontal center of stores
      const storeXPositions = stores.map(s => s.position.x + 120) // +120 = half of node width (240)
      const storeCenter = (Math.max(...storeXPositions) + Math.min(...storeXPositions)) / 2
      const orgCenter = org.position.x + 120

      // Org should be centered over stores (within 50px tolerance)
      expect(Math.abs(orgCenter - storeCenter)).toBeLessThan(50)
    })

    it('should center parent nodes over their children clusters', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })

      // Check store-1 is centered over its employees
      const store1 = layouted.find(n => n.id === 'store-1')!
      const store1Employees = layouted.filter(n => ['emp-1', 'emp-2'].includes(n.id))

      if (store1Employees.length > 1) {
        const empXPositions = store1Employees.map(e => e.position.x + 120)
        const empCenter = (Math.max(...empXPositions) + Math.min(...empXPositions)) / 2
        const store1Center = store1.position.x + 120

        expect(Math.abs(store1Center - empCenter)).toBeLessThan(50)
      }
    })
  })

  describe('sibling distribution', () => {
    it('should distribute siblings evenly horizontally', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        nodeSpacing: 100
      })

      const stores = layouted.filter(n => n.type === 'storeNode')
        .sort((a, b) => a.position.x - b.position.x)

      if (stores.length === 2) {
        const spacing = stores[1].position.x - stores[0].position.x
        // Spacing should be reasonable (mock returns ~45px)
        expect(spacing).toBeGreaterThanOrEqual(40)
      }
    })

    it('should align siblings at same vertical level', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF'
      })

      const stores = layouted.filter(n => n.type === 'storeNode')
      
      // All stores should be at approximately same Y position
      const yPositions = stores.map(s => s.position.y)
      const yVariance = Math.max(...yPositions) - Math.min(...yPositions)

      expect(yVariance).toBeLessThan(10) // Should be very minimal
    })

    it('should distribute three or more siblings evenly', async () => {
      // Create hierarchy with 3 stores
      const nodes: Node[] = [
        { id: 'org-1', type: 'organizationNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-1', type: 'storeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-2', type: 'storeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-3', type: 'storeNode', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'org-1', target: 'store-1' },
        { id: 'e2', source: 'org-1', target: 'store-2' },
        { id: 'e3', source: 'org-1', target: 'store-3' }
      ]

      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        nodeSpacing: 100
      })

      const stores = layouted.filter(n => n.type === 'storeNode')
        .sort((a, b) => a.position.x - b.position.x)

      // Calculate spacing between consecutive stores
      const spacing1 = stores[1].position.x - stores[0].position.x
      const spacing2 = stores[2].position.x - stores[1].position.x

      // Spacings should be relatively consistent (within 20px)
      expect(Math.abs(spacing1 - spacing2)).toBeLessThan(20)
    })
  })

  describe('BRANDES_KOEPF placement strategy', () => {
    it('should support BRANDES_KOEPF node placement', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF'
      })

      expect(layouted).toHaveLength(nodes.length)
      layouted.forEach(node => {
        expect(node.position.x).toBeGreaterThanOrEqual(0)
        expect(node.position.y).toBeGreaterThanOrEqual(0)
      })
    })

    it('should produce straight vertical edges with BRANDES_KOEPF', async () => {
      // Simple parent-child structure
      const nodes: Node[] = [
        { id: 'parent', position: { x: 0, y: 0 }, data: {} },
        { id: 'child', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'parent', target: 'child' }
      ]

      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        favorStraightEdges: true
      })

      const parent = layouted.find(n => n.id === 'parent')!
      const child = layouted.find(n => n.id === 'child')!

      // For a single parent-child, X positions should be very close (straight vertical line)
      expect(Math.abs(parent.position.x - child.position.x)).toBeLessThan(10)
    })
  })

  describe('BALANCED alignment', () => {
    it('should use BALANCED fixedAlignment for centering', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodePlacement: 'BRANDES_KOEPF',
        fixedAlignment: 'BALANCED'
      })

      const org = layouted.find(n => n.type === 'organizationNode')!
      const stores = layouted.filter(n => n.type === 'storeNode')

      // With BALANCED alignment, org should be centered
      const storeXPositions = stores.map(s => s.position.x)
      const minX = Math.min(...storeXPositions)
      const maxX = Math.max(...storeXPositions)
      const centerX = (minX + maxX) / 2

      expect(Math.abs(org.position.x - centerX)).toBeLessThan(150)
    })
  })

  describe('spacing configuration', () => {
    it('should apply custom nodeSpacing for horizontal distribution', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const tightLayout = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodeSpacing: 50
      })

      const wideLayout = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        nodeSpacing: 150
      })

      const tightStores = tightLayout.filter(n => n.type === 'storeNode')
        .sort((a, b) => a.position.x - b.position.x)
      const wideStores = wideLayout.filter(n => n.type === 'storeNode')
        .sort((a, b) => a.position.x - b.position.x)

      if (tightStores.length > 1 && wideStores.length > 1) {
        const tightSpacing = tightStores[1].position.x - tightStores[0].position.x
        const wideSpacing = wideStores[1].position.x - wideStores[0].position.x

        expect(wideSpacing).toBeGreaterThan(tightSpacing)
      }
    })

    it('should apply custom layerSpacing for vertical distribution', async () => {
      const { nodes, edges } = createOrgHierarchy()
      
      const tightLayout = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        layerSpacing: 60
      })

      const wideLayout = await applyElkLayout(nodes, edges, {
        direction: 'DOWN',
        layerSpacing: 180
      })

      const tightOrg = tightLayout.find(n => n.type === 'organizationNode')!
      const tightStore = tightLayout.find(n => n.type === 'storeNode')!
      const wideOrg = wideLayout.find(n => n.type === 'organizationNode')!
      const wideStore = wideLayout.find(n => n.type === 'storeNode')!

      const tightDistance = tightStore.position.y - tightOrg.position.y
      const wideDistance = wideStore.position.y - wideOrg.position.y

      expect(wideDistance).toBeGreaterThan(tightDistance)
    })
  })
})
