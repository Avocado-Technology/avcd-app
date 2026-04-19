import { AnimatedOrgChart } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'
import 'reactflow/dist/style.css'

export default async function OrganizationPage() {
  return (
    <main 
      role="main"
      aria-label="Organization chart page"
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
        aria-label="Organization chart visualization"
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
