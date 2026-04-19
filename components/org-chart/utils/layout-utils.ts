import { Node, Edge } from 'reactflow'
import dagre from 'dagre'
import { Organization } from '@/lib/mock-org-data'
import { NODE_TYPES } from '../types'
import { NODE_DIMENSIONS } from '../config'

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

export function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): Node[] {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  // Add nodes to dagre
  nodes.forEach((node) => {
    const dimensions = NODE_DIMENSIONS[node.type as keyof typeof NODE_DIMENSIONS]
    const width = dimensions?.width ?? 180
    const height = dimensions?.height ?? 60
    dagreGraph.setNode(node.id, { width, height })
  })

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Apply positions back to nodes
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    }
  })
}
