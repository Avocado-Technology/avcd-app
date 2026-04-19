import { memo } from 'react'
import { OrganizationContent } from '../shared/node-content'
import type { OrganizationNodeData } from '../types'
import { BaseNode } from './base-node'
import { NODE_DIMENSIONS } from '../config'
import { NODE_TYPES } from '../types'

interface OrganizationNodeProps {
  data: OrganizationNodeData
}

export const OrganizationNode = memo(function OrganizationNode({ data }: OrganizationNodeProps) {
  const { width, height } = NODE_DIMENSIONS[NODE_TYPES.ORGANIZATION]

  return (
    <BaseNode
      width={width}
      height={height}
      hasSourceHandle={true}
      hasTargetHandle={false}
    >
      <OrganizationContent name={data.name} />
    </BaseNode>
  )
})
