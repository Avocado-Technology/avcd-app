import React, { ReactNode } from 'react'
import { ReactFlowProvider } from 'reactflow'

export function ReactFlowWrapper({ children }: { children: ReactNode }) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>
}
