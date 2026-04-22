/**
 * Organization Page (Test with Mock Data)
 *
 * Auto-running demo: adds/removes nodes and moves employees between stores
 * so layout updates and animations are easy to see.
 */

import { OrgChartTestDemo } from '@/components/org-chart/org-chart-test-demo'

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
        <OrgChartTestDemo />
      </div>
    </main>
  )
}
