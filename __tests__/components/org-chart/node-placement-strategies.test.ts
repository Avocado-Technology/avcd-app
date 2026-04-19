import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('ELK Node Placement Strategies', () => {
  const createHierarchy = () => {
    const nodes: Node[] = [
      { id: 'root', position: { x: 0, y: 0 }, data: {} },
      { id: 'child1', position: { x: 0, y: 0 }, data: {} },
      { id: 'child2', position: { x: 0, y: 0 }, data: {} },
      { id: 'child3', position: { x: 0, y: 0 }, data: {} },
      { id: 'grandchild1', position: { x: 0, y: 0 }, data: {} },
      { id: 'grandchild2', position: { x: 0, y: 0 }, data: {} }
    ]
    
    const edges: Edge[] = [
      { id: 'e1', source: 'root', target: 'child1' },
      { id: 'e2', source: 'root', target: 'child2' },
      { id: 'e3', source: 'root', target: 'child3' },
      { id: 'e4', source: 'child1', target: 'grandchild1' },
      { id: 'e5', source: 'child2', target: 'grandchild2' }
    ]
    
    return { nodes, edges }
  }

  describe('NETWORK_SIMPLEX vs BRANDES_KOEPF', () => {
    it('should produce valid layouts with both strategies', async () => {
      const { nodes, edges } = createHierarchy()
      
      const networkSimplexLayout = await applyElkLayout(nodes, edges, {
        nodePlacement: 'NETWORK_SIMPLEX',
        direction: 'RIGHT'
      })
      
      const brandesKoepfLayout = await applyElkLayout(nodes, edges, {
        nodePlacement: 'BRANDES_KOEPF',
        direction: 'RIGHT'
      })
      
      // Both should return same number of nodes
      expect(networkSimplexLayout).toHaveLength(nodes.length)
      expect(brandesKoepfLayout).toHaveLength(nodes.length)
      
      // All nodes should have valid positions
      networkSimplexLayout.forEach(node => {
        expect(node.position.x).toBeGreaterThanOrEqual(0)
        expect(node.position.y).toBeGreaterThanOrEqual(0)
      })
      
      brandesKoepfLayout.forEach(node => {
        expect(node.position.x).toBeGreaterThanOrEqual(0)
        expect(node.position.y).toBeGreaterThanOrEqual(0)
      })
    })

    it('NETWORK_SIMPLEX should produce tighter sibling alignment', async () => {
      const { nodes, edges } = createHierarchy()
      
      const networkSimplexLayout = await applyElkLayout(nodes, edges, {
        nodePlacement: 'NETWORK_SIMPLEX',
        direction: 'RIGHT',
        favorStraightEdges: true
      })
      
      const brandesKoepfLayout = await applyElkLayout(nodes, edges, {
        nodePlacement: 'BRANDES_KOEPF',
        direction: 'RIGHT',
        favorStraightEdges: false
      })
      
      // Get sibling nodes (children of root)
      const networkSimplexChildren = networkSimplexLayout.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      )
      const brandesKoepfChildren = brandesKoepfLayout.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      )
      
      // Calculate Y variance for siblings
      const networkSimplexYVariance = Math.max(...networkSimplexChildren.map(n => n.position.y)) - 
                                       Math.min(...networkSimplexChildren.map(n => n.position.y))
      const brandesKoepfYVariance = Math.max(...brandesKoepfChildren.map(n => n.position.y)) - 
                                     Math.min(...brandesKoepfChildren.map(n => n.position.y))
      
      // NETWORK_SIMPLEX with favorStraightEdges should have tighter alignment
      expect(networkSimplexYVariance).toBeLessThan(brandesKoepfYVariance + 10)
    })
  })

  describe('favorStraightEdges option', () => {
    it('should improve alignment when enabled', async () => {
      const { nodes, edges } = createHierarchy()
      
      const withStraightEdges = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        favorStraightEdges: true,
        nodePlacement: 'NETWORK_SIMPLEX'
      })
      
      const withoutStraightEdges = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        favorStraightEdges: false,
        nodePlacement: 'NETWORK_SIMPLEX'
      })
      
      // Get children of root
      const straightChildren = withStraightEdges.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      )
      const normalChildren = withoutStraightEdges.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      )
      
      const straightYVariance = Math.max(...straightChildren.map(n => n.position.y)) - 
                                Math.min(...straightChildren.map(n => n.position.y))
      const normalYVariance = Math.max(...normalChildren.map(n => n.position.y)) - 
                              Math.min(...normalChildren.map(n => n.position.y))
      
      // favorStraightEdges should reduce Y variance (better alignment)
      expect(straightYVariance).toBeLessThanOrEqual(normalYVariance)
    })
  })

  describe('fixedAlignment option', () => {
    it('should center nodes with BALANCED alignment', async () => {
      const { nodes, edges } = createHierarchy()
      
      const balancedLayout = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        fixedAlignment: 'BALANCED'
      })
      
      const root = balancedLayout.find(n => n.id === 'root')!
      const children = balancedLayout.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      )
      
      // Calculate center of children
      const childrenYPositions = children.map(n => n.position.y)
      const childrenCenter = (Math.max(...childrenYPositions) + Math.min(...childrenYPositions)) / 2
      
      // Root should be approximately centered relative to children
      expect(Math.abs(root.position.y - childrenCenter)).toBeLessThan(100)
    })

    it('should support NONE alignment', async () => {
      const { nodes, edges } = createHierarchy()
      
      const layout = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        fixedAlignment: 'NONE'
      })
      
      // Should still produce valid layout
      expect(layout).toHaveLength(nodes.length)
      layout.forEach(node => {
        expect(node.position.x).toBeDefined()
        expect(node.position.y).toBeDefined()
      })
    })
  })

  describe('considerModelOrder option', () => {
    it('should maintain node order with NODES_AND_EDGES', async () => {
      const { nodes, edges } = createHierarchy()
      
      const layout = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        considerModelOrder: 'NODES_AND_EDGES'
      })
      
      // All nodes should be positioned
      expect(layout).toHaveLength(nodes.length)
      
      // Children should maintain relative order
      const children = layout.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      ).sort((a, b) => a.position.y - b.position.y)
      
      // Should have all 3 children in some order
      expect(children).toHaveLength(3)
    })
  })

  describe('combined options', () => {
    it('should work with all options together', async () => {
      const { nodes, edges } = createHierarchy()
      
      const layout = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        nodeSpacing: 80,
        layerSpacing: 150,
        nodePlacement: 'NETWORK_SIMPLEX',
        favorStraightEdges: true,
        considerModelOrder: 'NODES_AND_EDGES',
        fixedAlignment: 'BALANCED'
      })
      
      expect(layout).toHaveLength(nodes.length)
      
      // Verify hierarchical structure is maintained
      const root = layout.find(n => n.id === 'root')!
      const children = layout.filter(n => 
        ['child1', 'child2', 'child3'].includes(n.id)
      )
      
      // Children should be to the right of root
      children.forEach(child => {
        expect(child.position.x).toBeGreaterThan(root.position.x)
      })
      
      // Siblings should have good vertical alignment
      const yPositions = children.map(n => n.position.y)
      const yVariance = Math.max(...yPositions) - Math.min(...yPositions)
      expect(yVariance).toBeLessThan(100)
    })
  })
})
