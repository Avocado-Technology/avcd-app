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
      className="rounded-xl transition-colors"
      style={{
        width: '280px',
        minHeight: '80px',
        padding: 'var(--sp-6)',
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
      <Handle type="source" position={Position.Right} />
      <OrganizationContent name={data.name} />
    </motion.div>
  )
})
