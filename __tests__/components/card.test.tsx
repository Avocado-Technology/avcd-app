import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card Component', () => {
  it('should render card with content', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should have correct border styling', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('border-gray-200')
    expect(card).toHaveClass('border')
  })

  it('should use xl border radius', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('rounded-xl')
  })

  it('should not have box-shadow', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    // Ensure no shadow-* classes
    expect(card.className).not.toContain('shadow')
  })

  it('should render card header with title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('should render card description', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card description')).toBeInTheDocument()
  })

  it('should render card footer', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should apply correct padding to card content', () => {
    render(
      <Card>
        <CardContent data-testid="card-content">Content</CardContent>
      </Card>
    )
    const content = screen.getByTestId('card-content')
    expect(content).toHaveClass('p-6')
  })
})
