import { describe, it, expect } from '@jest/globals'
import {
  buildOrgSearchIndex,
  filterOrgSearchHits,
} from '@/components/org-chart/utils/org-search'
import { mockOrgData } from '@/lib/mock-org-data'

describe('buildOrgSearchIndex', () => {
  it('includes organization stores and employees', () => {
    const hits = buildOrgSearchIndex(mockOrgData)
    expect(hits.some((h) => h.id === mockOrgData.id)).toBe(true)
    expect(hits.some((h) => h.id === 'store-1')).toBe(true)
    expect(hits.some((h) => h.id === 'emp-1')).toBe(true)
  })
})

describe('filterOrgSearchHits', () => {
  const hits = buildOrgSearchIndex(mockOrgData)

  it('returns all hits for empty query', () => {
    expect(filterOrgSearchHits(hits, '').length).toBe(hits.length)
  })

  it('matches organization name substring', () => {
    const out = filterOrgSearchHits(hits, 'AVCD')
    expect(out.some((h) => h.kind === 'organization')).toBe(true)
  })

  it('matches employee role token', () => {
    const out = filterOrgSearchHits(hits, 'Associate')
    expect(out.some((h) => h.id === 'emp-2')).toBe(true)
  })

  it('matches email substring on employee', () => {
    const out = filterOrgSearchHits(hits, 'jane@')
    expect(out.some((h) => h.id === 'emp-2')).toBe(true)
  })
})
