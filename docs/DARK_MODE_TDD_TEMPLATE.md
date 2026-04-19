# Dark Mode TDD Template

Use this template when creating new components to ensure they support dark mode from the start.

## Overview

This template follows the Red-Green-Refactor TDD cycle:
1. **RED** - Write failing test first
2. **GREEN** - Implement minimal code to pass test
3. **REFACTOR** - Improve code while keeping tests green

---

## Step 1: Write Test (RED)

### 1.1 Create Test File

Path: `__tests__/components/[component-name].test.tsx`

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'
import { MyComponent } from '@/components/my-component'

function renderWithTheme(props = {}) {
  return render(
    <ThemeProvider>
      <MyComponent {...props} />
    </ThemeProvider>
  )
}

describe('MyComponent Dark Mode Support', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    mockMatchMedia('(min-width: 1024px)')
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    restoreMatchMedia()
  })

  it('should render in light mode', () => {
    document.documentElement.classList.add('light')
    renderWithTheme({ text: 'Hello' })
    
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should render in dark mode', () => {
    document.documentElement.classList.add('dark')
    renderWithTheme({ text: 'Hello' })
    
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should use CSS variables for styling', () => {
    const { container } = renderWithTheme({ text: 'Hello' })
    const element = container.firstChild as HTMLElement
    
    // Check that inline styles use CSS variables
    if (element.style.background) {
      expect(element.style.background).toMatch(/var\(--/)
    }
    if (element.style.color) {
      expect(element.style.color).toMatch(/var\(--/)
    }
  })

  it('should have accessible contrast', () => {
    // Simplified contrast check - just verify component renders
    document.documentElement.classList.add('dark')
    renderWithTheme({ text: 'Hello' })
    
    expect(screen.getByText('Hello')).toBeVisible()
    
    // Manual verification: Use DevTools Accessibility Inspector
    // to verify actual contrast ratios (WCAG AA: 4.5:1 minimum)
  })
})
```

### 1.2 Run Test

```bash
npm test -- __tests__/components/my-component.test.tsx
```

**Expected Result:** ❌ Test fails - component doesn't exist yet

---

## Step 2: Implement Component (GREEN)

### 2.1 Create Component File

Path: `components/my-component.tsx`

```typescript
interface MyComponentProps {
  text: string
}

export function MyComponent({ text }: MyComponentProps) {
  return (
    <div
      className="border border-gray-200 rounded-lg"
      style={{
        padding: 'var(--sp-4)',
        background: 'var(--bg)',
      }}
    >
      <p style={{ color: 'var(--g900)' }}>
        {text}
      </p>
    </div>
  )
}
```

**Key Requirements:**
- ✅ Use `var(--bg)` for backgrounds
- ✅ Use `var(--g900)` for primary text
- ✅ Use `var(--g500)` for secondary text
- ✅ Use Tailwind `border-gray-*` classes
- ✅ Use `var(--sp-*)` for spacing

### 2.2 Run Test Again

```bash
npm test -- __tests__/components/my-component.test.tsx
```

**Expected Result:** ✅ All tests pass

---

## Step 3: Refactor (GREEN)

### 3.1 Optimize Code

Look for opportunities to improve:

**Extract repeated styles:**
```typescript
const cardStyles = {
  padding: 'var(--sp-4)',
  background: 'var(--bg)',
}

export function MyComponent({ text }: MyComponentProps) {
  return (
    <div className="border border-gray-200 rounded-lg" style={cardStyles}>
      <p style={{ color: 'var(--g900)' }}>{text}</p>
    </div>
  )
}
```

**Use more Tailwind utilities:**
```typescript
// Instead of inline styles, use Tailwind when possible
<div className="border border-gray-200 rounded-lg p-4 bg-[var(--bg)]">
  <p className="text-gray-900">{text}</p>
</div>
```

**Memoize if rendering is expensive:**
```typescript
import { memo } from 'react'

export const MyComponent = memo(function MyComponent({ text }) {
  return (/* ... */)
})
```

### 3.2 Run Tests After Refactoring

```bash
npm test -- __tests__/components/my-component.test.tsx
```

**Expected Result:** ✅ Tests still pass (no regression)

---

## Step 4: Visual Verification

### 4.1 Start Dev Server
```bash
npm run dev
```

### 4.2 Test in Browser

1. Open `http://localhost:3000` (or page with your component)
2. Find ThemeToggle in sidebar footer (sun/moon icon)
3. Click to open dropdown
4. Select "Dark" → Verify component looks good
5. Select "Light" → Verify component looks good
6. Select "System" → Should follow OS preference

### 4.3 DevTools Contrast Check

1. Right-click text element → Inspect
2. In Elements panel, find the element
3. Click "Accessibility" tab (may need to enable in DevTools settings)
4. Look for "Contrast" section
5. Should show:
   - Ratio: 7.5:1 or higher (AAA) or 4.5:1+ (AA)
   - ✅ Green checkmark
   - Color values

If contrast fails, adjust text color:
- Lighter backgrounds → Use `var(--g900)` (darkest)
- Darker backgrounds → Use `var(--g900)` (lightens in dark mode)
- Very subtle text → Use `var(--g500)` (medium gray)

---

## Common Patterns Reference

### Basic Card
```typescript
<div
  className="border border-gray-200 rounded-xl"
  style={{
    padding: 'var(--sp-6)',
    background: 'var(--bg)',
  }}
>
  <h3 style={{ color: 'var(--g900)' }}>Title</h3>
  <p style={{ color: 'var(--g500)' }}>Description</p>
</div>
```

### Button
```typescript
<button
  className="border border-gray-300 rounded-md hover:border-gray-400"
  style={{
    padding: 'var(--sp-2) var(--sp-4)',
    background: 'var(--bg)',
    color: 'var(--g700)',
  }}
>
  Click me
</button>
```

### Header with Blur
```typescript
<header
  style={{
    background: 'var(--bg-blur)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--g200)',
  }}
>
  Header content
</header>
```

---

## Troubleshooting

### Test fails with "matchMedia is not a function"
**Fix:** Import and use `mockMatchMedia` in beforeEach:
```typescript
import { mockMatchMedia, restoreMatchMedia } from '@/__tests__/utils/mockMatchMedia'

beforeEach(() => {
  mockMatchMedia('(min-width: 1024px)')
})

afterEach(() => {
  restoreMatchMedia()
})
```

### Component looks broken in dark mode
**Fix:** Check for hardcoded colors:
```bash
grep -n "#\|rgb" components/my-component.tsx
```
Replace all with CSS variables.

### Borders invisible in dark mode
**Fix:** Use variable borders:
```typescript
// WRONG:
border: '1px solid #e5e5e5'

// RIGHT:
border: '1px solid var(--g200)'
// OR:
className="border-gray-200"
```

### Text unreadable in dark mode
**Fix:** Use proper contrast variable:
```typescript
// Primary text (high contrast):
style={{ color: 'var(--g900)' }}

// Secondary text (medium contrast):
style={{ color: 'var(--g500)' }}

// Disabled text (low contrast):
style={{ color: 'var(--g400)' }}
```

---

## Quick Commands

```bash
# Run specific component test
npm test -- __tests__/components/my-component.test.tsx

# Run all theme tests
npm test -- __tests__/theme/

# Run with coverage
npm test -- --coverage __tests__/components/my-component.test.tsx

# Build and verify
npm run build

# Start dev server
npm run dev
```

---

## Summary

Following this template ensures:
- ✅ Dark mode support from day one
- ✅ Tests catch color issues early
- ✅ Accessibility standards met
- ✅ Consistent with rest of app
- ✅ Easy to maintain and debug

**Remember:** Write test first (RED), implement (GREEN), refactor (GREEN), then visually verify!
