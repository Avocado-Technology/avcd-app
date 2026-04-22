import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import React, { createRef, act } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { transformOrgToD3Data } from '@/components/org-chart/utils/d3-transform'
import { AnimatedOrgChart, AnimatedOrgChartRef } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'
import type { Organization } from '@/lib/mock-org-data'

const mockRender = jest.fn(function mockRender(this: unknown) {
  return this
})
const mockData = jest.fn(function mockData(this: unknown) {
  return this
})
const mockSetHighlighted = jest.fn(function mockSH(this: unknown) {
  return this
})
const mockFit = jest.fn(function mockFit(this: unknown) {
  return this
})
const mockClearHighlighting = jest.fn(function mockClearHL(this: unknown) {
  return this
})

const OrgChartConstructor = jest.fn().mockImplementation(() => ({
  container: jest.fn().mockReturnThis(),
  data: mockData,
  initialExpandLevel: jest.fn().mockReturnThis(),
  nodeWidth: jest.fn().mockReturnThis(),
  nodeHeight: jest.fn().mockReturnThis(),
  layout: jest.fn().mockReturnThis(),
  compact: jest.fn().mockReturnThis(),
  nodeContent: jest.fn().mockReturnThis(),
  render: mockRender,
  clearHighlighting: mockClearHighlighting,
  setHighlighted: mockSetHighlighted,
  fit: mockFit,
}))

jest.mock('d3-org-chart', () => ({
  OrgChart: OrgChartConstructor,
}))

describe('AnimatedOrgChart (d3)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GivenValidOrgData_WhenRendered_ThenChartMounts', async () => {
    render(<AnimatedOrgChart data={mockOrgData} />)
    await waitFor(() => {
      expect(screen.getByTestId('org-chart-layout-root')).toBeInTheDocument()
    })
  })

  it('GivenMockOrg_ThenTransformerProducesOrgStoreAndEmployeeIds', () => {
    const rows = transformOrgToD3Data(mockOrgData, new Set(), new Set())
    expect(rows.some((n) => n.id === mockOrgData.id)).toBe(true)
    expect(rows.some((n) => n.id === 'store-1')).toBe(true)
    expect(rows.some((n) => n.id === 'emp-1')).toBe(true)
  })

  it('GivenOrgWithNoStores_WhenRendered_ThenEmptyStateIsShown', () => {
    const empty: Organization = { ...mockOrgData, stores: [] }
    render(<AnimatedOrgChart data={empty} />)
    expect(screen.getByText('No organization data')).toBeInTheDocument()
  })

  it('GivenRef_WhenMarkAsRecentCalled_ThenDoesNotThrow', async () => {
    const ref = createRef<AnimatedOrgChartRef>()
    render(<AnimatedOrgChart ref={ref} data={mockOrgData} />)
    await waitFor(() =>
      expect(screen.getByTestId('org-chart-layout-root')).toBeInTheDocument()
    )
    expect(() =>
      act(() => {
        ref.current?.markAsRecent('store-1')
      })
    ).not.toThrow()
  })

  it('GivenRef_WhenHighlightNodeCalled_ThenDoesNotThrow', async () => {
    const ref = createRef<AnimatedOrgChartRef>()
    render(<AnimatedOrgChart ref={ref} data={mockOrgData} />)
    await waitFor(() =>
      expect(screen.getByTestId('org-chart-layout-root')).toBeInTheDocument()
    )
    expect(() =>
      act(() => {
        ref.current?.highlightNode('emp-1')
      })
    ).not.toThrow()
  })

  it('GivenRef_WhenClearAllCalled_ThenDoesNotThrow', async () => {
    const ref = createRef<AnimatedOrgChartRef>()
    render(<AnimatedOrgChart ref={ref} data={mockOrgData} />)
    await waitFor(() =>
      expect(screen.getByTestId('org-chart-layout-root')).toBeInTheDocument()
    )
    act(() => {
      ref.current?.markAsRecent('store-1')
      ref.current?.highlightNode('emp-1')
    })
    expect(() =>
      act(() => {
        ref.current?.clearAll()
      })
    ).not.toThrow()
  })

  it('GivenOrgWithEmptyStores_WhenRendered_ThenShowsEmptyNotCrash', () => {
    const empty: Organization = { ...mockOrgData, stores: [] }
    render(<AnimatedOrgChart data={empty} />)
    expect(screen.queryByTestId('org-chart-layout-root')).not.toBeInTheDocument()
  })

  it('GivenNewOrgData_WhenDataPropChanges_ThenTransformerReflectsNewRoot', async () => {
    const { rerender } = render(<AnimatedOrgChart data={mockOrgData} />)
    await waitFor(() =>
      expect(screen.getByTestId('org-chart-layout-root')).toBeInTheDocument()
    )
    const next: Organization = {
      ...mockOrgData,
      id: 'org-2',
      name: 'Other Org',
    }
    rerender(<AnimatedOrgChart data={next} />)
    await waitFor(() => {
      const rows = transformOrgToD3Data(next, new Set(), new Set())
      expect(rows[0]?.id).toBe('org-2')
      expect(rows[0]?.name).toBe('Other Org')
    })
  })

  it('GivenRef_WhenFocusNodeCalled_ThenSetHighlightedOnChart', async () => {
    const ref = createRef<AnimatedOrgChartRef>()
    render(<AnimatedOrgChart ref={ref} data={mockOrgData} />)
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    act(() => {
      ref.current?.focusNode('emp-2')
    })
    expect(mockClearHighlighting).toHaveBeenCalled()
    expect(mockSetHighlighted).toHaveBeenCalledWith('emp-2')
    expect(mockRender).toHaveBeenCalled()
  })
})
