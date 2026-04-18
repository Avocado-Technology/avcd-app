---
name: avocado-style
description: >
  Design system and visual style guide for Avocado — an AI SaaS product.
  Use this skill whenever building any UI component, card, table, dashboard,
  form, modal, chat interface, app shell, or marketing page for Avocado.
  Triggers on: "create a component", "build a card", "new dashboard", "add a
  table", "Avocado UI", "match the existing style", "make it minimal like
  Cursor", "use the brand style", or any request to build frontend UI for
  the Avocado product. This skill ensures all components share the same
  white-canvas, monochrome-with-green-signal aesthetic and pass WCAG 2.2 AA.
---

# Avocado Design System

A Cursor-inspired ultra-minimal design system. Pure white canvas, single green brand signal, weight contrast does all the hierarchy work. Every component must feel like it belongs to the same calm, precise family. **Read this entire file before writing any component code.**

---

## 1. Design Philosophy

- **White canvas, one signal color.** Background is always white or near-white. Green appears only as a brand moment — the nav dot, live status badges, stat deltas. Never as a fill on large surfaces.
- **Weight contrast over font switching.** One typeface family (Geist). Hierarchy comes from 600 → 500 → 400 → 300, not from switching fonts. Geist Mono for all data and metadata.
- **Borders only, no shadows.** Cards and panels are defined by `1px solid var(--g200)`. Hover darkens the border to `var(--g400)`. No box-shadow on any layout element.
- **8pt spacing grid.** Every spacing value is a multiple of 4px. All layout decisions snap to this system.
- **Quiet motion.** Hover and reveal animations exist but are functional, not decorative. Always implement `prefers-reduced-motion`.

---

## 2. Color Palette — The Foundation

These are the ONLY colors used. Never introduce new colors without updating this file.

```css
:root {
  /* Surfaces */
  --bg:       #ffffff;   /* Page background — pure white */
  --g50:      #fafafa;   /* Inset surfaces, app shell backgrounds */
  --g100:     #f4f4f4;   /* Hover backgrounds, code blocks, skeleton base */
  --g200:     #e9e9e9;   /* Default borders — all cards, panels, dividers */

  /* Text & foreground */
  --g300:     #d4d4d4;   /* Decorative borders only — never text */
  --g400:     #a3a3a3;   /* Decorative/non-text only — never body copy */
  --g500:     #737373;   /* Muted text — metadata, hints, secondary labels */
                         /* Minimum for body-scale text (4.6:1 on white) */
  --g700:     #404040;   /* Secondary text, card bodies */
  --g900:     #0a0a0a;   /* Primary text, headings, primary button BG */

  /* Brand — used sparingly */
  --green:    #3a6b45;   /* CTA buttons, active states, live dots, stat deltas */
  --green-lt: #edf3ee;   /* Badge backgrounds, hover tints on green elements */
  --green-bd: #c5d8c8;   /* Badge borders */

  /* Semantic */
  --amber:    #92400e;
  --amber-lt: #fffbeb;
  --amber-bd: #fde68a;
  --red:      #b91c1c;
  --red-lt:   #fef2f2;
  --red-bd:   #fecaca;
}
```

### Contrast Compliance (WCAG 2.2 AA)

| Token | Hex | Ratio on white | Use |
|-------|-----|----------------|-----|
| --g900 | #0a0a0a | 19.1:1 AAA | Headings, primary body |
| --g700 | #404040 | 10.7:1 AAA | Secondary body text |
| --g500 | #737373 | 4.6:1 AA  | Muted text — minimum for any copy |
| --green | #3a6b45 | 5.1:1 AA | Brand text/icons |
| --g400 | #a3a3a3 | 2.85:1 FAIL | Decorative only — NEVER text |
| --g300 | #d4d4d4 | 1.6:1 FAIL  | Decorative only — NEVER text |

**Rules:**
- Body copy, labels, hints, metadata → `--g500` minimum. Always.
- `--g400` and `--g300` are for borders, decorative bars, swatch backgrounds only.
- Input borders use `--g500` to meet WCAG 2.1 SC 1.4.11 (UI components: 3:1 required).
- Status must never rely on color alone — always pair a dot + text label.

---

## 3. Typography

```css
/* Always include &display=swap */
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

--sans: 'Geist', system-ui, sans-serif;
--mono: 'Geist Mono', monospace;
```

| Role | Weight | Size | Usage |
|------|--------|------|-------|
| Hero | 600 | clamp(3rem, 7vw, 5.5rem) | Hero headings |
| Section title | 600 | 2rem–2.75rem | Page section heads |
| Card title | 500 | 1.125rem | Component headings |
| Body | 400 | 1rem (16px min) | Paragraphs |
| Description | 300 | 1rem | Hero sub-copy, excerpts |
| UI label | 500 | 0.75rem | Buttons, nav |
| Data / meta | Mono 400–500 | 0.6875–0.875rem | IDs, timestamps, versions |
| Eyebrow | Mono 500 | 0.6875rem | Section labels, categories |

**Rules:**
- Heading `letter-spacing`: `-0.03em` to `-0.04em`. Tighter = more premium.
- Body `line-height`: `1.6–1.7`. Never below 1.5.
- All sizes in `rem` or `clamp()`. Never `px` on font sizes.
- Eyebrows: uppercase, `letter-spacing: 0.06–0.1em`, Geist Mono, `--g500`.
- Max 4 distinct font sizes on any single screen.

---

## 4. Spacing — 8pt Grid

All spacing is a multiple of 4px. No exceptions.

```css
--sp-1:  0.25rem;   /*  4px */
--sp-2:  0.5rem;    /*  8px */
--sp-3:  0.75rem;   /* 12px */
--sp-4:  1rem;      /* 16px */
--sp-5:  1.25rem;   /* 20px */
--sp-6:  1.5rem;    /* 24px */
--sp-8:  2rem;      /* 32px */
--sp-10: 2.5rem;    /* 40px */
--sp-12: 3rem;      /* 48px */
--sp-16: 4rem;      /* 64px */
--sp-20: 5rem;      /* 80px */
--sp-24: 6rem;      /* 96px */
--sp-32: 8rem;      /* 128px — section padding */
```

- Internal padding ≤ external margin (Gestalt proximity).
- Section padding: `var(--sp-32) 0`.
- Card padding: `var(--sp-6)` (24px).
- Max container: `1080px`.

---

## 5. Radius

```css
--r-sm:  4px;   /* badges, tags */
--r-md:  6px;   /* buttons, inputs */
--r-lg:  10px;  /* icons */
--r-xl:  14px;  /* cards, panels, tables, app shell */
```

---

## 6. Core Components

### 6.1 Navigation
- Height: 56px. `background: rgba(255,255,255,0.85)`. `backdrop-filter: blur(16px)`.
- `border-bottom: 1px solid var(--g200)`. `position: sticky; top: 0; z-index: 200`.
- Logo: Geist 500, leading green dot (7px circle, `--green`).
- Nav links: 0.875rem, `--g500` → hover `--g900`.

### 6.2 Buttons
All buttons require `:active { transform: translateY(1px); }` — closes the click feedback loop.

```
btn-primary  → bg g900, white text
btn-secondary → bg white, g700 text, g300 border → hover g400 border
btn-ghost    → transparent, g500 text → hover g100 bg
btn-green    → bg green, white text
btn-sm       → 0.75rem, less padding, r-sm
btn-lg       → 1rem, more padding, r-lg
```

### 6.3 Badges
Always use font-family mono. Always pair `.badge-dot` with text — never color alone.

```
badge-neutral → g100 bg, g500 text, g200 border
badge-green   → green-lt bg, green text, green-bd border
badge-amber   → amber-lt bg, amber text, amber-bd border
badge-red     → red-lt bg, red text, red-bd border
```

### 6.4 Cards
`border: 1px solid var(--g200)`. `border-radius: var(--r-xl)`. `padding: var(--sp-6)`.
Hover: `border-color: var(--g400)`. No box-shadow. Ever.

Structure: eyebrow (mono, g500) → title (500, g900) → body (400, g500) → footer (border-top g100).

### 6.5 Inputs
```css
border: 1px solid var(--g500);   /* g500 — WCAG UI component compliance */
border-radius: var(--r-md);
```
Focus: `border-color: var(--g900); box-shadow: 0 0 0 3px rgba(0,0,0,0.08)`.
Placeholder: `color: var(--g400)` — acceptable, placeholder is not body copy.

### 6.6 Data Table
`th` color: `--g500` (not g400). `td` color: `--g900`. Row hover: `--g50`.
Wrapper: `border: 1px solid var(--g200); border-radius: var(--r-xl); overflow: hidden`.

### 6.7 App Shell / Sidebar
Sidebar: `200px`, `border-right: 1px solid var(--g200)`.
Main area: `background: var(--g50)`.
Active item: `border-left: 2px solid var(--g900); background: var(--g100); font-weight: 500`.

### 6.8 Chat Thread
AI avatar: green-lt bg. User avatar: g100 bg. Message text: g700.
Inline code: mono font, g100 bg, g200 border.
Loading state: use `.skeleton` shimmer (see Motion section).

### 6.9 Skeleton / Loading
```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--g100) 25%, var(--g200) 50%, var(--g100) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--r-sm);
}
```

---

## 7. Motion & Animation

### 7.1 Animation Principles

Motion must always serve a purpose — never purely decorative. All animations follow these rules:

- **Purpose-Driven**: Animations must guide attention, explain state, or provide feedback
  - ✅ Button press feedback (`:active` transform)
  - ✅ Loading skeleton shimmer (communicates progress)
  - ✅ Modal fade-in (focuses attention)
  - ❌ Background particles (purely decorative)

- **Interruptible**: Users must never be "locked" waiting for an animation to complete. All animations should be cancelable mid-sequence.

- **Contextual Origin**: Elements should animate from/to meaningful locations. Example: Dropdown menus emerge from their trigger button, not from screen center.

- **Performant**: Only animate `transform` and `opacity` (GPU-accelerated). Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` as these trigger expensive layout recalculations.

- **Accessible**: Always respect `prefers-reduced-motion`. Framer Motion handles this automatically, but CSS animations require explicit media query handling.

### 7.2 Timing Standards

```typescript
// Use these constants from lib/motion-variants.ts
timings = {
  micro: 100,       // Icon state changes, checkbox toggles
  fast: 150,        // Hover transitions, color changes
  base: 250,        // Button clicks, menu reveals
  moderate: 350,    // Slide panels, card flips
  slow: 500,        // Page transitions, modal entrances
  dramatic: 700,    // Hero reveals, onboarding steps
  skeleton: 1500,   // Shimmer animation loop
}
```

**Application Rules**:
- **< 200ms**: User perceives as instant (hover states, toggle switches)
- **200-400ms**: Standard for most UI transitions (modals, dropdowns, card reveals)
- **> 500ms**: Reserve for "moment-making" animations (onboarding, success celebrations)
- **General Rule**: If an animation feels "off," it's likely too long. Keep it as short as possible without losing the effect.

### 7.3 Easing Functions

Never use generic CSS easing (`ease`, `ease-in-out`). Use physics-based curves for natural motion:

```typescript
// Use these from lib/motion-variants.ts
easings = {
  easeOut: [0.16, 1, 0.3, 1],      // Smooth deceleration — for most UI
  snappy: [0.4, 0, 0.2, 1],        // Fast response — feedback/states
  spring: [0.34, 1.56, 0.64, 1],   // Gentle bounce — button clicks
  smooth: [0.65, 0, 0.35, 1],      // Reversible — expand/collapse
  linear: [0, 0, 1, 1],            // Continuous — opacity/color/rotation
}
```

**When to Use Each**:
- **easeOut**: Modal entrances, page transitions, large element movements
- **snappy**: Loading indicators, state toggles, icon transitions
- **spring**: Button interactions, micro-interactions, success feedback (slight overshoot creates satisfaction)
- **smooth**: Accordions, expandable sections (feels natural in both directions)
- **linear**: Only for opacity, color, or continuous rotation (spinners) — prevents uneven blending

### 7.4 CSS Animations (Simple Hover States)

For simple hover/focus states, CSS is more performant than Framer Motion:

```css
/* Hover — fast */
.button {
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

/* Card hover */
.card {
  border: 1px solid var(--g200);
  transition: border-color 0.15s;
}
.card:hover {
  border-color: var(--g400);
}

/* Link hover */
.link {
  color: var(--g500);
  transition: color 0.15s;
}
.link:hover {
  color: var(--g900);
}
```

### 7.5 Framer Motion Patterns (Component Animations)

Use Framer Motion for complex animations involving mounting/unmounting, transforms, or multi-property transitions.

**Card Reveal (Single)**:
```tsx
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion-variants';

<motion.div {...fadeInUp} className="card">
  {content}
</motion.div>
```

**Card Grid (Staggered)**:
```tsx
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion-variants';

<motion.div 
  variants={staggerContainer}
  initial="initial"
  animate="animate"
  className="grid grid-cols-3 gap-6"
>
  {cards.map(card => (
    <motion.div key={card.id} variants={fadeInUp} className="card">
      {card.content}
    </motion.div>
  ))}
</motion.div>
```

**Modal with Backdrop**:
```tsx
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariants, backdropVariants } from '@/lib/motion-variants';

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl p-6 max-w-md">
          {children}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Button with Click Feedback**:
```tsx
import { motion } from 'framer-motion';
import { buttonTap } from '@/lib/motion-variants';

<motion.button whileTap={buttonTap} className="btn-primary">
  Click me
</motion.button>
```

**Dropdown Menu (with contextual origin)**:
```tsx
import { motion } from 'framer-motion';
import { slideInFromTop } from '@/lib/motion-variants';

<motion.div
  variants={slideInFromTop}
  initial="initial"
  animate="animate"
  exit="exit"
  style={{ transformOrigin: 'top' }}
  className="dropdown-menu"
>
  {menuItems}
</motion.div>
```

### 7.6 Performance Requirements

**GPU-Accelerated Properties Only**:
- ✅ Animate: `transform` (translate, scale, rotate), `opacity`
- ❌ Avoid: `width`, `height`, `top`, `left`, `margin`, `padding`

**Example (Width Animation)**:
```tsx
// ❌ BAD — triggers layout recalculation
<motion.div
  initial={{ width: 0 }}
  animate={{ width: 300 }}
/>

// ✅ GOOD — uses transform (GPU-accelerated)
<motion.div
  initial={{ scaleX: 0, transformOrigin: 'left' }}
  animate={{ scaleX: 1 }}
  style={{ width: 300 }}
/>
```

### 7.7 Accessibility (Reduced Motion)

Framer Motion respects `prefers-reduced-motion` automatically, but CSS animations require explicit handling:

```css
/* REQUIRED — include in every stylesheet */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal { opacity: 1; transform: none; }
}
```

**Optional: Manual Control in React**:
```tsx
// Create lib/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Usage in components
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function Card({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...(shouldReduceMotion ? {} : fadeInUp)}
      className="card"
    >
      {children}
    </motion.div>
  );
}
```

### 7.8 Animation Patterns by Use Case

| Use Case | Variant | Duration | Easing | Notes |
|----------|---------|----------|--------|-------|
| **Hover state** | CSS transition | 150ms | `transition: all 0.15s` | Use CSS for simple hover |
| **Button click** | `buttonTap` | 100ms | snappy | `<motion.button whileTap={buttonTap}>` |
| **Card reveal** | `fadeInUp` | 250ms | easeOut | Use with `staggerContainer` for lists |
| **Modal entrance** | `modalVariants` | 350ms | easeOut | Pair with `backdropVariants` |
| **Page transition** | `fadeIn` | 500ms | linear | Full-page navigations |
| **Dropdown menu** | `slideInFromTop` | 200ms | easeOut | Set `transformOrigin` to trigger |
| **Accordion expand** | `expandCollapse` | 350ms | smooth | Height animations need special care |
| **Success feedback** | `scaleIn` or `successCheckmark` | 250ms | spring | Slight overshoot = satisfaction |
| **Loading spinner** | `spinnerVariants` | 1000ms | linear | Continuous, infinite rotation |
| **Skeleton shimmer** | CSS animation | 1500ms | linear | Background gradient animation |

### 7.9 CSS Utility Classes (for legacy/non-React components)

```css
/* Scroll reveal */
.reveal { 
  opacity: 0; 
  transform: translateY(12px);
  transition: opacity 0.55s ease-out, transform 0.55s ease-out; 
}
.reveal.on { 
  opacity: 1; 
  transform: none; 
}

/* Delay utilities (for staggered reveals) */
.d1 { transition-delay: 0.06s; }
.d2 { transition-delay: 0.13s; }
.d3 { transition-delay: 0.21s; }
.d4 { transition-delay: 0.30s; }

/* Live pulse */
@keyframes pulse { 
  0%, 100% { opacity: 1; } 
  50% { opacity: 0.3; } 
}
.pulse { animation: pulse 2s ease-in-out infinite; }
```

### 7.10 Animation Testing Checklist

Before shipping any animated component:

- [ ] **Performance**: Only `transform` and `opacity` animated (check DevTools Performance tab)
- [ ] **Reduced Motion**: Test with OS "Reduce motion" enabled — animations should be minimal or instant
- [ ] **Interruptibility**: Click/tap during animation should work immediately (not blocked)
- [ ] **Duration**: Animation feels responsive, not sluggish (<400ms for most cases)
- [ ] **Easing**: Motion feels natural, not robotic (use custom easings from `motion-variants.ts`)
- [ ] **Purpose**: Animation communicates state/guides attention (not purely decorative)
- [ ] **Mobile**: Animations work smoothly on 60fps mobile devices (test on real hardware)
- [ ] **Max Active**: No more than 2-3 simultaneous animations on screen at once

**Rules Summary**:
- Hover states: 150ms CSS transitions
- Standard UI: 200-350ms with `easeOut`
- Dramatic moments: 500-700ms
- Always respect `prefers-reduced-motion`
- Only animate `transform` and `opacity`

---

## 8. Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg:       #0a0a0a;
    --g50:      #111111;
    --g100:     #1a1a1a;
    --g200:     #262626;
    --g300:     #404040;
    --g400:     #737373;
    --g500:     #a3a3a3;
    --g700:     #d4d4d4;
    --g900:     #fafafa;
    --green-lt: rgba(58, 107, 69, 0.18);
    --green-bd: rgba(58, 107, 69, 0.35);
    /* --green stays #3a6b45 */
  }
}
```

---

## 9. Compliance Checklist

Before delivering any component:

### Accessibility & Contrast
- [ ] All visible text uses `--g500` or darker — never `--g400` or lighter for copy
- [ ] Input borders use `--g500` (WCAG 2.1 SC 1.4.11 — 3:1 minimum for UI components)
- [ ] Focus rings present on all interactive elements
- [ ] Status indicators use color + text label — never color alone

### Typography & Spacing
- [ ] Font sizes in `rem` / `clamp()` — no `px` on type
- [ ] Google Fonts URL has `&display=swap`
- [ ] Spacing values are multiples of 4px (8pt grid)
- [ ] Body text `line-height` is 1.6-1.7 minimum

### Visual Design
- [ ] No `box-shadow` on layout elements (borders only)
- [ ] Dark mode variables defined
- [ ] Max 4 distinct font sizes on any single screen
- [ ] Cards use `border-radius: var(--r-xl)` and `padding: var(--sp-6)`

### Interaction & Motion
- [ ] Buttons have `:active { transform: translateY(1px); }` or `whileTap={buttonTap}`
- [ ] Hover transitions are 150ms (CSS) or use `timings.fast` (Framer Motion)
- [ ] Animations only use `transform` and `opacity` (GPU-accelerated)
- [ ] `prefers-reduced-motion` media query included in CSS
- [ ] Loading/async states use `.skeleton` shimmer or skeleton variants
- [ ] No more than 2-3 simultaneous animations on screen
- [ ] Animations are interruptible (users not locked waiting)

### Performance
- [ ] No layout-triggering animations (`width`, `height`, `top`, `left`)
- [ ] Modals use `AnimatePresence` for exit animations
- [ ] Staggered lists use `staggerContainer` variant (60ms between items)
