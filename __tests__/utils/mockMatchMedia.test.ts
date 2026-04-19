import { describe, it, expect, afterEach } from '@jest/globals'
import { mockMatchMedia, restoreMatchMedia } from './mockMatchMedia'

describe('mockMatchMedia Utility', () => {
  afterEach(() => {
    restoreMatchMedia()
  })

  it('should mock mobile breakpoint', () => {
    mockMatchMedia('(max-width: 767px)')
    expect(window.matchMedia('(max-width: 767px)').matches).toBe(true)
    expect(window.matchMedia('(min-width: 1024px)').matches).toBe(false)
  })

  it('should mock tablet breakpoint', () => {
    mockMatchMedia('(min-width: 768px) and (max-width: 1023px)')
    expect(window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches).toBe(true)
  })

  it('should mock desktop breakpoint', () => {
    mockMatchMedia('(min-width: 1024px)')
    expect(window.matchMedia('(min-width: 1024px)').matches).toBe(true)
  })
})
