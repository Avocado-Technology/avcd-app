'use client'

import { memo } from 'react'
import { OrganizationContent } from '../shared/node-content'
import type { OrganizationNodeData } from '../types'
import { BaseAnimatedNode } from './base-animated-node'
import { NODE_DIMENSIONS } from '../config'
import { NODE_TYPES } from '../types'

interface AnimatedOrganizationNodeProps {
  data: OrganizationNodeData
}

export const AnimatedOrganizationNode = memo(function AnimatedOrganizationNode({
  data,
}: AnimatedOrganizationNodeProps) {
  const { width, height } = NODE_DIMENSIONS[NODE_TYPES.ORGANIZATION]

  return (
    <BaseAnimatedNode
      data={{ id: data.id }}
      width={width}
      height={height}
      hasSourceHandle={true}
      hasTargetHandle={false}
    >
      <OrganizationContent name={data.name} />
    </BaseAnimatedNode>
  )
})
