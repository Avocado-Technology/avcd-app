'use client'

import { memo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Handle, Position } from 'reactflow'
import { StoreContent } from '../shared/node-content'
import type { AnimatedStoreNodeData } from '../types'
import { ANIMATION_SPRING, NODE_ANIMATIONS } from '@/lib/animation-constants'

interface AnimatedStoreNodeProps {
  data: AnimatedStoreNodeData
}

export const AnimatedStoreNode = memo(function AnimatedStoreNode({
  data,
}: AnimatedStoreNodeProps) {
  const { isRecent = false, isHighlighted = false, name, location, employeeCount } = data
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      key={data.id}
      initial={isRecent && !shouldReduceMotion ? NODE_ANIMATIONS.initial : undefined}
      animate={{
        opacity: 1,
        scale: isHighlighted ? 1.05 : 1,
        x: 0,
        y: 0,
        rotate: 0,
      }}
      exit={NODE_ANIMATIONS.exit}
      transition={{
        type: 'spring',
        ...ANIMATION_SPRING,
      }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl transition-colors relative"
      style={{
        width: '220px',
        minHeight: '70px',
        padding: 'var(--sp-5)',
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
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {isRecent && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            NEW
          </span>
        </motion.div>
      )}

      {isHighlighted && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(34, 197, 94, 0.7)",
              "0 0 0 10px rgba(34, 197, 94, 0)",
            ]
          }}
          transition={{ duration: 0.6 }}
        />
      )}

      <StoreContent 
        name={name}
        location={location}
        employeeCount={employeeCount}
        className="relative z-10"
      />
    </motion.div>
  )
})
