import { Node } from 'reactflow'

interface ElkGraphChild {
  width?: number
  height?: number
  [key: string]: unknown
}

interface ElkGraphInput {
  id?: string
  children?: ElkGraphChild[]
  layoutOptions?: Record<string, string>
  edges?: unknown[]
}

// Create a module that can be mocked per test
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- jest.doMock expects constructor class
let MockELKClass: any

beforeEach(() => {
  // Reset to default working mock
  MockELKClass = class {
    async layout(graph: ElkGraphInput) {
      const children = graph.children || []
      const opts = graph.layoutOptions || {}
      const nodeSpacing = parseInt(opts['elk.spacing.nodeNode'] || '80', 10)
      const layerSpacing = parseInt(opts['elk.layered.spacing.nodeNodeBetweenLayers'] || '150', 10)
      const direction = opts['elk.direction'] || 'RIGHT'
      
      const positionedChildren = children.map((child: ElkGraphChild, index: number) => {
        if (direction === 'RIGHT' || direction === 'LEFT') {
          return {
            ...child,
            x: index * (child.width + layerSpacing),
            y: index * nodeSpacing,
          }
        } else {
          return {
            ...child,
            x: index * nodeSpacing,
            y: index * (child.height + layerSpacing),
          }
        }
      })
      
      return {
        id: graph.id || 'root',
        children: positionedChildren,
        edges: graph.edges || []
      }
    }
  }
})

describe('applyElkLayout error handling', () => {
  it('should handle ELK layout failures gracefully', async () => {
    // Create a failing ELK mock
    MockELKClass = class {
      async layout() {
        throw new Error('ELK algorithm failed')
      }
    }
    
    jest.doMock('elkjs', () => MockELKClass)
    
    // Import fresh instance
    jest.resetModules()
    const { applyElkLayout } = await import('@/components/org-chart/utils/layout-utils')
    
    const nodes: Node[] = [{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }]
    
    await expect(applyElkLayout(nodes, [])).rejects.toThrow('ELK algorithm failed')
  })
  
  it('should log error details when layout fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    
    MockELKClass = class {
      async layout() {
        throw new Error('Invalid graph structure')
      }
    }
    
    jest.doMock('elkjs', () => MockELKClass)
    jest.resetModules()
    const { applyElkLayout } = await import('@/components/org-chart/utils/layout-utils')
    
    try {
      await applyElkLayout([{ id: 'node-1', position: { x: 0, y: 0 }, data: {} }], [])
    } catch {
      // Expected to fail
    }
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'ELK layout failed:',
      expect.any(Error)
    )
    
    consoleErrorSpy.mockRestore()
  })
  
  it('should return original positions when ELK fails and returnOriginalOnError is true', async () => {
    MockELKClass = class {
      async layout() {
        throw new Error('ELK failed')
      }
    }
    
    jest.doMock('elkjs', () => MockELKClass)
    jest.resetModules()
    const { applyElkLayout } = await import('@/components/org-chart/utils/layout-utils')
    
    const nodes: Node[] = [{ id: 'node-1', position: { x: 100, y: 200 }, data: {} }]
    
    const result = await applyElkLayout(nodes, [], { returnOriginalOnError: true })
    
    expect(result[0].position).toEqual({ x: 100, y: 200 })
  })
})
