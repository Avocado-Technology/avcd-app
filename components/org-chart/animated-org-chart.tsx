'use client'

import { useMemo, memo, useImperativeHandle, forwardRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useNodesState, useEdgesState } from 'reactflow'
import type { Organization } from '@/lib/mock-org-data'
import { useAnimationState } from '@/lib/hooks/useAnimationState'
import { PageSkeleton } from '@/components/ui/page-skeleton'
import { OrgChartEmpty } from './org-chart-empty'
import { OrgChartErrorBoundary } from './org-chart-error-boundary'
import { transformOrgToNodes, transformOrgToEdges, applyElkLayout } from './utils/layout-utils'
import { AnimatedOrganizationNode } from './nodes/animated-organization-node'
import { AnimatedStoreNode } from './nodes/animated-store-node'
import { AnimatedEmployeeNode } from './nodes/animated-employee-node'

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

interface AnimatedOrgChartProps {
  data: Organization
  onNodeAdded?: (nodeId: string) => void
  onNodeMoved?: (nodeId: string, fromParent: string, toParent: string) => void
}

export interface AnimatedOrgChartRef {
  markAsRecent: (nodeId: string, duration?: number) => void
  highlightNode: (nodeId: string, duration?: number) => void
  clearAll: () => void
}

// Define nodeTypes OUTSIDE component - critical for performance
const createNodeTypes = () => ({
  organizationNode: AnimatedOrganizationNode,
  storeNode: AnimatedStoreNode,
  employeeNode: AnimatedEmployeeNode,
})

export const AnimatedOrgChart = memo(forwardRef<AnimatedOrgChartRef, AnimatedOrgChartProps>(
  function AnimatedOrgChart({ data }, ref) {
    const {
      recentChanges,
      highlightedNodes,
      markAsRecent,
      highlightNode,
      clearAll,
    } = useAnimationState()

    // Expose animation controls via ref
    useImperativeHandle(ref, () => ({
      markAsRecent,
      highlightNode,
      clearAll,
    }), [markAsRecent, highlightNode, clearAll])

    // Memoize nodeTypes - critical for performance
    const nodeTypes = useMemo(() => createNodeTypes(), [])

    // Transform org data to nodes and edges
    const initialNodes = useMemo(() => {
      const rawNodes = transformOrgToNodes(data)
      return rawNodes
    }, [data])

    const initialEdges = useMemo(() => transformOrgToEdges(data), [data])

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    // Apply ELK layout when data changes
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
          setEdges(rawEdges)
        } catch (error) {
          console.error('Failed to layout org chart:', error)
          // Set raw nodes as fallback
          setNodes(rawNodes)
          setEdges(rawEdges)
        }
      }
      
      layoutData()
    }, [data, setNodes, setEdges])

    // Enhance nodes with animation state
    const enhancedNodes = useMemo(() => {
      return nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isRecent: recentChanges.has(node.id),
          isHighlighted: highlightedNodes.has(node.id),
        }
      }))
    }, [nodes, recentChanges, highlightedNodes])

    // Check for empty state
    if (!data.stores || data.stores.length === 0) {
      return <OrgChartEmpty />
    }

    return (
      <OrgChartErrorBoundary key={data.id}>
        <div
          className="w-full h-full"
          style={{ background: 'var(--bg)' }}
          role="application"
          aria-label="Interactive animated organization chart"
          data-zoom-on-pinch="true"
          data-pan-on-scroll="true"
        >
          <ReactFlow
            nodes={enhancedNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            minZoom={0.3}
            maxZoom={1.5}
            panOnScroll={true}
            zoomOnPinch={true}
            defaultEdgeOptions={{
              animated: false,
              style: { 
                strokeWidth: 1.5,
                stroke: 'var(--g300)',
              },
            }}
          >
            <Controls aria-label="Chart controls" showInteractive={false} />
            <Background gap={12} />
          </ReactFlow>
        </div>
      </OrgChartErrorBoundary>
    )
  }
))
