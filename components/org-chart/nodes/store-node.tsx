import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { StoreContent } from '../shared/node-content'
import type { StoreNodeData } from '../types'

interface StoreNodeProps {
  data: StoreNodeData
}

export const StoreNode = memo(function StoreNode({ data }: StoreNodeProps) {
  return (
    <div
      className="border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
      style={{
        width: '220px',
        minHeight: '70px',
        padding: 'var(--sp-5)',
        background: 'var(--bg)',
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <StoreContent 
        name={data.name}
        location={data.location}
        employeeCount={data.employeeCount}
      />
    </div>
  )
})
