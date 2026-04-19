import { describe, it, expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PageSkeleton } from '@/components/ui/page-skeleton'

describe('Lazy Loading Fallbacks', () => {
  it('AnimatedOrgChart dynamically imports React Flow with ssr disabled', () => {
    const animatedPath = resolve(__dirname, '../../../components/org-chart/animated-org-chart.tsx')
    const animatedSource = readFileSync(animatedPath, 'utf-8')

    expect(animatedSource).toContain('dynamic(')
    expect(animatedSource).toContain('reactflow')
    expect(animatedSource).toContain('ssr: false')
  })

  it('ReactFlowCanvas dynamically imports React Flow with ssr disabled', () => {
    const canvasPath = resolve(__dirname, '../../../components/org-chart/react-flow-canvas.tsx')
    const canvasSource = readFileSync(canvasPath, 'utf-8')

    expect(canvasSource).toContain('dynamic(')
    expect(canvasSource).toContain('reactflow')
    expect(canvasSource).toContain('ssr: false')
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
