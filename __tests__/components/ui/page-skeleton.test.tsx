import { describe, it, expect } from '@jest/globals'
import { render } from '@testing-library/react'
import { PageSkeleton, PageSkeletonWrapper } from '@/components/ui/page-skeleton'

describe('PageSkeleton Component', () => {
  it('should render with full height and width', () => {
    const { container } = render(<PageSkeleton />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('h-full')
    expect(skeleton).toHaveClass('w-full')
  })

  it('should have animate-pulse class', () => {
    const { container } = render(<PageSkeleton />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('should use design system color token', () => {
    const { container } = render(<PageSkeleton />)
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toHaveClass('bg-[var(--g300)]')
  })

  it('should merge custom className with defaults', () => {
    const { container } = render(<PageSkeleton className="opacity-50" />)
    const skeleton = container.firstChild as HTMLElement

    // Should have BOTH custom and default classes (merged, not replaced)
    expect(skeleton).toHaveClass('opacity-50')     // custom
    expect(skeleton).toHaveClass('h-full')         // default
    expect(skeleton).toHaveClass('w-full')         // default
    expect(skeleton).toHaveClass('animate-pulse')  // default
  })

  it('should spread additional props', () => {
    const { container } = render(
      <PageSkeleton data-testid="page-loader" aria-label="Loading content" />
    )
    const skeleton = container.firstChild as HTMLElement

    expect(skeleton).toHaveAttribute('data-testid', 'page-loader')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content')
  })

  it('should render as a single DOM element', () => {
    const { container } = render(<PageSkeleton />)
    expect(container.children).toHaveLength(1)
  })
})

describe('PageSkeletonWrapper Component', () => {
  it('should render with proper ARIA attributes', () => {
    const { getByRole } = render(<PageSkeletonWrapper />)
    const wrapper = getByRole('status')

    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('aria-live', 'polite')
    expect(wrapper).toHaveAttribute('aria-label', 'Loading content')
  })

  it('should hide skeleton from screen readers with aria-hidden', () => {
    const { container } = render(<PageSkeletonWrapper />)
    const skeleton = container.querySelector('.animate-pulse')?.parentElement
    
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
  })

  it('should provide screen reader text with sr-only class', () => {
    const { container } = render(<PageSkeletonWrapper ariaLabel="Loading dashboard" />)
    const srText = container.querySelector('.sr-only')
    
    expect(srText).toBeInTheDocument()
    expect(srText).toHaveTextContent('Loading dashboard')
  })

  it('should have default aria-label', () => {
    const { getByRole } = render(<PageSkeletonWrapper />)
    const wrapper = getByRole('status')
    
    expect(wrapper).toHaveAttribute('aria-label', 'Loading content')
  })

  it('should accept custom aria-label', () => {
    const { getByRole } = render(
      <PageSkeletonWrapper ariaLabel="Loading organization chart" />
    )
    const wrapper = getByRole('status')
    
    expect(wrapper).toHaveAttribute('aria-label', 'Loading organization chart')
  })

  it('should render PageSkeleton as child', () => {
    const { container } = render(<PageSkeletonWrapper />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('should fill parent container', () => {
    const { container } = render(<PageSkeletonWrapper />)
    const wrapper = container.firstChild as HTMLElement

    expect(wrapper).toHaveClass('h-full')
    expect(wrapper).toHaveClass('w-full')
  })

  it('should forward className to wrapper', () => {
    const { container } = render(<PageSkeletonWrapper className="custom-wrapper" />)
    const wrapper = container.firstChild as HTMLElement

    expect(wrapper).toHaveClass('custom-wrapper')
  })
})
