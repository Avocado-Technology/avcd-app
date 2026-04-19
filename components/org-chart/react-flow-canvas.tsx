'use client'

import { useMemo, memo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Node } from 'reactflow'
import type { Organization } from '@/lib/mock-org-data'
import { OrgChartEmpty } from './org-chart-empty'
import { transformOrgToNodes, transformOrgToEdges, applyElkLayout } from './utils/layout-utils'
import { OrganizationNode } from './nodes/organization-node'
import { StoreNode } from './nodes/store-node'
import { EmployeeNode } from './nodes/employee-node'

const ReactFlow = dynamic(
  () => import('reactflow').then((mod) => mod.ReactFlow),
  { 
    ssr: false,
  }
)

const Controls = dynamic(
  () => import('reactflow').then((mod) => mod.Controls),
  { ssr: false }
)

const Background = dynamic(
  () => import('reactflow').then((mod) => mod.Background),
  { ssr: false }
)

interface ReactFlowCanvasProps {
  data: Organization
}

const nodeTypes = {
  organizationNode: OrganizationNode,
  storeNode: StoreNode,
  employeeNode: EmployeeNode,
}

export const ReactFlowCanvas = memo(function ReactFlowCanvas({ data }: ReactFlowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>([])
  
  const edges = useMemo(() => transformOrgToEdges(data), [data])

  useEffect(() => {
    const layoutData = async () => {
      const rawNodes = transformOrgToNodes(data)
      const rawEdges = transformOrgToEdges(data)
      
      try {
        const layoutedNodes = await applyElkLayout(rawNodes, rawEdges, { 
          direction: 'DOWN',
          nodeSpacing: 100,
          layerSpacing: 120,
          nodePlacement: 'BRANDES_KOEPF',
          favorStraightEdges: true,
          considerModelOrder: 'NODES_AND_EDGES',
          fixedAlignment: 'BALANCED'
        })
        setNodes(layoutedNodes)
      } catch (error) {
        console.error('Failed to layout org chart:', error)
        // Set raw nodes as fallback
        setNodes(rawNodes)
      }
    }
    
    layoutData()
  }, [data])

  // Check for empty state after hooks
  if (!data.stores || data.stores.length === 0) {
    return <OrgChartEmpty />
  }

  return (
    <div 
      className="w-full h-full" 
      style={{ background: 'var(--bg)' }}
      role="application"
      aria-label="Interactive organization chart"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        panOnScroll={true}
        zoomOnPinch={true}
        defaultEdgeOptions={{
          animated: false,
        }}
      >
        <Controls aria-label="Chart controls" showInteractive={false} />
        <Background gap={12} />
      </ReactFlow>
    </div>
  )
})
