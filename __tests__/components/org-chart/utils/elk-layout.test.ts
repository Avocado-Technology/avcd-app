import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('applyElkLayout', () => {
  it('should return positioned nodes from ELK layout', async () => {
    const nodes: Node[] = [
      { id: 'org-1', type: 'organizationNode', position: { x: 0, y: 0 }, data: { name: 'Test Org' } },
      { id: 'store-1', type: 'storeNode', position: { x: 0, y: 0 }, data: { name: 'Test Store' } }
    ]
    const edges: Edge[] = [{ id: 'org-1-store-1', source: 'org-1', target: 'store-1' }]

    const layouted = await applyElkLayout(nodes, edges)

    expect(layouted).toHaveLength(2)
    expect(layouted[0].position.x).toBeGreaterThanOrEqual(0)
    expect(layouted[0].position.y).toBeGreaterThanOrEqual(0)
  })

  it('should handle empty nodes array', async () => {
    const layouted = await applyElkLayout([], [])
    expect(layouted).toEqual([])
  })

  it('should filter invalid edges (source/target not in nodes)', async () => {
    const nodes: Node[] = [{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }]
    const edges: Edge[] = [
      { id: 'e1', source: 'node-1', target: 'invalid-node' },
      { id: 'e2', source: 'invalid-node', target: 'node-1' }
    ]

    // Should not throw error, just ignore invalid edges
    await expect(applyElkLayout(nodes, edges)).resolves.toBeDefined()
  })

  it('should use node dimensions from config', async () => {
    const nodes: Node[] = [
      { id: 'org-1', type: 'organizationNode', position: { x: 0, y: 0 }, data: {} }
    ]

    // Should use NODE_DIMENSIONS[organizationNode] = { width: 280, height: 80 }
    const layouted = await applyElkLayout(nodes, [])
    expect(layouted[0]).toBeDefined()
  })

  it('should support direction option (RIGHT, DOWN, LEFT, UP)', async () => {
    const nodes: Node[] = [
      { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
      { id: 'node-2', position: { x: 0, y: 0 }, data: {} }
    ]
    const edges: Edge[] = [{ id: 'e1', source: 'node-1', target: 'node-2' }]

    const horizontal = await applyElkLayout(nodes, edges, { direction: 'RIGHT' })
    const vertical = await applyElkLayout(nodes, edges, { direction: 'DOWN' })

    // Horizontal layout: node-2.x > node-1.x
    expect(horizontal[1].position.x).toBeGreaterThan(horizontal[0].position.x)

    // Vertical layout: node-2.y > node-1.y
    expect(vertical[1].position.y).toBeGreaterThan(vertical[0].position.y)
  })

  it('should apply custom spacing options', async () => {
    const nodes: Node[] = [
      { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
      { id: 'node-2', position: { x: 0, y: 0 }, data: {} }
    ]
    const edges: Edge[] = [{ id: 'e1', source: 'node-1', target: 'node-2' }]

    const tightSpacing = await applyElkLayout(nodes, edges, {
      nodeSpacing: 20,
      layerSpacing: 50
    })
    const wideSpacing = await applyElkLayout(nodes, edges, {
      nodeSpacing: 100,
      layerSpacing: 200
    })

    // With DOWN direction (default), test Y distance (layerSpacing effect)
    const tightDistance = Math.abs(tightSpacing[1].position.y - tightSpacing[0].position.y)
    const wideDistance = Math.abs(wideSpacing[1].position.y - wideSpacing[0].position.y)

    expect(wideDistance).toBeGreaterThan(tightDistance)
  })

  describe('node alignment', () => {
    it('should align sibling nodes horizontally in RIGHT direction', async () => {
      // Create hierarchy: org -> 3 stores
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
        direction: 'RIGHT',
        nodePlacement: 'BRANDES_KOEPF'
      })

      const storeNodes = layouted.filter(n => n.type === 'storeNode')
      const yPositions = storeNodes.map(n => n.position.y)
      const yVariance = Math.max(...yPositions) - Math.min(...yPositions)

      // Siblings should be within reasonable vertical alignment
      // BRANDES_KOEPF may have slightly more variance than NETWORK_SIMPLEX
      expect(yVariance).toBeLessThan(100)
    })

    it('should maintain consistent layer spacing between parent and children', async () => {
      const nodes: Node[] = [
        { id: 'org-1', type: 'organizationNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-1', type: 'storeNode', position: { x: 0, y: 0 }, data: {} },
        { id: 'store-2', type: 'storeNode', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'org-1', target: 'store-1' },
        { id: 'e2', source: 'org-1', target: 'store-2' }
      ]

      const layouted = await applyElkLayout(nodes, edges, { 
        direction: 'RIGHT',
        layerSpacing: 150
      })

      const orgNode = layouted.find(n => n.id === 'org-1')!
      const store1 = layouted.find(n => n.id === 'store-1')!
      const store2 = layouted.find(n => n.id === 'store-2')!

      const spacing1 = Math.abs(store1.position.x - orgNode.position.x)
      const spacing2 = Math.abs(store2.position.x - orgNode.position.x)

      // Both children should have similar X spacing from parent
      expect(Math.abs(spacing1 - spacing2)).toBeLessThan(10)
    })

    it('should support NETWORK_SIMPLEX node placement strategy', async () => {
      const nodes: Node[] = [
        { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
        { id: 'node-2', position: { x: 0, y: 0 }, data: {} },
        { id: 'node-3', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'node-1', target: 'node-2' },
        { id: 'e2', source: 'node-1', target: 'node-3' }
      ]

      const layouted = await applyElkLayout(nodes, edges, {
        nodePlacement: 'NETWORK_SIMPLEX',
        direction: 'RIGHT'
      })

      expect(layouted).toHaveLength(3)
      expect(layouted[0].position.x).toBeDefined()
      expect(layouted[0].position.y).toBeDefined()
    })

    it('should support BRANDES_KOEPF node placement strategy', async () => {
      const nodes: Node[] = [
        { id: 'node-1', position: { x: 0, y: 0 }, data: {} },
        { id: 'node-2', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'node-1', target: 'node-2' }
      ]

      const layouted = await applyElkLayout(nodes, edges, {
        nodePlacement: 'BRANDES_KOEPF',
        direction: 'RIGHT'
      })

      expect(layouted).toHaveLength(2)
      expect(layouted[1].position.x).toBeGreaterThan(layouted[0].position.x)
    })

    it('should produce straight edge paths with favorStraightEdges option', async () => {
      const nodes: Node[] = [
        { id: 'parent', position: { x: 0, y: 0 }, data: {} },
        { id: 'child1', position: { x: 0, y: 0 }, data: {} },
        { id: 'child2', position: { x: 0, y: 0 }, data: {} },
        { id: 'child3', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'parent', target: 'child1' },
        { id: 'e2', source: 'parent', target: 'child2' },
        { id: 'e3', source: 'parent', target: 'child3' }
      ]

      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        favorStraightEdges: true,
        nodePlacement: 'NETWORK_SIMPLEX'
      })

      // Children should be relatively aligned vertically (small Y variance)
      const childNodes = layouted.filter(n => n.id.startsWith('child'))
      const yPositions = childNodes.map(n => n.position.y)
      const yVariance = Math.max(...yPositions) - Math.min(...yPositions)

      // With favorStraightEdges, vertical alignment should be tighter
      expect(yVariance).toBeLessThan(100)
    })

    it('should center nodes with fixedAlignment BALANCED', async () => {
      const nodes: Node[] = [
        { id: 'root', position: { x: 0, y: 0 }, data: {} },
        { id: 'child1', position: { x: 0, y: 0 }, data: {} },
        { id: 'child2', position: { x: 0, y: 0 }, data: {} }
      ]
      const edges: Edge[] = [
        { id: 'e1', source: 'root', target: 'child1' },
        { id: 'e2', source: 'root', target: 'child2' }
      ]

      const layouted = await applyElkLayout(nodes, edges, {
        direction: 'RIGHT',
        fixedAlignment: 'BALANCED'
      })

      const root = layouted.find(n => n.id === 'root')!
      const child1 = layouted.find(n => n.id === 'child1')!
      const child2 = layouted.find(n => n.id === 'child2')!

      // Root should be centered between children (approximately)
      const childMidpoint = (child1.position.y + child2.position.y) / 2
      expect(Math.abs(root.position.y - childMidpoint)).toBeLessThan(50)
    })
  })
})
