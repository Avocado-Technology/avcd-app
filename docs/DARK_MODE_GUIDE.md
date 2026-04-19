# Dark Mode Implementation Guide

## Quick Reference

### DO ✅

- Use CSS variables: `var(--bg)`, `var(--g900)`, `var(--g500)`, etc.
- Use Tailwind mapped colors: `bg-gray-200`, `text-gray-900`, `border-gray-300`
- Test components in both light and dark modes
- Use `var(--bg-blur)` for glassmorphism effects with backdrop blur
- Use semantic variable names that describe purpose, not color

### DON'T ❌

- Don't hardcode colors: `#ffffff`, `rgb(255,255,255)`, `rgba(255,255,255,0.85)`
- Don't use rgba() without CSS variables
- Don't use Tailwind colors that aren't mapped: `bg-white`, `bg-black`, `text-white`, `text-black`
- Don't assume text contrast will work - always test readability

## CSS Variables Reference

| Variable | Light Mode | Dark Mode | Usage |
|----------|-----------|-----------|-------|
| `--bg` | #ffffff | #0a0a0a | Primary backgrounds |
| `--g50` | #fafafa | #171717 | Subtle backgrounds |
| `--g100` | #f5f5f5 | #262626 | Cards, elevated surfaces |
| `--g200` | #e5e5e5 | #404040 | Borders, dividers |
| `--g300` | #d4d4d4 | #525252 | Hover borders |
| `--g400` | #a3a3a3 | #737373 | Disabled text |
| `--g500` | #737373 | #a3a3a3 | Secondary text |
| `--g700` | #404040 | #e5e5e5 | Interactive text |
| `--g900` | #171717 | #fafafa | Primary text, headings |
| `--green` | #22c55e | #22c55e | Signal color (no change) |
| `--yellow` | #eab308 | #eab308 | Warning signal (no change) |
| `--red` | #ef4444 | #ef4444 | Error signal (no change) |
| `--bg-blur` | rgba(255,255,255,0.85) | rgba(10,10,10,0.85) | Glassmorphism |

## Component Checklist

Before marking a component complete, verify:

- [ ] All backgrounds use CSS variables (`var(--bg)`, `var(--g50)`, etc.)
- [ ] All text colors use CSS variables (`var(--g900)`, `var(--g500)`, etc.)
- [ ] All borders use CSS variables (`var(--g200)`, `var(--g300)`, etc.)
- [ ] Test passes in light mode
- [ ] Test passes in dark mode
- [ ] WCAG AA contrast verified (4.5:1 for normal text, 3:1 for large text)
- [ ] Smooth transitions work (150ms ease)
- [ ] No hardcoded colors remain
- [ ] Works with system preference

## Common Patterns

### Background and Text
```tsx
<div style={{ 
  background: 'var(--bg)', 
  color: 'var(--g900)' 
}}>
  Primary content
</div>
```

### Card with Border
```tsx
<div className="border border-gray-200 bg-[var(--bg)]">
  Card content
</div>
```

### Glassmorphism Header
```tsx
<header style={{
  background: 'var(--bg-blur)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid var(--g200)',
}}>
  Header content
</header>
```

### Secondary Text
```tsx
<p style={{ color: 'var(--g500)' }}>
  Subtitle or metadata
</p>
```

### Interactive Elements
```tsx
<button style={{
  background: 'var(--bg)',
  color: 'var(--g700)',
  border: '1px solid var(--g300)',
}}>
  Button
</button>
```

## Tailwind Integration

The following Tailwind classes automatically adapt to dark mode via our CSS variable mapping in `tailwind.config.ts`:

- `bg-gray-50` → `background-color: var(--g50)`
- `bg-gray-100` → `background-color: var(--g100)`
- `bg-gray-200` → `background-color: var(--g200)`
- `text-gray-500` → `color: var(--g500)`
- `text-gray-900` → `color: var(--g900)`
- `border-gray-200` → `border-color: var(--g200)`
- `border-gray-300` → `border-color: var(--g300)`

Use these confidently - they will adapt automatically when theme changes.

## Testing Dark Mode

### Unit Test Template
```typescript
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/theme-provider'

it('should render correctly in dark mode', () => {
  document.documentElement.classList.add('dark')
  
  const { container } = render(
    <ThemeProvider>
      <YourComponent />
    </ThemeProvider>
  )
  
  expect(container).toMatchSnapshot()
})
```

### Visual Testing
1. Open component in browser
2. Use ThemeToggle to switch between light and dark
3. Verify all text is readable
4. Check borders are visible
5. Verify no white flashes or broken colors
6. Use DevTools Accessibility Inspector for contrast ratios

## Troubleshooting

### Issue: Component has white background in dark mode
**Cause:** Hardcoded color or unmapped Tailwind class  
**Fix:** Replace with `var(--bg)` or `bg-gray-*` class

### Issue: Text not readable in dark mode
**Cause:** Wrong contrast variable used  
**Fix:** Use `var(--g900)` for primary text, `var(--g500)` for secondary

### Issue: Borders invisible in dark mode
**Cause:** Using light gray border in both modes  
**Fix:** Use `var(--g200)` or `border-gray-200` which adapts

### Issue: Flash of wrong theme on page load
**Cause:** FOUC - theme class applied after hydration  
**Fix:** Already handled by inline script in `app/layout.tsx` <head>

## Architecture

```
User clicks ThemeToggle
  ↓
setTheme('dark') in ThemeProvider
  ↓
Save to localStorage ('avcd-theme': 'dark')
  ↓
Apply .dark class to <html>
  ↓
CSS variables update
  ↓
All components re-render with new colors
```

## References

- **ThemeProvider:** `components/theme-provider.tsx`
- **Theme Toggle:** `components/theme-toggle.tsx`
- **CSS Variables:** `app/globals.css`
- **Tailwind Config:** `tailwind.config.ts`
- **FOUC Prevention:** `app/layout.tsx` (inline script in <head>)
