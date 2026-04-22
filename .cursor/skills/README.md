# Web Development Skills

Comprehensive framework documentation skills for the AVCD web project.

## Overview

This directory contains specialized AI skills that provide in-depth knowledge about the core frameworks and libraries used in this project. These skills help maintain consistency, best practices, and efficient development workflows.

## Available Skills

### Framework & Language Skills (Official — Vercel Labs)

| Skill | Source | Covers |
|-------|--------|--------|
| `next-best-practices` | vercel-labs/next-skills | RSC boundaries, async APIs, route handlers, metadata, suspense, hydration, self-hosting |
| `vercel-react-best-practices` | vercel-labs/agent-skills | 40+ React/Next.js perf rules, eliminating waterfalls, bundle optimization |
| `vercel-react-view-transitions` | vercel-labs/agent-skills | Native View Transitions API in React/Next.js, page animations, shared elements |
| `web-design-guidelines` | vercel-labs/agent-skills | 100+ rules: a11y, focus, forms, animation, typography, images, i18n, dark mode, touch |

### AI & Integrations

| Skill | Source | Covers |
|-------|--------|--------|
| `ai-sdk` | vercel/vercel-plugin | AI SDK v6 patterns, v5→v6 migration, `ToolLoopAgent`, `useChat`, streaming, tool calling |
| `auth0-nextjs` | auth0/agent-skills | `@auth0/nextjs-auth0` v3, App Router, middleware, protected routes, server components |
| `graphql-codegen` | project-specific | `@graphql-codegen/cli` client-preset, operation writing, scalar config, fragment usage |

### Cursor-Native Workflow Skills

| Skill | Covers |
|-------|--------|
| `visual-qa-testing` | Browser screenshot verification after changes |
| `grinding-until-pass` | Autonomous fix-run-check loop until tests/build pass |
| `auto-type-checking` | Run `tsc --noEmit` after file edits to catch type errors immediately |
| `parallel-exploring` | Parallel read-only subagents for fast codebase exploration |
| `writing-tests` | Comprehensive unit + integration tests with mocking and edge cases |

---

### 1. **Apollo Client** (`apollo-client/SKILL.md`)
**GraphQL client for React with Next.js integration**

- **Size**: 1,200+ lines, 50KB
- **Triggers**: "Apollo Client", "GraphQL", "useQuery", "useMutation", "cache"
- **Covers**:
  - Installation & setup (Apollo Client 4.x)
  - Client configuration (Next.js App Router)
  - Authentication integration (Auth0 + JWT)
  - Cache management (InMemoryCache, normalization)
  - Queries & mutations (hooks API)
  - Error handling (GraphQL & network errors)
  - Optimistic UI patterns
  - Testing (MockedProvider, MSW)
  - Code generation (GraphQL Code Generator)
  - Performance optimization

**Key Highlights**:
- Apollo Client 4.x with bundle size optimizations
- Full Auth0 JWT authentication integration
- Normalized caching with pagination support
- TypeScript code generation from GraphQL schema
- Comprehensive testing patterns
- Production-ready error handling

### 2. **shadcn/ui** (`shadcn-ui/SKILL.md`)
**Component system for building accessible UI**

- **Size**: 464 lines, 11KB
- **Triggers**: "add component", "shadcn", "form", "dialog", "button"
- **Covers**:
  - Installation & CLI usage (`npx shadcn@latest add`)
  - 60+ components (forms, overlays, navigation, data display)
  - Composition patterns
  - Accessibility best practices
  - Radix UI integration
  - Tailwind CSS theming
  - TypeScript support

**Key Highlights**:
- Components are copied into your codebase (you own the code)
- Built on Radix UI primitives (WCAG compliant)
- Never manually fetch from GitHub - always use CLI
- Compose, don't reinvent

### 3. **Motion** (`motion/SKILL.md`)
**Production-grade React animation library (formerly Framer Motion)**

- **Size**: 746 lines, 15KB
- **Triggers**: "animate", "motion", "transition", "gesture", "scroll animation"
- **Covers**:
  - Core animation API (`animate`, `initial`, `exit`)
  - Gesture support (hover, tap, drag)
  - Scroll animations (triggered & linked)
  - Layout animations & shared elements
  - SVG path animations
  - Variants system for orchestration
  - Hooks API (`useScroll`, `useTransform`, `useSpring`)
  - Performance optimization

**Key Highlights**:
- Hybrid engine: 120fps native animations + JavaScript fallbacks
- Import from `motion/react` (not `framer-motion`)
- Spring physics for physical properties, tweens for visual
- Supports `whileHover`, `whileTap`, `whileInView`

### 4. **React Flow** (`react-flow/SKILL.md`)
**Node-based UIs, flowcharts, and diagrams**

- **Size**: 961 lines, 20KB
- **Triggers**: "react flow", "nodes", "edges", "flowchart", "diagram"
- **Covers**:
  - Nodes & custom node components
  - **Handles (REQUIRED for connections)**
  - Edges & custom edges
  - Automatic layout (Dagre integration)
  - Hooks & API (`useReactFlow`, `useNodesState`)
  - Event handling
  - Components (Controls, MiniMap, Background)
  - TypeScript support

**Key Highlights**:
- Custom nodes **MUST** include `<Handle>` components
- Package: `@xyflow/react` or `reactflow` v11
- Always import styles: `import '@xyflow/react/dist/style.css'`
- Use controlled flow with `useNodesState` + `useEdgesState`

## How AI Uses These Skills

When you work on features involving these frameworks, Cursor's AI will:

1. **Automatically detect** relevant context from your query
2. **Load the appropriate skill** to access framework-specific knowledge
3. **Follow best practices** documented in the skill
4. **Provide accurate code** based on current framework versions (2026)
5. **Avoid common pitfalls** documented in troubleshooting sections

## Skill Triggers

Skills are automatically activated when you mention certain keywords:

| Skill | Trigger Keywords |
|-------|------------------|
| Apollo Client | "apollo", "graphql", "query", "mutation", "cache", "useQuery", "useMutation" |
| shadcn/ui | "component", "shadcn", "button", "dialog", "form", "card" |
| Motion | "animate", "motion", "transition", "gesture", "scroll", "spring" |
| React Flow | "flow", "node", "edge", "diagram", "flowchart", "graph" |

## Using Skills Manually

To explicitly invoke a skill in your prompt:

```
@/Users/genarionogueira/Documents/avcd/web/.cursor/skills/apollo-client/SKILL.md

Help me set up Apollo Client with Auth0 authentication
```

```
@/Users/genarionogueira/Documents/avcd/web/.cursor/skills/shadcn-ui/SKILL.md

Help me add a dialog component using shadcn/ui best practices
```

Or reference in code comments:
```tsx
// Following shadcn-ui skill: compose components, don't create custom markup
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
```

## Maintenance & Updates

### When to Update Skills

- Framework releases major version updates
- Breaking API changes occur
- New best practices emerge
- Common issues are discovered

### How to Update

1. Research latest framework documentation
2. Update relevant sections in `SKILL.md`
3. Add version notes at bottom of file
4. Test with sample queries to AI

### Version Tracking

Each skill file includes version information:
- **Last Updated**: Date of last modification
- **Framework Version**: Current version covered
- **Package Name**: Correct import path

## Best Practices

### For Developers

1. **Read the skill first** when starting work with a new framework
2. **Reference patterns** from the skill in your code
3. **Update skills** when you discover better patterns
4. **Share knowledge** by adding troubleshooting tips

### For AI Prompts

1. **Be specific** about what you're building
2. **Mention framework names** to trigger skills
3. **Ask for examples** from the skill documentation
4. **Request explanations** of patterns you don't understand

## Examples

### Good Prompts

```
Set up Apollo Client with Auth0 authentication for the AVCD API
```

```
Using shadcn/ui, create a form with Field composition pattern
```

```
Add Motion scroll-triggered animations to our hero section
```

```
Build a React Flow org chart with custom nodes that have multiple handles
```

### Better Prompts

```
Using Apollo Client, create a users list component with pagination,
optimistic UI updates, and proper error handling
```

```
Using shadcn/ui Field composition (from skill), create an accessible 
contact form with validation feedback
```

```
Implement Motion parallax effect on our landing page hero following 
the useScroll + useTransform pattern from the skill
```

```
Create React Flow organization chart with Dagre layout. Each node 
needs left target handle and right source handle for proper connections.
```

## Skill Statistics

| Skill | Lines | Size | Components Covered |
|-------|-------|------|-------------------|
| Apollo Client | 1,200+ | 50KB | Complete API |
| shadcn/ui | 464 | 11KB | 60+ components |
| Motion | 746 | 15KB | 30+ APIs/hooks |
| React Flow | 961 | 20KB | Complete API |
| next-best-practices | 700+ | 30KB | 19 topic files |
| vercel-react-best-practices | 200+ | 8KB | 40+ perf rules |
| vercel-react-view-transitions | 150+ | 5KB | View Transitions API |
| web-design-guidelines | 250+ | 10KB | 100+ UX/a11y rules |
| ai-sdk | 100+ | 4KB | AI SDK v6 complete |
| auth0-nextjs | 100+ | 3KB | Auth0 v3 for Next.js |
| graphql-codegen | 80+ | 3KB | Project codegen config |
| **Total** | **5,000+** | **160KB+** | **300+ concepts** |

## Directory Structure

```
.cursor/skills/
├── README.md                    # This file
│
│   ── Owned skills (full files) ──────────────────────────────────────
├── apollo-client/               # GraphQL client (1,200+ lines, 50KB)
├── avocado-style/               # Design system
├── mobile-design-guidelines/    # Mobile UX
├── motion/                      # Animation library
├── react-flow/                  # Node-based UIs
├── shadcn-ui/                   # Component library
├── ui-engineering/              # React/Next.js UI engineering
│
│   ── Symlinked from .agents/skills/ (installed via npx skills) ──────
├── next-best-practices ->       # Next.js 15 best practices
├── vercel-react-best-practices ->  # React perf rules
├── vercel-react-view-transitions -> # View Transitions API
├── web-design-guidelines ->     # UX/a11y audit rules
├── ai-sdk ->                    # Vercel AI SDK v6
├── auth0-nextjs ->              # Auth0 Next.js v3
├── graphql-codegen ->           # GraphQL Code Generator
├── visual-qa-testing ->         # Browser QA automation
├── grinding-until-pass ->       # Autonomous test fixing
├── auto-type-checking ->        # TypeScript checking
├── parallel-exploring ->        # Parallel codebase exploration
└── writing-tests ->             # Unit/integration test writing
```

## Quick Reference

### Installation Commands

```bash
# Apollo Client
npm install @apollo/client graphql
npm install -D @graphql-codegen/cli @graphql-codegen/typescript

# shadcn/ui
npx shadcn@latest add button
npx shadcn@latest docs button
npx shadcn@latest info --json

# Motion
npm install motion
# Import from: motion/react

# React Flow
npm install @xyflow/react
# Import styles: @xyflow/react/dist/style.css
```

### Common Imports

```tsx
// Apollo Client
import { useQuery, useMutation, gql } from "@apollo/client"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

// shadcn/ui
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

// Motion
import { motion, AnimatePresence } from "motion/react"

// React Flow
import { ReactFlow, Handle, Position } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
```

## Resources

- **Apollo Client**: https://www.apollographql.com/docs/react
- **GraphQL Code Generator**: https://the-guild.dev/graphql/codegen
- **shadcn/ui**: https://ui.shadcn.com/docs
- **Motion**: https://motion.dev/docs
- **React Flow**: https://reactflow.dev/
- **AVCD API**: http://localhost:8000/graphql (Local GraphQL Playground)

---

**Created**: April 2026  
**Project**: AVCD Web Application  
**Maintainer**: Development Team
