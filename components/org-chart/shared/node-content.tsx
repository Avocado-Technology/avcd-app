import { memo } from 'react'
import { Building2, Store } from 'lucide-react'

/**
 * Shared employee content component
 * Renders avatar with initials, name, and role
 */
interface EmployeeContentProps {
  name: string
  role: string
  className?: string
  avatarClassName?: string
}

export const EmployeeContent = memo(function EmployeeContent({
  name,
  role,
  className = '',
  avatarClassName = '',
}: EmployeeContentProps) {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div
        data-testid="employee-avatar"
        className={`flex items-center justify-center rounded-full ${avatarClassName}`.trim()}
        style={{
          width: '32px',
          height: '32px',
          background: 'var(--g100)',
          color: 'var(--g700)',
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate" style={{ color: 'var(--g900)' }}>
          {name}
        </div>
        <div className="font-mono text-xs truncate" style={{ color: 'var(--g500)' }}>
          {role}
        </div>
      </div>
    </div>
  )
})

/**
 * Shared store content component
 * Renders store icon, name, location, and employee count
 */
interface StoreContentProps {
  name: string
  location: string
  employeeCount: number
  className?: string
}

export const StoreContent = memo(function StoreContent({
  name,
  location,
  employeeCount,
  className = '',
}: StoreContentProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-2 mb-2">
        <div
          data-testid="store-icon"
          className="flex items-center justify-center rounded"
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--g100)',
            color: 'var(--g700)',
            flexShrink: 0,
          }}
        >
          <Store className="w-4 h-4" />
        </div>
        <h4 className="font-medium text-base flex-1" style={{ color: 'var(--g900)' }}>
          {name}
        </h4>
      </div>
      <p className="font-mono text-xs" style={{ color: 'var(--g500)' }}>
        {location}
      </p>
      <p className="font-mono text-xs mt-1" style={{ color: 'var(--g500)' }}>
        {employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}
      </p>
    </div>
  )
})

/**
 * Shared organization content component
 * Renders organization icon and name
 */
interface OrganizationContentProps {
  name: string
  className?: string
}

export const OrganizationContent = memo(function OrganizationContent({
  name,
  className = '',
}: OrganizationContentProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div
        data-testid="organization-icon"
        className="flex items-center justify-center rounded-lg"
        style={{
          width: '40px',
          height: '40px',
          background: 'var(--g100)',
          color: 'var(--g700)',
          flexShrink: 0,
        }}
      >
        <Building2 className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-lg flex-1" style={{ color: 'var(--g900)' }}>
        {name}
      </h3>
    </div>
  )
})
