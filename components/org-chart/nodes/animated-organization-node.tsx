'use client'

import { memo } from 'react'
import { motion } from 'motion/react'
import { Handle, Position } from 'reactflow'
import { OrganizationContent } from '../shared/node-content'
import type { OrganizationNodeData } from '../types'

interface AnimatedOrganizationNodeProps {
  data: OrganizationNodeData
}

export const AnimatedOrganizationNode = memo(function AnimatedOrganizationNode({
  data,
}: AnimatedOrganizationNodeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
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
    </motion.div>
  )
})
