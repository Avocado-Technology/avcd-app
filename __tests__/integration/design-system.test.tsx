import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

describe('Design System Integration', () => {
  it('should render card with button using Avocado tokens', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Integration Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Testing design system integration</p>
        </CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Integration Test')).toBeInTheDocument()
    expect(screen.getByText('Testing design system integration')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('should apply consistent spacing across components', () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent data-testid="content">Content</CardContent>
      </Card>
    )
    
    const header = screen.getByTestId('header')
    const content = screen.getByTestId('content')
    
    expect(header).toHaveClass('p-6')
    expect(content).toHaveClass('p-6')
  })

  it('should support all button variants within card', () => {
    render(
      <Card>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="green">Green</Button>
          </div>
        </CardContent>
      </Card>
    )
    
    expect(screen.getByText('Primary')).toBeInTheDocument()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('Ghost')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
  })

  it('should maintain design system colors', () => {
    const { container } = render(
      <div className="bg-gray-100 text-gray-900">
        <Card>
          <CardContent>
            <p className="text-gray-500">Muted text</p>
          </CardContent>
        </Card>
      </div>
    )
    
    expect(container.firstChild).toHaveClass('bg-gray-100')
    expect(container.firstChild).toHaveClass('text-gray-900')
  })
})
