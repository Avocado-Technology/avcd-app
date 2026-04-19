# Dark Mode Pre-Implementation Audit

## Hardcoded Colors Found

### Critical - Need Fixing

1. **`app/components/AppTopBar.tsx`**
   - Line 35: `background: "rgba(255,255,255,0.85)"` 
   - Action: Replace with `var(--bg-blur)`

### Intentional - Keep As-Is

2. **`app/components/GoogleLoginGate.tsx`**
   - Google brand colors (SVG fills, button styling)
   - Action: KEEP - These are Google's brand requirements

## Tailwind Color Classes Audit

### Need to Replace (Unmapped Colors)

**UI Components (shadcn/ui):**
- `components/ui/card.tsx`: `bg-white`, `text-gray-900`
- `components/ui/sheet.tsx`: `bg-black/80` (overlay)
- `components/ui/button.tsx`: Multiple instances of `bg-white`, `text-white`, `bg-gray-900`
- `components/examples/AnimationExamples.tsx`: Multiple `bg-white`, `bg-black/20`, `text-white`

**Action:** These will automatically adapt once we add CSS variables in Phase 1, as they use gray-* which maps to var(--g*)

### Already Using CSS Variables (Good)

- `components/org-chart/org-chart-error.tsx`: Uses `bg-[var(--g900)]`
- Most org chart components: Use `var(--bg)`, `var(--g900)`, etc.

## Third-Party Components Check

### React Flow
- **Location:** `components/org-chart/react-flow-canvas.tsx`
- **Current styling:** Uses `var(--bg)` for parent wrapper
- **Action:** Test in dark mode, may need explicit Background color prop

### shadcn/ui Components
- **Components used:** Sidebar, Button, Dropdown, Avatar, Sheet
- **Current:** Uses Tailwind classes that map to CSS variables
- **Action:** Add HSL variables in Phase 1.4 for sidebar components

## Summary

**Total hardcoded colors found:** 1 critical (AppTopBar)
**Total intentional (keep):** Google Login branding colors
**Tailwind classes:** Will auto-adapt via CSS variable mapping
**Third-party:** React Flow needs verification, shadcn/ui needs HSL variables

**Estimated fixes needed:** 
- 1 direct fix (AppTopBar)
- React Flow testing/adjustment (Phase 2.3)
- CSS variables for shadcn/ui (Phase 1.4)
