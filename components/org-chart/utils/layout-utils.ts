import { Node, Edge } from 'reactflow'
import { Organization } from '@/lib/mock-org-data'
import { NODE_TYPES } from '../types'
import { NODE_DIMENSIONS } from '../config'

// Extend Node type to include measured dimensions
interface NodeWithMeasured extends Node {
  measured?: {
    width?: number
    height?: number
  }
}

export interface ElkLayoutOptions {
  direction?: 'RIGHT' | 'DOWN' | 'LEFT' | 'UP'
  nodeSpacing?: number
  layerSpacing?: number
  algorithm?: 'layered' | 'force' | 'stress'
  edgeRouting?: 'ORTHOGONAL' | 'POLYLINE'
  // Node placement and alignment options
  nodePlacement?: 'NETWORK_SIMPLEX' | 'BRANDES_KOEPF' | 'LINEAR_SEGMENTS' | 'SIMPLE'
  favorStraightEdges?: boolean
  considerModelOrder?: 'NODES_AND_EDGES' | 'PREFER_EDGES' | 'PREFER_NODES'
  fixedAlignment?: 'NONE' | 'LEFTUP' | 'RIGHTDOWN' | 'BALANCED'
  returnOriginalOnError?: boolean
}

export async function applyElkLayout(
  nodes: Node[],
  edges: Edge[],
  options?: ElkLayoutOptions
): Promise<Node[]> {
  // Handle empty nodes
  if (nodes.length === 0) {
    return []
  }

  const {
    direction = 'DOWN',
    nodeSpacing = 100,
    layerSpacing = 120,
    algorithm = 'layered',
    edgeRouting = 'ORTHOGONAL',
    nodePlacement = 'BRANDES_KOEPF',
    favorStraightEdges = true,
    considerModelOrder = 'NODES_AND_EDGES',
    fixedAlignment = 'BALANCED',
    returnOriginalOnError = false
  } = options || {}

  // Dynamically import ELK using main entry point (works in Docker)
  const ELK = (await import('elkjs')).default
  const elk = new ELK()

  // Filter valid edges
  const nodeIds = new Set(nodes.map(n => n.id))
  const validEdges = edges.filter(edge => 
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  )

  // Build ELK graph
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': algorithm,
      'elk.direction': direction,
      'elk.spacing.nodeNode': String(nodeSpacing),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
      'elk.edgeRouting': edgeRouting,
      // Node placement and alignment options
      'elk.layered.nodePlacement.strategy': nodePlacement,
      'elk.layered.nodePlacement.favorStraightEdges': String(favorStraightEdges),
      'elk.layered.considerModelOrder.strategy': considerModelOrder,
      'elk.layered.nodePlacement.bk.fixedAlignment': fixedAlignment,
      // Additional spacing for cleaner edges
      'elk.layered.spacing.edgeNodeBetweenLayers': '40',
    },
    children: nodes.map(node => {
      // Get node dimensions with fallback chain:
      // measured → width/height → NODE_DIMENSIONS[type] → defaults
      const nodeWithMeasured = node as NodeWithMeasured
      const dimensions = NODE_DIMENSIONS[node.type as keyof typeof NODE_DIMENSIONS]
      const width = nodeWithMeasured.measured?.width ?? node.width ?? dimensions?.width ?? 180
      const height = nodeWithMeasured.measured?.height ?? node.height ?? dimensions?.height ?? 60

      return {
        id: node.id,
        width,
        height,
      }
    }),
    edges: validEdges.map(edge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  try {
    const layoutedGraph = await elk.layout(elkGraph)

    // Map positions back to nodes
    return nodes.map(node => {
      const elkNode = layoutedGraph.children?.find(n => n.id === node.id)
      
      return {
        ...node,
        position: {
          x: elkNode?.x ?? node.position.x,
          y: elkNode?.y ?? node.position.y,
        },
      }
    })
  } catch (error) {
    console.error('ELK layout failed:', error)
    if (returnOriginalOnError) {
      return nodes
    }
    throw error
  }
}

export function transformOrgToNodes(org: Organization): Node[] {
  const nodes: Node[] = []

  // Organization node
  nodes.push({
    id: org.id,
    type: NODE_TYPES.ORGANIZATION,
    position: { x: 0, y: 0 }, // Will be positioned by Dagre
    data: {
      id: org.id,
      name: org.name,
    },
  })

  // Store nodes
  org.stores.forEach((store) => {
    nodes.push({
      id: store.id,
      type: NODE_TYPES.STORE,
      position: { x: 0, y: 0 },
      data: {
        id: store.id,
        name: store.name,
        location: store.location,
        employeeCount: store.employees.length,
      },
    })

    // Employee nodes
    store.employees.forEach((employee) => {
      nodes.push({
        id: employee.id,
        type: NODE_TYPES.EMPLOYEE,
        position: { x: 0, y: 0 },
        data: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
        },
      })
    })
  })

  return nodes
}

export function transformOrgToEdges(org: Organization): Edge[] {
  const edges: Edge[] = []

  // Edges from organization to stores
  org.stores.forEach((store) => {
    edges.push({
      id: `${org.id}-${store.id}`,
      source: org.id,
      target: store.id,
      type: 'smoothstep',
      style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      animated: false,
    })

    // Edges from stores to employees
    store.employees.forEach((employee) => {
      edges.push({
        id: `${store.id}-${employee.id}`,
        source: store.id,
        target: employee.id,
        type: 'smoothstep',
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        animated: false,
      })
    })
  })

  return edges
}
