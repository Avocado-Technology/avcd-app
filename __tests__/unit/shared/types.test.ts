import { describe, it, expect } from '@jest/globals'
import type {
  OrgNodeType,
  D3OrgChartNode,
} from '@/components/org-chart/types'

describe('Org chart types (d3-org-chart)', () => {
  describe('OrgNodeType', () => {
    it('accepts organization, store, employee literals', () => {
      const org: OrgNodeType = 'organization'
      const store: OrgNodeType = 'store'
      const emp: OrgNodeType = 'employee'
      expect(org).toBe('organization')
      expect(store).toBe('store')
      expect(emp).toBe('employee')
    })
  })

  describe('D3OrgChartNode', () => {
    it('represents root with empty parentId', () => {
      const root: D3OrgChartNode = {
        id: 'o1',
        parentId: '',
        name: 'Corp',
        nodeType: 'organization',
      }
      expect(root.parentId).toBe('')
    })

    it('carries store fields when nodeType is store', () => {
      const row: D3OrgChartNode = {
        id: 's1',
        parentId: 'o1',
        name: 'Shop',
        nodeType: 'store',
        location: 'NYC',
        employeeCount: 3,
      }
      expect(row.location).toBe('NYC')
      expect(row.employeeCount).toBe(3)
    })

    it('carries employee role when nodeType is employee', () => {
      const row: D3OrgChartNode = {
        id: 'e1',
        parentId: 's1',
        name: 'Ada',
        nodeType: 'employee',
        role: 'Lead',
      }
      expect(row.role).toBe('Lead')
    })

    it('allows optional animation flags', () => {
      const row: D3OrgChartNode = {
        id: 'x',
        parentId: '',
        name: 'X',
        nodeType: 'organization',
        isRecent: true,
        isHighlighted: false,
      }
      expect(row.isRecent).toBe(true)
      expect(row.isHighlighted).toBe(false)
    })
  })
})
