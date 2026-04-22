import { describe, it, expect } from '@jest/globals'
import {
  applyVerticalEmployeeLayout,
  type OrgChartFlexNode,
} from '@/components/org-chart/utils/vertical-employee-layout'

function attrs() {
  return {
    siblingsMargin: () => 10,
    childrenMargin: () => 60,
  }
}

describe('applyVerticalEmployeeLayout', () => {
  it('GivenStoreWithTwoEmployees_WhenApplied_ThenEmployeesShareStoreXAndStackVertically', () => {
    const store: OrgChartFlexNode = {
      data: { id: 's', parentId: 'o', name: 'S', nodeType: 'store' },
      x: 400,
      y: 100,
      width: 260,
      height: 110,
      parent: null,
      children: [],
    }

    const e1: OrgChartFlexNode = {
      data: { id: 'e1', parentId: 's', name: 'A', nodeType: 'employee', role: 'r' },
      x: 200,
      y: 300,
      width: 260,
      height: 110,
      parent: store,
    }
    const e2: OrgChartFlexNode = {
      data: { id: 'e2', parentId: 's', name: 'B', nodeType: 'employee', role: 'r' },
      x: 600,
      y: 300,
      width: 260,
      height: 110,
      parent: store,
    }

    store.children = [e2, e1]

    const root: OrgChartFlexNode = {
      data: { id: 'o', parentId: '', name: 'O', nodeType: 'organization' },
      x: 400,
      y: 0,
      width: 260,
      height: 110,
      parent: null,
      children: [store],
    }
    store.parent = root

    applyVerticalEmployeeLayout(root, { root, ...attrs() })

    expect(e1.x).toBe(400)
    expect(e2.x).toBe(400)
    expect(e1.y).toBe(store.y + store.height + 60)
    expect(e2.y).toBe(e1.y + e1.height + 10)
  })

  it('GivenStoreWithOneEmployee_WhenApplied_ThenPositionsUnchanged', () => {
    const store: OrgChartFlexNode = {
      data: { id: 's', parentId: 'o', name: 'S', nodeType: 'store' },
      x: 100,
      y: 50,
      width: 260,
      height: 110,
      parent: null,
    }
    const e1: OrgChartFlexNode = {
      data: { id: 'e1', parentId: 's', name: 'A', nodeType: 'employee' },
      x: 999,
      y: 888,
      width: 260,
      height: 110,
      parent: store,
    }
    store.children = [e1]

    const root: OrgChartFlexNode = {
      data: { id: 'o', parentId: '', name: 'O', nodeType: 'organization' },
      x: 0,
      y: 0,
      width: 260,
      height: 110,
      parent: null,
      children: [store],
    }
    store.parent = root

    applyVerticalEmployeeLayout(root, { root, ...attrs() })

    expect(e1.x).toBe(999)
    expect(e1.y).toBe(888)
  })
})
