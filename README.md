# Avocado Web — Frontend Application

Modern, minimal web application built with Next.js 15, following the Avocado Design System.

## 🎨 Design System

This project uses the **Avocado Design System** — a Cursor-inspired ultra-minimal design philosophy:

- **White canvas, one signal color** (green for brand moments only)
- **Weight contrast over font switching** (Geist family, 300-600 weights)
- **Borders only, no shadows** (structural honesty)
- **8pt spacing grid** (all spacing multiples of 4px)
- **Purpose-driven motion** (animations guide attention, not decoration)

**📖 Full Documentation**: `.cursor/skills/avocado-style/SKILL.md`

## 🎬 Animation System

Recently upgraded to industry-leading standards (2026 best practices). Features:

- **Physics-based easing** for natural motion
- **GPU-accelerated** animations (transform + opacity only)
- **WCAG 2.2 compliant** (respects prefers-reduced-motion)
- **11 ready-to-use variants** (modals, dropdowns, cards, etc.)
- **Accessibility-first** with `useReducedMotion` hook

### Quick Start

```tsx
import { motion } from 'framer-motion';
import { fadeInUp, buttonTap, modalVariants } from '@/lib/motion-variants';

// Simple fade-in card
<motion.div {...fadeInUp} className="card">
  Content
</motion.div>

// Button with tap feedback
<motion.button whileTap={buttonTap} className="btn-primary">
  Click me
</motion.button>
```

**📖 Animation Guide**: `ANIMATION_SYSTEM_UPGRADE.md`  
**📦 Component Examples**: `components/examples/AnimationExamples.tsx`

## 🏗️ Architecture

```
web/
├── app/                      # Next.js 15 app directory
│   ├── globals.css          # Design system CSS variables
│   └── ...                  # Pages and layouts
├── components/
│   ├── examples/            # Animation pattern examples
│   └── ui/                  # Reusable UI components (shadcn)
├── lib/
│   ├── motion-variants.ts   # Animation variants and easing curves
│   ├── hooks/
│   │   └── useReducedMotion.ts  # Accessibility hook
│   └── utils.ts             # Helper functions
├── .cursor/
│   └── skills/
│       └── avocado-style/   # Design system documentation
└── tailwind.config.ts       # Design tokens (colors, spacing, radius)
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

**Recommended (Docker + Compose Watch + hot reload):**

```bash
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000) via Docker. Same as `docker compose up --watch` from the `web/` directory.

**Without Docker:**

```bash
npm run dev:local
```

**Turbopack on the host:**

```bash
npm run dev:turbo
```

See [`docs/DOCKER_DEVELOPMENT.md`](docs/DOCKER_DEVELOPMENT.md) for the full Docker guide, env files, and troubleshooting.

### Build

```bash
npm run build
npm start
```

### Infisical secrets (`avcd-web`)

Upload local env vars to the **avcd-web** project on `secrets.avcd.ai` (credentials in `../infisical/.env`):

```bash
make upload-secret              # .env → Infisical dev environment
make validate-secrets           # check deploy-required keys
make help                       # INFISICAL_ENV, INFISICAL_PUSH_FILE, etc.
```

### Deployment (Kamal + Infisical)

| Environment | Trigger | Workflow |
|-------------|---------|----------|
| **Development** | Push to `main` (path filters) | [`.github/workflows/deploy-digitalocean-dev.yml`](.github/workflows/deploy-digitalocean-dev.yml) |
| **Production** | Tag `vX.Y.Z-release` (auto on PR merge) | [`.github/workflows/deploy-digitalocean-prod.yml`](.github/workflows/deploy-digitalocean-prod.yml) |

**Release tags** are created automatically when a PR merges to `main` ([`release-tag-on-merge.yml`](.github/workflows/release-tag-on-merge.yml)):

- Default: **patch** bump (`v1.2.3-release` → `v1.2.4-release`)
- PR title/body: `#minor` or `#major` for larger bumps
- Conventional commits (`feat:`, `fix:`, `BREAKING CHANGE:`) also influence the bump via [step-security/github-tag-action](https://github.com/step-security/github-tag-action)

Manual tag (optional):

```bash
git tag v1.0.0-release && git push origin v1.0.0-release
```

PRs run lint, test, and build via [`.github/workflows/pr-checks.yml`](.github/workflows/pr-checks.yml).

See [`docs/deploy-droplet.md`](docs/deploy-droplet.md) and [`deploy/production/README.md`](deploy/production/README.md) (Compose manual fallback).

## 🎯 Key Features

### Design System Compliance
- ✅ WCAG 2.2 AA accessibility
- ✅ Responsive typography with `clamp()`
- ✅ Dark mode support via `prefers-color-scheme`
- ✅ 8pt spacing grid (4px base unit)
- ✅ Contrast-tested color palette

### Animation Standards
- ✅ Timing constants (100ms → 700ms)
- ✅ Physics-based easing curves
- ✅ Interruptible animations
- ✅ GPU-only properties (no layout thrashing)
- ✅ Reduced motion support

### Performance
- ✅ GPU-accelerated animations
- ✅ Optimized font loading (`display=swap`)
- ✅ No box-shadows on layout elements
- ✅ Minimal bundle size (tree-shakeable exports)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `.cursor/skills/avocado-style/SKILL.md` | Complete design system guide |
| `ANIMATION_SYSTEM_UPGRADE.md` | Animation framework documentation |
| `components/examples/AnimationExamples.tsx` | Copy-paste animation patterns |
| `SHADCN_SETUP_COMPLETE.md` | shadcn/ui component setup |
| [`docs/setup-guides/AUTH0_LOCALHOST_SETUP.md`](docs/setup-guides/AUTH0_LOCALHOST_SETUP.md) | Authentication configuration |

## 🎨 Design Tokens

All design tokens are defined in:
- **CSS Variables**: `app/globals.css`
- **Tailwind Config**: `tailwind.config.ts`
- **Motion Variants**: `lib/motion-variants.ts`

### Color Palette

```css
/* Surfaces */
--bg:    #ffffff   /* Pure white canvas */
--g50:   #fafafa   /* Inset backgrounds */
--g100:  #f4f4f4   /* Hover states */
--g200:  #e9e9e9   /* Default borders */

/* Text */
--g500:  #737373   /* Muted text (4.6:1 contrast) */
--g700:  #404040   /* Secondary text */
--g900:  #0a0a0a   /* Primary text */

/* Brand */
--green: #3a6b45   /* CTA buttons, live states */
```

### Spacing Scale

```css
--sp-1: 0.25rem   /*  4px */
--sp-2: 0.5rem    /*  8px */
--sp-4: 1rem      /* 16px */
--sp-6: 1.5rem    /* 24px — card padding */
--sp-8: 2rem      /* 32px */
--sp-12: 3rem     /* 48px */
--sp-32: 8rem     /* 128px — section padding */
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### GraphQL + Auth (Apollo Client 4)

- **Browser client** (`lib/apollo-client.ts`): `TokenService` coalesces `/api/auth/token` refreshes, proactive JWT refresh from `exp`, silent **one-shot** retry on GraphQL `UNAUTHENTICATED` via the error link, then login redirect if refresh fails. In production, known operations send `X-GraphQL-Document-Hash` (SHA-256 from codegen `persistedDocuments`, exposed on documents as `__meta__.__documentHash`).
- **Server / RSC** (`lib/apollo-server-client.ts`): `getClient()` uses `getApiAccessJwt()` (no browser token hop). In tests, each call returns a fresh client; in other environments the client is memoized per React server request via `cache()`.
- **Codegen**: `npm run codegen` — `codegen.ts` enables `persistedDocuments` (SHA-256; hashes live on each document under `__meta__.__documentHash`). Regenerate after schema changes when the API is reachable.

### Animation Testing Checklist
- [ ] Animations use only `transform` and `opacity`
- [ ] Test with "Reduce motion" enabled
- [ ] Verify 60fps on mobile devices
- [ ] Check animations are interruptible
- [ ] Ensure max 2-3 simultaneous animations

## 🤝 Contributing

### Code Style
- Follow the Avocado Design System (see SKILL.md)
- Use semantic HTML
- Prioritize accessibility
- Test animations with reduced motion
- Keep spacing values on 8pt grid (multiples of 4px)

### Animation Guidelines
- Only animate `transform` and `opacity`
- Use variants from `motion-variants.ts`
- Respect `prefers-reduced-motion`
- Keep durations under 400ms for UI transitions
- Use physics-based easing (never generic CSS `ease`)

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + CSS Variables
- **Animation**: Framer Motion
- **UI Components**: shadcn/ui (customized)
- **Typography**: Geist Sans + Geist Mono
- **Icons**: Lucide React
- **Auth**: Auth0 (`@auth0/nextjs-auth0` v4)
- **Data**: Apollo Client 4 + GraphQL Code Generator (client preset, persisted document hashes)

## 📄 License

[Your License]

---

**Need Help?**
- Design questions → See `.cursor/skills/avocado-style/SKILL.md`
- Animation patterns → See `components/examples/AnimationExamples.tsx`
- Setup issues → Check relevant `*_SETUP.md` files
