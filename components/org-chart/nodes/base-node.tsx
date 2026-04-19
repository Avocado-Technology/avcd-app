'use client'

import { memo, ReactNode } from 'react'
import { Handle, Position } from 'reactflow'

interface BaseNodeProps {
  width?: number
  height?: number
  children: ReactNode
  hasSourceHandle?: boolean
  hasTargetHandle?: boolean
  sourcePosition?: Position
  targetPosition?: Position
  direction?: 'DOWN' | 'RIGHT' | 'LEFT' | 'UP'
}

export const BaseNode = memo(function BaseNode({
  width = 240,
  height = 80,
  children,
  hasSourceHandle = true,
  hasTargetHandle = false,
  sourcePosition,
  targetPosition,
  direction = 'DOWN',
}: BaseNodeProps) {
  // Compute handle positions based on direction if not explicitly provided
  const isVertical = direction === 'DOWN' || direction === 'UP'
  const computedSourcePosition = sourcePosition ?? (isVertical ? Position.Bottom : Position.Right)
  const computedTargetPosition = targetPosition ?? (isVertical ? Position.Top : Position.Left)
  return (
    <div
      className="rounded-xl transition-colors"
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        padding: 'var(--sp-5)',
        background: 'var(--bg)',
        border: '1px solid var(--g200)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--g400)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--g200)'
      }}
    >
      {hasTargetHandle && <Handle type="target" position={computedTargetPosition} />}
      {hasSourceHandle && <Handle type="source" position={computedSourcePosition} />}
      {children}
    </div>
  )
})
