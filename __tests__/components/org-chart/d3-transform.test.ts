import { describe, it, expect } from '@jest/globals'
import { transformOrgToD3Data } from '@/components/org-chart/utils/d3-transform'
import type { Organization } from '@/lib/mock-org-data'
import { mockOrgData } from '@/lib/mock-org-data'

describe('transformOrgToD3Data', () => {
  it('GivenValidOrg_WhenTransformed_ThenFirstNodeHasEmptyParentId', () => {
    const rows = transformOrgToD3Data(mockOrgData)
    expect(rows[0]?.parentId).toBe('')
    expect(rows[0]?.id).toBe(mockOrgData.id)
    expect(rows[0]?.nodeType).toBe('organization')
  })

  it('GivenValidOrgWithTwoStores_WhenTransformed_ThenBothStoresHaveOrgAsParentId', () => {
    const rows = transformOrgToD3Data(mockOrgData)
    const stores = rows.filter((r) => r.nodeType === 'store')
    expect(stores).toHaveLength(2)
    stores.forEach((s) => {
      expect(s.parentId).toBe(mockOrgData.id)
    })
  })

  it('GivenValidOrgWithEmployees_WhenTransformed_ThenEmployeeParentIdMatchesStore', () => {
    const rows = transformOrgToD3Data(mockOrgData)
    const emp = rows.find((r) => r.id === 'emp-1')
    expect(emp?.parentId).toBe('store-1')
    expect(emp?.nodeType).toBe('employee')
  })

  it('GivenOrgWithTwoStoresFourEmployees_WhenTransformed_ThenOutputCountIsSevenNodes', () => {
    const org: Organization = {
      id: 'o1',
      name: 'Big Org',
      stores: [
        {
          id: 's1',
          name: 'S1',
          location: 'A',
          employees: [
            { id: 'e1', name: 'E1', role: 'R', email: '' },
            { id: 'e2', name: 'E2', role: 'R', email: '' },
          ],
        },
        {
          id: 's2',
          name: 'S2',
          location: 'B',
          employees: [
            { id: 'e3', name: 'E3', role: 'R', email: '' },
            { id: 'e4', name: 'E4', role: 'R', email: '' },
          ],
        },
      ],
    }
    expect(transformOrgToD3Data(org)).toHaveLength(7)
  })

  it('GivenOrgWithNoStores_WhenTransformed_ThenOutputContainsOnlyRootNode', () => {
    const org: Organization = {
      id: 'only',
      name: 'Only',
      stores: [],
    }
    expect(transformOrgToD3Data(org)).toHaveLength(1)
  })

  it('GivenStoreWithNoEmployees_WhenTransformed_ThenOutputContainsTwoNodes', () => {
    const org: Organization = {
      id: 'root',
      name: 'Root',
      stores: [
        {
          id: 'st',
          name: 'Store',
          location: 'Loc',
          employees: [],
        },
      ],
    }
    const rows = transformOrgToD3Data(org)
    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.nodeType)).toEqual([
      'organization',
      'store',
    ])
  })

  it('GivenRecentIdSet_WhenTransformed_ThenMatchingNodeHasIsRecentTrue', () => {
    const recent = new Set(['store-1'])
    const rows = transformOrgToD3Data(mockOrgData, recent)
    expect(rows.find((r) => r.id === 'store-1')?.isRecent).toBe(true)
  })

  it('GivenHighlightedIdSet_WhenTransformed_ThenMatchingNodeHasIsHighlightedTrue', () => {
    const hi = new Set(['emp-1'])
    const rows = transformOrgToD3Data(mockOrgData, new Set(), hi)
    expect(rows.find((r) => r.id === 'emp-1')?.isHighlighted).toBe(true)
  })

  it('GivenEmptyStoresArray_WhenTransformed_ThenDoesNotThrow', () => {
    expect(() =>
      transformOrgToD3Data({ id: 'x', name: 'X', stores: [] })
    ).not.toThrow()
  })

  it('GivenNodeNotInRecentSet_WhenTransformed_ThenIsRecentIsFalse', () => {
    const rows = transformOrgToD3Data(mockOrgData, new Set(['other']))
    expect(rows.find((r) => r.id === 'store-1')?.isRecent).toBe(false)
  })

  it('GivenNodeNotInHighlightedSet_WhenTransformed_ThenIsHighlightedIsFalse', () => {
    const rows = transformOrgToD3Data(mockOrgData, new Set(), new Set(['other']))
    expect(rows.find((r) => r.id === 'org-1')?.isHighlighted).toBe(false)
  })

  it('GivenOrgWithSpecialCharInName_WhenTransformed_ThenNamePreservedVerbatim', () => {
    const org: Organization = {
      id: 'id1',
      name: 'Foo & Bar <Corp>',
      stores: [],
    }
    expect(transformOrgToD3Data(org)[0]?.name).toBe('Foo & Bar <Corp>')
  })
})
