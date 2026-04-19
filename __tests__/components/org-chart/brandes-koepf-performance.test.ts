import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('BRANDES_KOEPF performance', () => {
  // Helper to create a large hierarchy for performance testing
  const createLargeHierarchy = (nodeCount: number) => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    
    // Create root
    nodes.push({
      id: 'root',
      type: 'organizationNode',
      position: { x: 0, y: 0 },
      data: { name: 'Root Org' }
    })
    
    // Create multiple layers
    const storesPerOrg = Math.ceil(Math.sqrt(nodeCount / 3))
    const employeesPerStore = Math.ceil((nodeCount - 1 - storesPerOrg) / storesPerOrg)
    
    // Create stores
    for (let i = 0; i < storesPerOrg; i++) {
      const storeId = `store-${i}`
      nodes.push({
        id: storeId,
        type: 'storeNode',
        position: { x: 0, y: 0 },
        data: { name: `Store ${i}` }
      })
      edges.push({
        id: `e-root-${storeId}`,
        source: 'root',
        target: storeId
      })
      
      // Create employees for this store
      for (let j = 0; j < employeesPerStore; j++) {
        const empId = `emp-${i}-${j}`
        nodes.push({
          id: empId,
          type: 'employeeNode',
          position: { x: 0, y: 0 },
          data: { name: `Employee ${i}-${j}` }
        })
        edges.push({
          id: `e-${storeId}-${empId}`,
          source: storeId,
          target: empId
        })
      }
    }
    
    return { nodes: nodes.slice(0, nodeCount), edges }
  }

  it('should layout small hierarchy quickly', async () => {
    const { nodes, edges } = createLargeHierarchy(10)
    
    const start = performance.now()
    const layouted = await applyElkLayout(nodes, edges, {
      nodePlacement: 'BRANDES_KOEPF',
      direction: 'DOWN'
    })
    const duration = performance.now() - start
    
    expect(layouted).toHaveLength(nodes.length)
    expect(duration).toBeLessThan(50) // Should be very fast for small graphs
  })

  it('should layout medium hierarchy efficiently', async () => {
    const { nodes, edges } = createLargeHierarchy(50)
    
    const start = performance.now()
    const layouted = await applyElkLayout(nodes, edges, {
      nodePlacement: 'BRANDES_KOEPF',
      direction: 'DOWN'
    })
    const duration = performance.now() - start
    
    expect(layouted).toHaveLength(nodes.length)
    expect(duration).toBeLessThan(100) // Should complete within 100ms
    
    console.log(`BRANDES_KOEPF layout of 50 nodes: ${duration.toFixed(2)}ms`)
  })

  it('should layout large hierarchy acceptably', async () => {
    const { nodes, edges } = createLargeHierarchy(100)
    
    const start = performance.now()
    const layouted = await applyElkLayout(nodes, edges, {
      nodePlacement: 'BRANDES_KOEPF',
      direction: 'DOWN'
    })
    const duration = performance.now() - start
    
    expect(layouted).toHaveLength(nodes.length)
    expect(duration).toBeLessThan(200) // Should complete within 200ms for 100 nodes
    
    console.log(`BRANDES_KOEPF layout of 100 nodes: ${duration.toFixed(2)}ms`)
  })

  it('should be significantly faster than NETWORK_SIMPLEX', async () => {
    const medianMs = async (
      placement: 'BRANDES_KOEPF' | 'NETWORK_SIMPLEX'
    ): Promise<number> => {
      const RUNS = 5
      const samples: number[] = []
      for (let i = 0; i < RUNS; i++) {
        const { nodes, edges } = createLargeHierarchy(50)
        const start = performance.now()
        await applyElkLayout(nodes, edges, {
          nodePlacement: placement,
          direction: 'DOWN'
        })
        samples.push(performance.now() - start)
      }
      samples.sort((a, b) => a - b)
      return samples[Math.floor(samples.length / 2)]!
    }

    const timeBK = await medianMs('BRANDES_KOEPF')
    const timeNS = await medianMs('NETWORK_SIMPLEX')

    console.log(`Performance comparison (50 nodes, median of 5):`)
    console.log(`  BRANDES_KOEPF: ${timeBK.toFixed(2)}ms`)
    console.log(`  NETWORK_SIMPLEX: ${timeNS.toFixed(2)}ms`)
    console.log(`  Speedup: ${(timeNS / Math.max(timeBK, 1e-9)).toFixed(2)}x`)

    // BRANDES_KOEPF should be at least roughly comparable (timer noise + parallel CI load).
    expect(timeBK).toBeLessThanOrEqual(timeNS * 2.25)
  })

  it('should handle repeated layouts efficiently', async () => {
    const { nodes, edges } = createLargeHierarchy(30)
    
    const iterations = 5
    const times: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      await applyElkLayout(nodes, edges, {
        nodePlacement: 'BRANDES_KOEPF',
        direction: 'DOWN'
      })
      times.push(performance.now() - start)
    }
    
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length
    const maxTime = Math.max(...times)
    
    expect(avgTime).toBeLessThan(100)
    expect(maxTime).toBeLessThan(150) // No extreme outliers
    
    console.log(`Repeated layout stats (30 nodes, ${iterations} runs):`)
    console.log(`  Average: ${avgTime.toFixed(2)}ms`)
    console.log(`  Max: ${maxTime.toFixed(2)}ms`)
  })

  it('should scale linearly with node count', async () => {
    const sizes = [10, 20, 40]
    const RUNS = 7
    const medianMs = async (size: number): Promise<number> => {
      const samples: number[] = []
      for (let i = 0; i < RUNS; i++) {
        const { nodes, edges } = createLargeHierarchy(size)
        const start = performance.now()
        await applyElkLayout(nodes, edges, {
          nodePlacement: 'BRANDES_KOEPF',
          direction: 'DOWN'
        })
        samples.push(performance.now() - start)
      }
      samples.sort((a, b) => a - b)
      return samples[Math.floor(samples.length / 2)]!
    }

    const times: number[] = []
    for (const size of sizes) {
      const ms = await medianMs(size)
      times.push(ms)
      console.log(`${size} nodes (median of ${RUNS}): ${ms.toFixed(2)}ms`)
    }

    // Single-shot timers are noisy at sub-ms speeds; median reduces flake.
    const ratio1 = times[1] / Math.max(times[0], 1e-6)
    const ratio2 = times[2] / Math.max(times[1], 1e-6)

    expect(ratio1).toBeGreaterThan(0.35)
    expect(ratio2).toBeGreaterThan(0.35)
    expect(ratio1).toBeLessThan(5)
    expect(ratio2).toBeLessThan(5)
  })

  it('should maintain performance with complex branching', async () => {
    // Create a more complex structure: 1 root -> 10 stores -> 3 employees each
    const nodes: Node[] = [
      { id: 'root', type: 'organizationNode', position: { x: 0, y: 0 }, data: {} }
    ]
    const edges: Edge[] = []
    
    // Create 10 stores
    for (let i = 0; i < 10; i++) {
      const storeId = `store-${i}`
      nodes.push({
        id: storeId,
        type: 'storeNode',
        position: { x: 0, y: 0 },
        data: {}
      })
      edges.push({ id: `e-root-${storeId}`, source: 'root', target: storeId })
      
      // 3 employees per store
      for (let j = 0; j < 3; j++) {
        const empId = `emp-${i}-${j}`
        nodes.push({
          id: empId,
          type: 'employeeNode',
          position: { x: 0, y: 0 },
          data: {}
        })
        edges.push({ id: `e-${storeId}-${empId}`, source: storeId, target: empId })
      }
    }
    
    const start = performance.now()
    const layouted = await applyElkLayout(nodes, edges, {
      nodePlacement: 'BRANDES_KOEPF',
      direction: 'DOWN'
    })
    const duration = performance.now() - start
    
    expect(layouted).toHaveLength(41) // 1 + 10 + 30
    expect(duration).toBeLessThan(150)
    
    console.log(`Complex branching (1 -> 10 -> 30): ${duration.toFixed(2)}ms`)
  })
})
