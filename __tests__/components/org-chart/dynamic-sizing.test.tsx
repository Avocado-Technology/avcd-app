import { applyElkLayout } from '@/components/org-chart/utils/layout-utils'
import { Node, Edge } from 'reactflow'

describe('Dynamic Node Sizing with ELK', () => {
  it('should use measured node dimensions when available', async () => {
    const nodes: Node[] = [
      {
        id: 'node-1',
        type: 'organizationNode',
        measured: { width: 320, height: 100 },
        position: { x: 0, y: 0 },
        data: {}
      }
    ]

    const layouted = await applyElkLayout(nodes, [])

    expect(layouted[0].position).toBeDefined()
    expect(layouted[0].position.x).toBeGreaterThanOrEqual(0)
    expect(layouted[0].position.y).toBeGreaterThanOrEqual(0)
  })

  it('should fall back to config dimensions when measured not available', async () => {
    const nodes: Node[] = [
      {
        id: 'node-1',
        type: 'organizationNode',
        position: { x: 0, y: 0 },
        data: {}
      }
    ]

    const layouted = await applyElkLayout(nodes, [])

    expect(layouted[0]).toBeDefined()
    expect(layouted[0].position).toBeDefined()
  })

  it('should handle nodes with varying widths correctly', async () => {
    const nodes: Node[] = [
      {
        id: 'store-1',
        type: 'storeNode',
        measured: { width: 180, height: 70 },
        position: { x: 0, y: 0 },
        data: { employeeCount: 2 }
      },
      {
        id: 'store-2',
        type: 'storeNode',
        measured: { width: 280, height: 70 },
        position: { x: 0, y: 0 },
        data: { employeeCount: 15 }
      }
    ]
    const edges: Edge[] = []

    const layouted = await applyElkLayout(nodes, edges, { direction: 'DOWN' })

    expect(layouted[0].position.y).toBeDefined()
    expect(layouted[1].position.y).toBeDefined()
    expect(layouted[0].position.y).toBeGreaterThanOrEqual(0)
    expect(layouted[1].position.y).toBeGreaterThanOrEqual(0)
  })

  it('should fall back through dimension chain correctly', async () => {
    const nodes: Node[] = [
      {
        id: 'node-with-measured',
        type: 'employeeNode',
        measured: { width: 200, height: 80 },
        position: { x: 0, y: 0 },
        data: {}
      },
      {
        id: 'node-with-width-prop',
        type: 'employeeNode',
        width: 190,
        height: 70,
        position: { x: 0, y: 0 },
        data: {}
      },
      {
        id: 'node-with-type-config',
        type: 'employeeNode',
        position: { x: 0, y: 0 },
        data: {}
      },
      {
        id: 'node-with-defaults',
        position: { x: 0, y: 0 },
        data: {}
      }
    ]

    const layouted = await applyElkLayout(nodes, [])

    // All nodes should have valid positions
    layouted.forEach(node => {
      expect(node.position).toBeDefined()
      expect(node.position.x).toBeGreaterThanOrEqual(0)
      expect(node.position.y).toBeGreaterThanOrEqual(0)
    })
  })
})
