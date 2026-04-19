import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('Layout Performance Comparison', () => {
  const testSizes = [10, 50, 100]
  
  testSizes.forEach(nodeCount => {
    it(`should layout ${nodeCount} nodes efficiently`, async () => {
      const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
        id: `node-${i}`,
        type: 'employeeNode',
        position: { x: 0, y: 0 },
        data: {}
      }))
      
      const edges: Edge[] = Array.from({ length: nodeCount - 1 }, (_, i) => ({
        id: `edge-${i}`,
        source: `node-${Math.floor(i / 2)}`,
        target: `node-${i + 1}`
      }))
      
      const start = performance.now()
      const layouted = await applyElkLayout(nodes, edges)
      const duration = performance.now() - start
      
      console.log(`ELK layout ${nodeCount} nodes: ${duration}ms`)
      
      expect(layouted).toHaveLength(nodeCount)
      expect(duration).toBeLessThan(nodeCount * 50) // 50ms per node max
    })
  })
  
  it('should complete small graphs (< 20 nodes) very quickly', async () => {
    const nodes: Node[] = Array.from({ length: 10 }, (_, i) => ({
      id: `node-${i}`,
      type: 'employeeNode',
      position: { x: 0, y: 0 },
      data: {}
    }))
    
    const edges: Edge[] = Array.from({ length: 9 }, (_, i) => ({
      id: `edge-${i}`,
      source: `node-${Math.floor(i / 2)}`,
      target: `node-${i + 1}`
    }))
    
    const start = performance.now()
    const layouted = await applyElkLayout(nodes, edges)
    const duration = performance.now() - start
    
    expect(layouted).toHaveLength(10)
    expect(duration).toBeLessThan(100) // Should be very fast for small graphs
  })
})
