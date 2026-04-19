/**
 * Organization Page with GraphQL Data
 * 
 * Client component that fetches organization data from GraphQL API
 * and displays it using the AnimatedOrgChart component
 */

'use client';

import { AnimatedOrgChart } from '@/components/org-chart/animated-org-chart';
import { OrgChartLoading } from '@/components/org-chart/org-chart-loading';
import { OrgChartGraphQLError } from '@/components/org-chart/org-chart-graphql-error';
import { OrgChartNoData } from '@/components/org-chart/org-chart-no-data';
import { useOrganizationTree } from '@/lib/hooks/use-organization-tree';
import 'reactflow/dist/style.css';

export function OrgPageWithData() {
  const { data, loading, error, refetch } = useOrganizationTree();

  // Loading state
  if (loading) {
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
          padding: 'var(--sp-6)',
        }}
      >
        <OrgChartLoading />
      </main>
    );
  }

  // Error state
  if (error) {
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
          padding: 'var(--sp-6)',
        }}
      >
        <OrgChartGraphQLError error={error} refetch={refetch} />
      </main>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
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
          padding: 'var(--sp-6)',
        }}
      >
        <OrgChartNoData />
      </main>
    );
  }

  // Success state - render chart with data
  // Use first organization from the array
  const orgData = data[0];

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
        padding: 'var(--sp-6)',
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
          <AnimatedOrgChart data={orgData} />
        </div>
      </div>
    </main>
  );
}
