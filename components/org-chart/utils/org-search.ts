import type { Organization } from '@/lib/mock-org-data'

export type OrgSearchKind = 'organization' | 'store' | 'employee'

export interface OrgSearchHit {
  id: string
  label: string
  kind: OrgSearchKind
  /** Extra text used for searching and secondary display */
  subtitle?: string
}

const KIND_LABEL: Record<OrgSearchKind, string> = {
  organization: 'Organization',
  store: 'Store',
  employee: 'Employee',
}

export function orgSearchKindLabel(kind: OrgSearchKind): string {
  return KIND_LABEL[kind]
}

/** Flat index for fuzzy lookup across org, stores, and employees */
export function buildOrgSearchIndex(org: Organization): OrgSearchHit[] {
  const hits: OrgSearchHit[] = [
    {
      id: org.id,
      label: org.name,
      kind: 'organization',
    },
  ]

  for (const store of org.stores) {
    hits.push({
      id: store.id,
      label: store.name,
      kind: 'store',
      subtitle: store.location,
    })

    for (const emp of store.employees) {
      hits.push({
        id: emp.id,
        label: emp.name,
        kind: 'employee',
        subtitle: `${emp.role} · ${emp.email}`,
      })
    }
  }

  return hits
}

function haystack(hit: OrgSearchHit): string {
  return [hit.label, hit.subtitle ?? '', hit.kind, KIND_LABEL[hit.kind]]
    .join(' ')
    .toLowerCase()
}

/** Case-insensitive match: every whitespace-separated token must appear in the haystack */
export function filterOrgSearchHits(hits: OrgSearchHit[], query: string): OrgSearchHit[] {
  const raw = query.trim().toLowerCase()
  if (!raw) return hits

  const tokens = raw.split(/\s+/).filter(Boolean)
  return hits.filter((hit) => {
    const h = haystack(hit)
    return tokens.every((t) => h.includes(t))
  })
}
