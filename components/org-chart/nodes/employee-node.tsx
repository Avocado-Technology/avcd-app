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
      className="border border-gray-200 rounded-xl hover:border-gray-400 transition-colors p-4"
      style={{
        width: '180px',
        minHeight: '60px',
        background: 'var(--bg)',
      }}
    >
      <Handle type="target" position={Position.Left} />
      <EmployeeContent name={data.name} role={data.role} />
    </div>
  )
})
