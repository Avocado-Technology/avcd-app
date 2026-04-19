import { useEffect, useCallback, useRef } from 'react'
import { useNodesInitialized, useReactFlow } from 'reactflow'
import { applyElkLayout, ElkLayoutOptions } from '@/components/org-chart/utils/layout-utils'

export function useAutoLayout(options?: ElkLayoutOptions) {
  const nodesInitialized = useNodesInitialized()
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  const runLayout = useCallback(async () => {
    if (!nodesInitialized) return
    
    const currentNodes = getNodes()
    const currentEdges = getEdges()
    
    if (currentNodes.length === 0) return
    
    try {
      const layouted = await applyElkLayout(currentNodes, currentEdges, options)
      setNodes(layouted)
      
      // Delay fitView to allow nodes to render
      timeoutRef.current = setTimeout(() => {
        fitView({ duration: 800 })
      }, 100)
    } catch (error) {
      console.error('Auto-layout failed:', error)
    }
  }, [nodesInitialized, getNodes, getEdges, setNodes, fitView, options])
  
  useEffect(() => {
    runLayout()
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [runLayout])
  
  return {
    applyAutoLayout: runLayout
  }
}
