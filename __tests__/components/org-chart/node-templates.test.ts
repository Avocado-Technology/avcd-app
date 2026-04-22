import { describe, it, expect } from '@jest/globals'
import {
  escapeHtml,
  renderNodeContent,
  renderOrganizationNodeContent,
} from '@/components/org-chart/node-templates'
import type { D3OrgChartNode } from '@/components/org-chart/types'

const baseOrg = (over: Partial<D3OrgChartNode> = {}): D3OrgChartNode => ({
  id: '1',
  parentId: '',
  name: 'Org',
  nodeType: 'organization',
  ...over,
})

const baseStore = (over: Partial<D3OrgChartNode> = {}): D3OrgChartNode => ({
  id: 's1',
  parentId: 'o1',
  name: 'Store',
  nodeType: 'store',
  location: 'NYC',
  employeeCount: 2,
  ...over,
})

const baseEmp = (over: Partial<D3OrgChartNode> = {}): D3OrgChartNode => ({
  id: 'e1',
  parentId: 's1',
  name: 'Jane Doe',
  nodeType: 'employee',
  role: 'Lead',
  ...over,
})

describe('node-templates', () => {
  it('GivenOrganizationNode_WhenRendered_ThenContainsOrgName', () => {
    const html = renderOrganizationNodeContent(baseOrg({ name: 'ACME' }))
    expect(html).toContain('ACME')
  })

  it('GivenStoreNode_WhenRendered_ThenContainsStoreNameAndLocation', () => {
    const html = renderNodeContent(
      baseStore({ name: 'Shop', location: 'Boston' })
    )
    expect(html).toContain('Shop')
    expect(html).toContain('Boston')
  })

  it('GivenEmployeeNode_WhenRendered_ThenContainsNameAndRole', () => {
    const html = renderNodeContent(baseEmp({ name: 'Bob', role: 'Mgr' }))
    expect(html).toContain('Bob')
    expect(html).toContain('Mgr')
  })

  it('GivenEmployeeWithTwoWordName_WhenRendered_ThenInitialsAreTwoUpperCaseChars', () => {
    const html = renderNodeContent(baseEmp({ name: 'Jane Doe' }))
    expect(html).toContain('JD')
  })

  it('GivenNodeWithIsRecentTrue_WhenRendered_ThenOutputContainsIsRecentClass', () => {
    const html = renderNodeContent(baseOrg({ isRecent: true }))
    expect(html).toContain('avcd-org-node--recent')
  })

  it('GivenNodeWithIsHighlightedTrue_WhenRendered_ThenOutputContainsIsHighlightedClass', () => {
    const html = renderNodeContent(baseOrg({ isHighlighted: true }))
    expect(html).toContain('avcd-org-node--highlighted')
  })

  it('GivenEmployeeWithSingleWordName_WhenRendered_ThenInitialsUseFirstTwoLetters', () => {
    const html = renderNodeContent(baseEmp({ name: 'Alice' }))
    expect(html).toContain('AL')
  })

  it('GivenNameWithHtmlBrackets_WhenRendered_ThenBracketsAreEscaped', () => {
    const html = renderNodeContent(baseOrg({ name: '<script>' }))
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('GivenNameWithAmpersand_WhenRendered_ThenAmpersandIsEscaped', () => {
    const html = renderNodeContent(baseOrg({ name: 'A & B' }))
    expect(html).toContain('A &amp; B')
  })

  it('GivenUnknownNodeType_WhenRendered_ThenDoesNotThrow', () => {
    const bad = {
      ...baseOrg(),
      nodeType: 'bogus' as D3OrgChartNode['nodeType'],
    }
    expect(() => renderNodeContent(bad as D3OrgChartNode)).not.toThrow()
    const html = renderNodeContent(bad as D3OrgChartNode)
    expect(html.length).toBeGreaterThan(0)
    expect(escapeHtml('"x"')).toContain('&quot;')
  })
})
