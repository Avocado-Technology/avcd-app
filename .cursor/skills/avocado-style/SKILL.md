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

## 7. Motion

```css
/* Hover — fast */
transition: background 0.15s, border-color 0.15s, color 0.15s;

/* Scroll reveal */
.reveal { opacity: 0; transform: translateY(12px);
          transition: opacity 0.55s ease-out, transform 0.55s ease-out; }
.reveal.on { opacity: 1; transform: none; }

/* Delay utilities */
.d1 { transition-delay: 0.06s; }
.d2 { transition-delay: 0.13s; }
.d3 { transition-delay: 0.21s; }
.d4 { transition-delay: 0.30s; }

/* Live pulse */
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* REQUIRED — include in every implementation */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal { opacity: 1; transform: none; }
}
```

Rules: UI transitions 0.15s. Reveals 0.5–0.6s. Max 2–3 active animations on screen at once.

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

- [ ] All visible text uses `--g500` or darker — never `--g400` or lighter for copy
- [ ] Input borders use `--g500` (WCAG 2.1 SC 1.4.11)
- [ ] Focus rings present on all interactive elements
- [ ] Buttons have `:active { transform: translateY(1px); }`
- [ ] Status uses color + text label — never color alone
- [ ] `prefers-reduced-motion` block included in stylesheet
- [ ] Dark mode variables defined
- [ ] Font sizes in `rem` / `clamp()` — no `px` on type
- [ ] Google Fonts URL has `&display=swap`
- [ ] No `box-shadow` on layout elements
- [ ] Loading/async states use `.skeleton` shimmer
- [ ] Spacing values are multiples of 4px
