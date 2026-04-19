import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { EmployeeContent } from '../shared/node-content'
import type { EmployeeNodeData } from '../types'

interface EmployeeNodeProps {
  data: EmployeeNodeData
}

export const EmployeeNode = memo(function EmployeeNode({ data }: EmployeeNodeProps) {
  return (
    <div
      className="rounded-xl transition-colors p-4"
      style={{
        width: '180px',
        minHeight: '60px',
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
      <EmployeeContent name={data.name} role={data.role} />
    </div>
  )
})
