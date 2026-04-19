'use client'

import { memo } from 'react'
import { EmployeeContent } from '../shared/node-content'
import type { AnimatedEmployeeNodeData } from '../types'
import { BaseAnimatedNode } from './base-animated-node'
import { NODE_DIMENSIONS } from '../config'
import { NODE_TYPES } from '../types'

interface AnimatedEmployeeNodeProps {
  data: AnimatedEmployeeNodeData
}

export const AnimatedEmployeeNode = memo(function AnimatedEmployeeNode({
  data,
}: AnimatedEmployeeNodeProps) {
  const { name, role } = data
  const { width, height } = NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE]

  return (
    <BaseAnimatedNode
      data={data}
      width={width}
      height={height}
      hasSourceHandle={true}
      hasTargetHandle={true}
    >
      <EmployeeContent 
        name={name} 
        role={role}
      />
    </BaseAnimatedNode>
  )
})
