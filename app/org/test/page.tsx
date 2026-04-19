/**
 * Organization Page (Test with Mock Data)
 * 
 * This page uses mock data for testing purposes
 * The main org page uses real GraphQL data
 */

import { AnimatedOrgChart } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'
import 'reactflow/dist/style.css'

export default async function OrganizationTestPage() {
  return (
    <main 
      role="main"
      aria-label="Organization chart test page"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--g50)',
        minHeight: 0,
      }}
    >
      <div 
        role="region"
        aria-label="Organization chart visualization (test with mock data)"
        style={{ 
          flex: 1, 
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ 
          flex: 1, 
          minHeight: 0,
          overflow: 'hidden',
        }}>
          <AnimatedOrgChart data={mockOrgData} />
        </div>
      </div>
    </main>
  )
}
