'use client'

import { useEffect } from 'react'
import { OrgChartError } from '@/components/org-chart/org-chart-error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Organization page error:', error)
  }, [error])

  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--g50)',
    }}>
      <OrgChartError error={error} reset={reset} />
    </main>
  )
}
