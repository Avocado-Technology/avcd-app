import { memo } from 'react'
import { EmployeeContent } from '../shared/node-content'
import type { EmployeeNodeData } from '../types'
import { BaseNode } from './base-node'
import { NODE_DIMENSIONS } from '../config'
import { NODE_TYPES } from '../types'

interface EmployeeNodeProps {
  data: EmployeeNodeData
}

export const EmployeeNode = memo(function EmployeeNode({ data }: EmployeeNodeProps) {
  const { width, height } = NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE]

  return (
    <BaseNode
      width={width}
      height={height}
      hasSourceHandle={true}
      hasTargetHandle={true}
    >
      <EmployeeContent name={data.name} role={data.role} />
    </BaseNode>
  )
})
