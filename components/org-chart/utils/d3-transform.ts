import type { Organization } from '@/lib/mock-org-data'
import type { D3OrgChartNode } from '../types'

/**
 * Flatten Organization → id/parentId rows for d3-org-chart stratify().
 */
export function transformOrgToD3Data(
  org: Organization,
  recentIds: ReadonlySet<string> = new Set(),
  highlightedIds: ReadonlySet<string> = new Set()
): D3OrgChartNode[] {
  const nodes: D3OrgChartNode[] = []

  nodes.push({
    id: org.id,
    parentId: '',
    name: org.name,
    nodeType: 'organization',
    isRecent: recentIds.has(org.id),
    isHighlighted: highlightedIds.has(org.id),
  })

  for (const store of org.stores) {
    nodes.push({
      id: store.id,
      parentId: org.id,
      name: store.name,
      nodeType: 'store',
      location: store.location,
      employeeCount: store.employees.length,
      isRecent: recentIds.has(store.id),
      isHighlighted: highlightedIds.has(store.id),
    })

    for (const employee of store.employees) {
      nodes.push({
        id: employee.id,
        parentId: store.id,
        name: employee.name,
        nodeType: 'employee',
        role: employee.role,
        isRecent: recentIds.has(employee.id),
        isHighlighted: highlightedIds.has(employee.id),
      })
    }
  }

  return nodes
}
