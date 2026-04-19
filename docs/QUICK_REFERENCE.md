# Avocado Design System — Quick Reference

One-page cheat sheet for building components. For full details, see `.cursor/skills/avocado-style/SKILL.md`.

## Colors

```tsx
// Surface colors
bg-bg          // Pure white (#ffffff)
bg-gray-50     // Inset backgrounds (#fafafa)
bg-gray-100    // Hover states (#f4f4f4)

// Text colors (always use g500+ for readable text)
text-gray-900  // Primary text (#0a0a0a) — 19.1:1 contrast
text-gray-700  // Secondary text (#404040) — 10.7:1
text-gray-500  // Muted text (#737373) — 4.6:1 AA minimum

// Borders
border-gray-200   // Default borders (#e9e9e9)
border-gray-400   // Hover borders (#a3a3a3)
border-gray-500   // Input borders (#737373) — WCAG 3:1 for UI

// Brand (use sparingly!)
bg-green text-white       // CTA buttons
text-green bg-green-light // Status badges
```

## Typography

```tsx
// Headings
className="text-2xl font-semibold tracking-tight"  // Section title
className="text-lg font-medium"                    // Card title

// Body
className="text-base font-normal leading-relaxed" // Paragraph
className="text-base font-light"                  // Hero description

// Labels & metadata
className="text-xs font-medium uppercase tracking-wide font-mono text-gray-500"  // Eyebrow
className="text-sm font-mono text-gray-500"       // Data/timestamps
```

## Spacing (8pt grid — multiples of 4px)

```tsx
p-6    // Card padding (24px)
gap-6  // Grid gap (24px)
space-y-4   // Vertical rhythm (16px)
space-y-8   // Section spacing (32px)

// Common patterns
py-32 px-6        // Section padding
px-4 py-2         // Button padding
```

## Border Radius

```tsx
rounded-sm   // 4px  — badges, tags
rounded-md   // 6px  — buttons, inputs
rounded-lg   // 10px — icons
rounded-xl   // 14px — cards, panels, modals
```

## Animations (Framer Motion)

```tsx
import { motion } from 'framer-motion';
import { 
  fadeInUp,         // Card reveals
  fadeIn,           // Page transitions
  modalVariants,    // Modal entrance
  backdropVariants, // Modal backdrop
  buttonTap,        // Button clicks
  staggerContainer, // List animations
} from '@/lib/motion-variants';

// Simple card reveal
<motion.div {...fadeInUp}>Content</motion.div>

// Button with tap feedback
<motion.button whileTap={buttonTap}>Click</motion.button>

// Staggered grid
<motion.div variants={staggerContainer} initial="initial" animate="animate">
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Timing & Easing

```tsx
import { timings, easings } from '@/lib/motion-variants';

timings.fast      // 150ms — hover states
timings.base      // 250ms — most UI transitions
timings.moderate  // 350ms — modals, panels
timings.slow      // 500ms — page transitions

easings.easeOut   // [0.16, 1, 0.3, 1] — smooth deceleration
easings.snappy    // [0.4, 0, 0.2, 1]  — fast response
easings.spring    // [0.34, 1.56, 0.64, 1] — gentle bounce
```

## Button Variants

```tsx
// Primary
<button className="bg-gray-900 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors active:translate-y-[1px]">
  Primary
</button>

// Secondary
<button className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md font-medium hover:border-gray-400 transition-colors active:translate-y-[1px]">
  Secondary
</button>

// Ghost
<button className="bg-transparent text-gray-500 py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors active:translate-y-[1px]">
  Ghost
</button>

// Green CTA
<button className="bg-green text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity active:translate-y-[1px]">
  Get Started
</button>
```

## Cards

```tsx
<div className="border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
  <p className="text-xs font-mono uppercase tracking-wide text-gray-500 mb-2">
    Eyebrow
  </p>
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-base text-gray-700 leading-relaxed">
    Card body text goes here.
  </p>
  <div className="mt-4 pt-4 border-t border-gray-100">
    Footer content
  </div>
</div>
```

## Badges

```tsx
// Neutral
<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-gray-500 text-xs font-mono rounded-sm border border-gray-200">
  <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
  Inactive
</span>

// Green (active/success)
<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-light text-green text-xs font-mono rounded-sm border border-green-border">
  <span className="w-1.5 h-1.5 rounded-full bg-green" />
  Active
</span>

// Amber (warning)
<span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-light text-amber text-xs font-mono rounded-sm border border-amber-border">
  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
  Warning
</span>
```

## Inputs

```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-2 border border-gray-500 rounded-md text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-black/10 outline-none transition-all"
/>
```

## Loading States

```tsx
// Skeleton card (CSS)
<div className="skeleton h-24 w-full bg-gray-100 rounded" />

// Skeleton with Framer Motion
<motion.div {...fadeIn} className="skeleton h-24 w-full" />

// Spinner
<div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
```

## Navigation

```tsx
<nav className="sticky top-0 z-50 h-14 bg-white/85 backdrop-blur-lg border-b border-gray-200">
  <div className="max-w-container mx-auto px-6 h-full flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green" />
      <span className="font-medium text-gray-900">Avocado</span>
    </div>
    <div className="flex items-center gap-6">
      <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        Features
      </a>
      <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        Pricing
      </a>
    </div>
  </div>
</nav>
```

## Rules to Remember

### ✅ Do
- Use `--g500` or darker for all readable text
- Input borders use `--g500` (WCAG 3:1 for UI components)
- Only animate `transform` and `opacity` (GPU-accelerated)
- Keep animations under 400ms for UI transitions
- Add `:active { transform: translateY(1px); }` to all buttons
- Always respect `prefers-reduced-motion`
- Use spacing values on 8pt grid (multiples of 4px)

### ❌ Don't
- Never use `--g400` or `--g300` for text (fails contrast)
- Never animate `width`, `height`, `top`, `left` (layout thrashing)
- Never use generic CSS easing (`ease`, `ease-in-out`)
- Never add `box-shadow` to layout elements (borders only)
- Never use color alone for status (always add text/icon)
- Never have more than 2-3 simultaneous animations

## Accessibility Checklist

- [ ] All text has 4.5:1 contrast (use g500+ for body text)
- [ ] Input borders have 3:1 contrast (use g500)
- [ ] Focus rings on all interactive elements
- [ ] Status uses color + text/icon (never color alone)
- [ ] `prefers-reduced-motion` respected
- [ ] Animations are interruptible
- [ ] Keyboard navigation works

## Import Paths

```tsx
// Motion variants
import { fadeInUp, modalVariants } from '@/lib/motion-variants';

// Reduced motion hook
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

// shadcn/ui components
import { Button } from '@/components/ui/button';
```

---

**Need more details?**
- Design system: `.cursor/skills/avocado-style/SKILL.md`
- Animation guide: `ANIMATION_SYSTEM_UPGRADE.md`
- Code examples: `components/examples/AnimationExamples.tsx`
