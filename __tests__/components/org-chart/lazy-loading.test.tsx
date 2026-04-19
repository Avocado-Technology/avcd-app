import { describe, it, expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PageSkeleton } from '@/components/ui/page-skeleton'

describe('Lazy Loading Fallbacks', () => {
  it('AnimatedOrgChart file imports PageSkeleton', () => {
    // Read the source to verify import
    const animatedPath = resolve(__dirname, '../../../components/org-chart/animated-org-chart.tsx')
    const animatedSource = readFileSync(animatedPath, 'utf-8')
    
    expect(animatedSource).toContain('PageSkeleton')
    expect(animatedSource).toContain('@/components/ui/page-skeleton')
  })

  it('ReactFlowCanvas file imports PageSkeleton', () => {
    // Read the source to verify import
    const canvasPath = resolve(__dirname, '../../../components/org-chart/react-flow-canvas.tsx')
    const canvasSource = readFileSync(canvasPath, 'utf-8')
    
    expect(canvasSource).toContain('PageSkeleton')
    expect(canvasSource).toContain('@/components/ui/page-skeleton')
  })

  it('PageSkeleton renders correctly for lazy loading', () => {
    const { container } = render(<PageSkeleton />)
    const skeleton = container.firstChild as HTMLElement
    
    // Verify it has the expected classes for lazy loading fallback
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-full')
    expect(skeleton).toHaveClass('w-full')
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('bg-[var(--g300)]')
  })
})
