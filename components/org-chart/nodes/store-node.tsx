import { memo } from 'react'
import { StoreContent } from '../shared/node-content'
import type { StoreNodeData } from '../types'
import { BaseNode } from './base-node'
import { NODE_DIMENSIONS } from '../config'
import { NODE_TYPES } from '../types'

interface StoreNodeProps {
  data: StoreNodeData
}

export const StoreNode = memo(function StoreNode({ data }: StoreNodeProps) {
  const { width, height } = NODE_DIMENSIONS[NODE_TYPES.STORE]

  return (
    <BaseNode
      width={width}
      height={height}
      hasSourceHandle={true}
      hasTargetHandle={true}
    >
      <StoreContent 
        name={data.name}
        location={data.location}
        employeeCount={data.employeeCount}
      />
    </BaseNode>
  )
})
