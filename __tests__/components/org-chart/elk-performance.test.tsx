import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('ELK Layout Performance', () => {
  it('should handle large graphs (100+ nodes) efficiently', async () => {
    const largeNodes: Node[] = Array.from({ length: 150 }, (_, i) => ({
      id: `node-${i}`,
      type: 'employeeNode',
      position: { x: 0, y: 0 },
      data: { name: `Employee ${i}`, role: 'Staff' },
    }))

    const largeEdges: Edge[] = Array.from({ length: 149 }, (_, i) => ({
      id: `edge-${i}`,
      source: `node-${Math.floor(i / 3)}`,
      target: `node-${i + 1}`,
    }))

    const start = performance.now()
    const layouted = await applyElkLayout(largeNodes, largeEdges)
    const duration = performance.now() - start

    // More lenient timeout for CI/CD environments
    expect(duration).toBeLessThan(5000)
    expect(layouted).toHaveLength(150)
    
    // Log actual duration for performance monitoring
    console.log(`Large graph (150 nodes) layout took ${duration}ms`)
  })

  it('should handle deep hierarchies (10+ levels)', async () => {
    // Create a chain: org -> region -> district -> store -> dept -> team -> ...
    const deepNodes: Node[] = Array.from({ length: 15 }, (_, i) => ({
      id: `level-${i}`,
      position: { x: 0, y: 0 },
      data: {},
    }))

    const deepEdges: Edge[] = Array.from({ length: 14 }, (_, i) => ({
      id: `edge-${i}`,
      source: `level-${i}`,
      target: `level-${i + 1}`,
    }))

    const layouted = await applyElkLayout(deepNodes, deepEdges, {
      direction: 'RIGHT',
    })

    // Should create a long horizontal chain
    expect(layouted[14].position.x).toBeGreaterThan(layouted[0].position.x)
  })

  it('should handle wide branching (50+ children from one parent)', async () => {
    const nodes: Node[] = [
      { id: 'root', position: { x: 0, y: 0 }, data: {} },
      ...Array.from({ length: 50 }, (_, i) => ({
        id: `child-${i}`,
        position: { x: 0, y: 0 },
        data: {},
      })),
    ]

    const edges: Edge[] = Array.from({ length: 50 }, (_, i) => ({
      id: `edge-${i}`,
      source: 'root',
      target: `child-${i}`,
    }))

    const layouted = await applyElkLayout(nodes, edges, { direction: 'DOWN' })

    // All children should be positioned below root
    const root = layouted.find(n => n.id === 'root')
    const children = layouted.filter(n => n.id.startsWith('child-'))

    expect(root).toBeDefined()
    children.forEach(child => {
      expect(child.position.y).toBeGreaterThan(root!.position.y)
    })
  })

  it('should gracefully handle disconnected subgraphs', async () => {
    const nodes: Node[] = [
      { id: 'graph1-a', position: { x: 0, y: 0 }, data: {} },
      { id: 'graph1-b', position: { x: 0, y: 0 }, data: {} },
      { id: 'graph2-a', position: { x: 0, y: 0 }, data: {} },
      { id: 'graph2-b', position: { x: 0, y: 0 }, data: {} },
    ]

    const edges: Edge[] = [
      { id: 'e1', source: 'graph1-a', target: 'graph1-b' },
      { id: 'e2', source: 'graph2-a', target: 'graph2-b' },
      // No connection between graph1 and graph2
    ]

    const layouted = await applyElkLayout(nodes, edges)

    // Should position both subgraphs without error
    expect(layouted).toHaveLength(4)
    layouted.forEach(node => {
      expect(node.position).toBeDefined()
      expect(node.position.x).toBeGreaterThanOrEqual(0)
      expect(node.position.y).toBeGreaterThanOrEqual(0)
    })
  })
})
