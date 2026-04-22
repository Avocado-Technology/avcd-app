import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import React, { createRef } from 'react'
import { render, act } from '@testing-library/react'
import {
  D3OrgChartWrapper,
  type D3OrgChartWrapperRef,
} from '@/components/org-chart/d3-org-chart-wrapper'
import type { D3OrgChartNode } from '@/components/org-chart/types'

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

const sample: D3OrgChartNode[] = [
  {
    id: 'r',
    parentId: '',
    name: 'Root',
    nodeType: 'organization',
  },
  {
    id: 'c',
    parentId: 'r',
    name: 'Child',
    nodeType: 'store',
    location: 'L',
    employeeCount: 0,
  },
]

describe('D3OrgChartWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GivenValidData_WhenMounted_ThenOrgChartNewIsCalledOnce', async () => {
    render(<D3OrgChartWrapper data={sample} />)
    await act(async () => {
      await Promise.resolve()
    })
    expect(OrgChartConstructor).toHaveBeenCalledTimes(1)
  })

  it('GivenValidData_WhenMounted_ThenChartDataCalledWithFlatArray', async () => {
    render(<D3OrgChartWrapper data={sample} />)
    await act(async () => {
      await Promise.resolve()
    })
    expect(mockData).toHaveBeenCalledWith(sample)
  })

  it('GivenNewDataProp_WhenRerendered_ThenChartDataCalledAgain', async () => {
    const { rerender } = render(<D3OrgChartWrapper data={sample} />)
    await act(async () => {
      await Promise.resolve()
    })
    const next = [...sample, { ...sample[1], id: 'c2', name: 'C2' }]
    rerender(<D3OrgChartWrapper data={next} />)
    await act(async () => {
      await Promise.resolve()
    })
    expect(mockData.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(mockRender.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('GivenRef_WhenHighlightCalled_ThenClearsHighlightThenSetHighlightedCalledOnChart', async () => {
    const ref = createRef<D3OrgChartWrapperRef>()
    render(<D3OrgChartWrapper ref={ref} data={sample} />)
    await act(async () => {
      await Promise.resolve()
    })
    act(() => {
      ref.current?.highlight('c')
    })
    expect(mockClearHighlighting).toHaveBeenCalled()
    expect(mockSetHighlighted).toHaveBeenCalledWith('c')
    expect(mockRender).toHaveBeenCalled()
  })

  it('GivenEmptyDataArray_WhenMounted_ThenChartInitializedWithEmptyArray', async () => {
    render(<D3OrgChartWrapper data={[]} />)
    await act(async () => {
      await Promise.resolve()
    })
    expect(mockData).toHaveBeenCalledWith([])
  })

  it('GivenRef_WhenFitCalled_ThenFitCalledOnChart', async () => {
    const ref = createRef<D3OrgChartWrapperRef>()
    render(<D3OrgChartWrapper ref={ref} data={sample} />)
    await act(async () => {
      await Promise.resolve()
    })
    act(() => {
      ref.current?.fit()
    })
    expect(mockFit).toHaveBeenCalled()
  })

  it('GivenMountedWrapper_WhenRendered_ThenDoesNotThrow', () => {
    expect(() => render(<D3OrgChartWrapper data={sample} />)).not.toThrow()
  })

  it('GivenUnmounted_WhenHighlightCalledAfter_ThenDoesNotThrow', async () => {
    const ref = createRef<D3OrgChartWrapperRef>()
    const { unmount } = render(
      <D3OrgChartWrapper ref={ref} data={sample} />
    )
    await act(async () => {
      await Promise.resolve()
    })
    unmount()
    expect(() => ref.current?.highlight('x')).not.toThrow()
  })
})
