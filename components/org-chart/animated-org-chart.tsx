'use client'

import {
  useMemo,
  memo,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react'
import type { Organization } from '@/lib/mock-org-data'
import { useAnimationState } from '@/lib/hooks/useAnimationState'
import { OrgChartEmpty } from './org-chart-empty'
import { OrgChartErrorBoundary } from './org-chart-error-boundary'
import { transformOrgToD3Data } from './utils/d3-transform'
import { D3OrgChartWrapper, type D3OrgChartWrapperRef } from './d3-org-chart-wrapper'

interface AnimatedOrgChartProps {
  data: Organization
  onNodeAdded?: (nodeId: string) => void
  onNodeMoved?: (nodeId: string, fromParent: string, toParent: string) => void
}

export interface AnimatedOrgChartRef {
  markAsRecent: (nodeId: string, duration?: number) => void
  highlightNode: (nodeId: string, duration?: number) => void
  clearAll: () => void
  /** Highlight node in d3-org-chart, expand ancestors, and zoom pan to center it */
  focusNode: (nodeId: string) => void
}

export const AnimatedOrgChart = memo(
  forwardRef<AnimatedOrgChartRef, AnimatedOrgChartProps>(
    function AnimatedOrgChart({ data }, ref) {
      const chartHandleRef = useRef<D3OrgChartWrapperRef>(null)

      const {
        recentChanges,
        highlightedNodes,
        markAsRecent,
        highlightNode,
        clearAll,
      } = useAnimationState()

      useImperativeHandle(
        ref,
        () => ({
          markAsRecent,
          highlightNode,
          clearAll,
          focusNode: (nodeId: string) => {
            chartHandleRef.current?.highlight(nodeId)
          },
        }),
        [markAsRecent, highlightNode, clearAll]
      )

      const chartData = useMemo(
        () =>
          transformOrgToD3Data(data, recentChanges, highlightedNodes),
        [data, recentChanges, highlightedNodes]
      )

      if (!data || !data.stores || data.stores.length === 0) {
        return <OrgChartEmpty />
      }

      return (
        <OrgChartErrorBoundary key={data.id}>
          <div
            className="h-full w-full"
            style={{ background: 'var(--bg)' }}
            role="application"
            aria-label="Interactive animated organization chart"
            data-zoom-on-pinch="true"
            data-pan-on-scroll="true"
          >
            <D3OrgChartWrapper ref={chartHandleRef} data={chartData} />
          </div>
        </OrgChartErrorBoundary>
      )
    }
  )
)
