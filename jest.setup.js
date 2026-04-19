import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Minimal matchMedia for hooks (tests may replace with mockMatchMedia)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock environment variables
process.env.AUTH0_SECRET = 'test-secret-key-for-auth0-testing-only-32-chars-long'
process.env.AUTH0_BASE_URL = 'http://localhost:3000'
process.env.AUTH0_ISSUER_BASE_URL = 'https://test.auth0.com'
process.env.AUTH0_CLIENT_ID = 'test-client-id'
process.env.AUTH0_CLIENT_SECRET = 'test-client-secret'

// Mock ResizeObserver for ReactFlow
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock elkjs for testing (main entry point)
jest.mock('elkjs', () => {
  return class MockELK {
    async layout(graph) {
      // Return a hierarchical positioned graph based on input
      const children = graph.children || []
      const edges = graph.edges || []
      const opts = graph.layoutOptions || {}
      
      // Parse spacing and alignment options
      const nodeSpacing = parseInt(opts['elk.spacing.nodeNode'] || '80', 10)
      const layerSpacing = parseInt(opts['elk.layered.spacing.nodeNodeBetweenLayers'] || '150', 10)
      const direction = opts['elk.direction'] || 'RIGHT'
      const nodePlacement = opts['elk.layered.nodePlacement.strategy'] || 'BRANDES_KOEPF'
      const favorStraightEdges = opts['elk.layered.nodePlacement.favorStraightEdges'] === 'true'
      const fixedAlignment = opts['elk.layered.nodePlacement.bk.fixedAlignment'] || 'NONE'
      
      // Build parent-child map
      const parentMap = new Map()
      const childrenMap = new Map()
      
      edges.forEach(edge => {
        const parent = edge.sources[0]
        const child = edge.targets[0]
        parentMap.set(child, parent)
        if (!childrenMap.has(parent)) {
          childrenMap.set(parent, [])
        }
        childrenMap.get(parent).push(child)
      })
      
      // Find root nodes (nodes with no parents)
      const roots = children.filter(node => !parentMap.has(node.id))
      
      // Assign layers (depth in hierarchy)
      const layers = new Map()
      const assignLayer = (nodeId, depth) => {
        layers.set(nodeId, depth)
        const kids = childrenMap.get(nodeId) || []
        kids.forEach(kid => assignLayer(kid, depth + 1))
      }
      roots.forEach(root => assignLayer(root.id, 0))
      
      // Group nodes by layer
      const nodesByLayer = new Map()
      children.forEach(node => {
        const layer = layers.get(node.id) || 0
        if (!nodesByLayer.has(layer)) {
          nodesByLayer.set(layer, [])
        }
        nodesByLayer.get(layer).push(node)
      })
      
      // Position nodes based on direction
      const positionedChildren = children.map(node => {
        const layer = layers.get(node.id) || 0
        const nodesInLayer = nodesByLayer.get(layer) || []
        const indexInLayer = nodesInLayer.indexOf(node)
        
        // Apply alignment improvements with favorStraightEdges and fixedAlignment
        const alignmentFactor = (favorStraightEdges || fixedAlignment === 'BALANCED') ? 0.45 : 1.0
        const nodePlacementFactor = nodePlacement === 'NETWORK_SIMPLEX' ? 0.65 : 1.0
        
        if (direction === 'RIGHT' || direction === 'LEFT') {
          // Horizontal layout with improved vertical alignment
          const baseY = indexInLayer * nodeSpacing * alignmentFactor * nodePlacementFactor
          return {
            ...node,
            x: layer * layerSpacing,
            y: baseY,
          }
        } else {
          // Vertical layout with improved horizontal alignment
          const baseX = indexInLayer * nodeSpacing * alignmentFactor * nodePlacementFactor
          return {
            ...node,
            x: baseX,
            y: layer * layerSpacing,
          }
        }
      })
      
      return {
        id: graph.id || 'root',
        children: positionedChildren,
        edges: edges
      }
    }
  }
})
