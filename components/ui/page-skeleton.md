# PageSkeleton Component

Full-page loading skeleton for page-level loading states.

## When to Use

- **Full-page views** (dashboards, charts, reports) ✅
- **Small widgets/cards** - Use `Skeleton` instead ❌
- **Inline content** - Use `Skeleton` instead ❌

## Components

### PageSkeleton

Minimal full-page skeleton without accessibility wrapper.

```tsx
import { PageSkeleton } from '@/components/ui/page-skeleton'

if (loading) {
  return <PageSkeleton />
}
```

### PageSkeletonWrapper

Includes ARIA attributes for screen readers. **Preferred for production use.**

```tsx
import { PageSkeletonWrapper } from '@/components/ui/page-skeleton'

if (loading) {
  return <PageSkeletonWrapper ariaLabel="Loading dashboard" />
}
```

## Usage Examples

### Basic Usage

```tsx
import { PageSkeleton } from '@/components/ui/page-skeleton'

function MyPage() {
  const { data, loading } = useData()
  
  if (loading) return <PageSkeleton />
  
  return <div>{data}</div>
}
```

### With Accessibility (Recommended)

```tsx
import { PageSkeletonWrapper } from '@/components/ui/page-skeleton'

function DashboardPage() {
  const { data, loading } = useDashboard()
  
  if (loading) {
    return <PageSkeletonWrapper ariaLabel="Loading dashboard data" />
  }
  
  return <Dashboard data={data} />
}
```

### With Custom Styles

```tsx
<PageSkeleton className="opacity-50" />
```

### In Next.js loading.js

```tsx
// app/dashboard/loading.tsx
import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function Loading() {
  return <PageSkeleton />
}
```

### In Full Page Layout

```tsx
<main className="flex-1">
  {loading ? <PageSkeletonWrapper /> : <Content />}
</main>
```

## Parent Container Requirements

Parent MUST have defined height:

- `flex: 1` (recommended for page layouts)
- `h-full` or `h-screen`
- Explicit height value (e.g., `height: 500px`)

**Without parent height, skeleton collapses to 0.**

```tsx
// ✅ Good - parent has flex: 1
<main style={{ flex: 1 }}>
  {loading ? <PageSkeleton /> : <Content />}
</main>

// ❌ Bad - parent has no height
<div>
  {loading ? <PageSkeleton /> : <Content />}
</div>
```

## Design Tokens

- **Color:** `var(--g100)` 
  - Light theme: `#f5f5f5`
  - Dark theme: `#262626`
- **Animation:** `animate-pulse` (respects `prefers-reduced-motion`)

## Accessibility

### WCAG 2.1 AA Compliant

The `PageSkeletonWrapper` component follows WCAG best practices:

- Skeleton is hidden from screen readers (`aria-hidden="true"`)
- Screen reader text provides meaningful status (`sr-only` class)
- `role="status"` announces loading state
- `aria-live="polite"` for non-intrusive updates

### Reduced Motion Support

The skeleton animation automatically respects the user's `prefers-reduced-motion` setting via global CSS.

## Migration from OrgChartSkeleton

Replace:

```tsx
import { OrgChartSkeleton } from '@/components/org-chart/org-chart-skeleton'
```

With:

```tsx
import { PageSkeleton } from '@/components/ui/page-skeleton'
```

`OrgChartSkeleton` remains available for backward compatibility but is deprecated.

## API Reference

### PageSkeleton Props

Extends `React.HTMLAttributes<HTMLDivElement>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes (merged with defaults) |
| `...props` | `HTMLAttributes` | - | All standard div props are supported |

### PageSkeletonWrapper Props

Extends `React.HTMLAttributes<HTMLDivElement>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string` | `"Loading content"` | Accessible label for screen readers |
| `className` | `string` | - | Additional CSS classes for wrapper |
| `...props` | `HTMLAttributes` | - | All standard div props are supported |

## Examples in the Codebase

- [`components/org-chart/org-chart-loading.tsx`](../org-chart/org-chart-loading.tsx) - Organization chart loading state
- [`components/org-chart/animated-org-chart.tsx`](../org-chart/animated-org-chart.tsx) - Lazy loading fallback
- [`components/org-chart/react-flow-canvas.tsx`](../org-chart/react-flow-canvas.tsx) - Canvas lazy loading

## Related Components

- [`Skeleton`](./skeleton.tsx) - Composable skeleton for cards, lists, and inline content
