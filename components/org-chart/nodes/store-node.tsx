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
      className="rounded-xl transition-colors"
      style={{
        width: '220px',
        minHeight: '70px',
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
