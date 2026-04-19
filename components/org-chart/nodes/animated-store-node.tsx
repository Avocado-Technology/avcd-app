'use client'

import { memo } from 'react'
import { StoreContent } from '../shared/node-content'
import type { AnimatedStoreNodeData } from '../types'
import { BaseAnimatedNode } from './base-animated-node'
import { NODE_DIMENSIONS } from '../config'
import { NODE_TYPES } from '../types'

interface AnimatedStoreNodeProps {
  data: AnimatedStoreNodeData
}

export const AnimatedStoreNode = memo(function AnimatedStoreNode({
  data,
}: AnimatedStoreNodeProps) {
  const { name, location, employeeCount } = data
  const { width, height } = NODE_DIMENSIONS[NODE_TYPES.STORE]

  return (
    <BaseAnimatedNode
      data={data}
      width={width}
      height={height}
      hasSourceHandle={true}
      hasTargetHandle={true}
    >
      <StoreContent 
        name={name}
        location={location}
        employeeCount={employeeCount}
      />
    </BaseAnimatedNode>
  )
})
