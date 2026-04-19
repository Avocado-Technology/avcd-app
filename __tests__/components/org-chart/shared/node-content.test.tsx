import { render, screen } from '@testing-library/react'
import { EmployeeContent, StoreContent, OrganizationContent } from '@/components/org-chart/shared/node-content'
import { Building2, Store } from 'lucide-react'

describe('EmployeeContent', () => {
  it('should render avatar with correct initials', () => {
    render(<EmployeeContent name="John Doe" role="Manager" />)
    const avatar = screen.getByTestId('employee-avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar.textContent).toBe('JD')
  })

  it('should render name and role correctly', () => {
    render(<EmployeeContent name="Jane Smith" role="Associate" />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Associate')).toBeInTheDocument()
  })

  it('should handle single name', () => {
    render(<EmployeeContent name="Madonna" role="Singer" />)
    const avatar = screen.getByTestId('employee-avatar')
    expect(avatar.textContent).toBe('M')
  })

  it('should handle empty name with default initials', () => {
    render(<EmployeeContent name="" role="Unknown" />)
    const avatar = screen.getByTestId('employee-avatar')
    expect(avatar.textContent).toBe('U')
  })

  it('should limit initials to 2 characters', () => {
    render(<EmployeeContent name="John Paul Smith" role="Manager" />)
    const avatar = screen.getByTestId('employee-avatar')
    expect(avatar.textContent).toBe('JP')
  })

  it('should apply custom className to container', () => {
    const { container } = render(
      <EmployeeContent name="John Doe" role="Manager" className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should apply custom className to avatar when provided', () => {
    render(
      <EmployeeContent 
        name="John Doe" 
        role="Manager" 
        avatarClassName="custom-avatar" 
      />
    )
    const avatar = screen.getByTestId('employee-avatar')
    expect(avatar).toHaveClass('custom-avatar')
  })

  it('should be memoized', () => {
    const { rerender } = render(<EmployeeContent name="John Doe" role="Manager" />)
    const firstRender = screen.getByTestId('employee-avatar')
    
    // Re-render with same props
    rerender(<EmployeeContent name="John Doe" role="Manager" />)
    const secondRender = screen.getByTestId('employee-avatar')
    
    // Should be the same instance (memoized)
    expect(firstRender).toBe(secondRender)
  })
})

describe('StoreContent', () => {
  it('should render store icon, name, location, and employee count', () => {
    render(
      <StoreContent 
        name="Downtown Store" 
        location="New York, NY" 
        employeeCount={5} 
      />
    )
    
    expect(screen.getByTestId('store-icon')).toBeInTheDocument()
    expect(screen.getByText('Downtown Store')).toBeInTheDocument()
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    expect(screen.getByText('5 employees')).toBeInTheDocument()
  })

  it('should show singular "employee" for count of 1', () => {
    render(
      <StoreContent 
        name="Store" 
        location="Location" 
        employeeCount={1} 
      />
    )
    
    expect(screen.getByText('1 employee')).toBeInTheDocument()
  })

  it('should show plural "employees" for count other than 1', () => {
    render(
      <StoreContent 
        name="Store" 
        location="Location" 
        employeeCount={0} 
      />
    )
    
    expect(screen.getByText('0 employees')).toBeInTheDocument()
  })

  it('should apply custom className to container', () => {
    const { container } = render(
      <StoreContent 
        name="Store" 
        location="Location" 
        employeeCount={5} 
        className="custom-class" 
      />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should be memoized', () => {
    const { rerender } = render(
      <StoreContent name="Store" location="Location" employeeCount={5} />
    )
    const firstRender = screen.getByTestId('store-icon')
    
    rerender(<StoreContent name="Store" location="Location" employeeCount={5} />)
    const secondRender = screen.getByTestId('store-icon')
    
    expect(firstRender).toBe(secondRender)
  })
})

describe('OrganizationContent', () => {
  it('should render organization icon and name', () => {
    render(<OrganizationContent name="AVCD Corporation" />)
    
    expect(screen.getByTestId('organization-icon')).toBeInTheDocument()
    expect(screen.getByText('AVCD Corporation')).toBeInTheDocument()
  })

  it('should apply custom className to container', () => {
    const { container } = render(
      <OrganizationContent name="AVCD" className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should be memoized', () => {
    const { rerender } = render(<OrganizationContent name="AVCD" />)
    const firstRender = screen.getByTestId('organization-icon')
    
    rerender(<OrganizationContent name="AVCD" />)
    const secondRender = screen.getByTestId('organization-icon')
    
    expect(firstRender).toBe(secondRender)
  })
})
