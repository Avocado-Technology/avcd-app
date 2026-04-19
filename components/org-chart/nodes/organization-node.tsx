import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { OrganizationContent } from '../shared/node-content'
import type { OrganizationNodeData } from '../types'

interface OrganizationNodeProps {
  data: OrganizationNodeData
}

export const OrganizationNode = memo(function OrganizationNode({ data }: OrganizationNodeProps) {
  return (
    <div
      className="border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
      style={{
        width: '280px',
        minHeight: '80px',
        padding: 'var(--sp-6)',
        background: 'var(--bg)',
      }}
    >
      <Handle type="source" position={Position.Right} />
      <OrganizationContent name={data.name} />
    </div>
  )
})
