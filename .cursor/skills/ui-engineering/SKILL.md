---
name: ui-engineering
description: >-
  Production-grade UI engineering best practices for React 19 + Next.js 15 (App Router) +
  TypeScript + Tailwind + Apollo Client. Covers component architecture, code reuse,
  bug prevention, state management, testing, accessibility, performance, and error handling.
  Use when building any UI component, page, hook, or feature — or when reviewing existing
  frontend code for quality, correctness, and maintainability.
  Triggers on: "build a component", "create a page", "add a feature", "refactor this",
  "review this code", "how should I structure", "is this good practice", or any frontend
  implementation task in the web project.
---

# UI Engineering Best Practices

This skill guides production-quality UI development in the Avocado web project: **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Apollo Client 4 · Radix UI / shadcn · Auth0**.

> **Core principle**: Write UI code as if you will not be available to fix it. Every component should be readable by a stranger, testable in isolation, and safe to change without fear.

---

## Research Foundation

| Authority | Contribution Applied |
|-----------|---------------------|
| Brad Frost — *Atomic Design* (atomicdesign.bradfrost.com) | Component hierarchy: atoms → molecules → organisms → templates → pages |
| Feature-Sliced Design (feature-sliced.design) | Layer-based folder architecture, directional dependencies, public APIs per slice |
| Kent C. Dodds — Testing Trophy + React Testing Library | Integration-first testing, test behavior not implementation, `*ByRole` query priority |
| Frontend Memory Leak Study — 500 repos (stackinsight.dev) | 86% of repos have missing cleanup; `useEffect` without return, missing `removeEventListener` |
| BugsJS / TU Munich — JavaScript Bug Taxonomy | Most common JS bug categories: logic errors, type errors, async errors, API misuse |
| arXiv:2601.21186 — TypeScript Bug Study | Modern TS failures cluster in: tooling/config, API misuse, async error handling |
| WCAG 2.2 (W3C, Oct 2023) | 9 new criteria; AA is regulatory minimum; focus visibility, dragging alternatives |
| React 19 Compiler (2025) | Automatic memoization at build time; manual `useMemo`/`useCallback` now anti-pattern |
| Stryker Mutation Testing | Line coverage alone misses 36% of boundary bugs |
| DORA 2024 | Small batches + robust testing = elite delivery; AI without testing fundamentals decreases stability |

---

## 1. Component Architecture

### The Hierarchy (Atomic Design applied to Next.js)

| Level | Location | Description | Examples |
|-------|----------|-------------|---------|
| **Atoms** | `app/components/ui/` | Single-purpose, zero business logic | `Button`, `Input`, `Badge`, `Avatar`, `Spinner` |
| **Molecules** | `app/components/` | 2–4 atoms combined for one task | `SearchBar`, `FormField`, `UserAvatar`, `AlertBanner` |
| **Organisms** | `app/components/` or feature `_components/` | Complex sections with their own state | `DataTable`, `NavMenu`, `FilterPanel` |
| **Templates** | `app/*/layout.tsx` | Page shells and wrappers | `DashboardLayout`, `AuthLayout` |
| **Pages** | `app/*/page.tsx` | Concrete pages with real data | `OrgPage`, `FinancePage` |

**Rule**: Atoms have no side effects. Molecules have no data fetching. Only Organisms and Pages may connect to Apollo or Auth.

---

### Component Responsibility Model

Every component fits exactly one tier:

```
┌─────────────────────────────────────────────┐
│  Page Component (app/*/page.tsx)            │
│  - Server Component by default              │
│  - Owns data fetching (Apollo, fetch)       │
│  - No UI logic, no local state              │
│  - Passes data down as props                │
└────────────────┬────────────────────────────┘
                 │ props
┌────────────────▼────────────────────────────┐
│  Feature Component (*-client.tsx)           │
│  - "use client" boundary                    │
│  - Owns interaction state only             │
│  - Composes organisms                       │
│  - Handles loading/error/empty states       │
└────────────────┬────────────────────────────┘
                 │ props
┌────────────────▼────────────────────────────┐
│  Organism / Molecule (components/)          │
│  - Pure UI, driven entirely by props        │
│  - No data fetching, no auth               │
│  - Fully testable with RTL in isolation    │
└─────────────────────────────────────────────┘
```

---

### Component Design Rules

**Rule 1 — Single Responsibility (SRP)**
A component does one thing from the user's perspective. When you need a comment like "this part handles X and this part handles Y," split it.

```tsx
// BAD: One component does too much
export function UserProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  useEffect(() => { fetchUser(); fetchPosts(); }, []);
  return (/* renders user card AND post list AND edit form */);
}

// GOOD: Split concerns
export function UserProfilePage() {      // fetches data
  return <UserProfileView user={user} />;
}
export function UserProfileView({ user }) { // renders user card only
  return <Card>...</Card>;
}
```

**Rule 2 — Composition over Inheritance**
React components are functions. Use composition (children, render props, compound components) instead of extending base classes.

```tsx
// BAD: Inheritance mindset
function AdminButton extends Button { ... }

// GOOD: Composition
function AdminButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="destructive" {...props}>
      <ShieldIcon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
```

**Rule 3 — Stable Component API**
Props define the contract. Follow this structure:

```tsx
interface ComponentProps {
  // 1. Required data props first
  id: string;
  label: string;
  // 2. Optional data props with defaults
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  // 3. Behavioral callbacks
  onChange?: (value: string) => void;
  onSubmit?: (data: FormData) => void;
  // 4. Escape hatches last
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}
```

**Rule 4 — No Magic Props**
Never pass opaque objects where specific props work. Each prop should have a clear type and purpose.

```tsx
// BAD
<Widget config={{ a: 1, b: 'x', c: true }} />

// GOOD
<Widget title="x" isActive={true} count={1} />
```

**Rule 5 — Component Size Gate**
If a component exceeds **150 lines**, it has more than one responsibility. Extract.

---

## 2. Project Structure

Adapted from **Feature-Sliced Design** for Next.js App Router colocation:

```
web/
└── app/
    ├── components/          ← Shared atoms + molecules (no business logic)
    │   └── ui/              ← Raw design system primitives (shadcn level)
    ├── [feature]/           ← One folder per domain/route
    │   ├── page.tsx         ← Server Component entry (data fetching)
    │   ├── [feature]-client.tsx  ← "use client" wrapper with state
    │   ├── _components/     ← Feature-private organisms (not shared)
    │   ├── _hooks/          ← Feature-private custom hooks
    │   └── error.tsx        ← Error boundary for this route
    ├── lib/                 ← Pure utilities and API clients
    │   ├── apollo/          ← Apollo Client setup
    │   └── utils/           ← Pure functions, no React
    └── hooks/               ← Shared custom hooks across features
```

**Dependency Rule** (enforced by ESLint import rules):
- `app/[feature]/_components/` → may import from `app/components/` and `app/lib/`
- `app/components/` → may NOT import from `app/[feature]/`
- Features may NOT import from sibling features directly — only through shared layers

---

## 3. Custom Hooks

Custom hooks are **behavior modules**, not mini-components. Extract logic into a hook when:
- The same `useState` + `useEffect` combination appears in more than one component
- A component's non-rendering logic exceeds 20 lines
- Business logic should be testable without rendering a component

### Hook Design Contract

Every hook has four parts. Define them before writing any code:

```
Input:   What props/params does the hook accept?
State:   What does it manage internally?
Effects: What side effects does it have? (and what cleans them up)
Output:  What does it return? (use an object, not a tuple, for >2 values)
```

```tsx
// Good hook with explicit contract
function useAsyncData<T>(query: DocumentNode, variables: Record<string, unknown>) {
  // Input: GraphQL query + variables
  // State: data, loading, error
  // Effect: Apollo query subscription (cleaned up by Apollo automatically)
  // Output: explicit named object

  const { data, loading, error } = useQuery<T>(query, { variables });
  return { data: data ?? null, isLoading: loading, error };
}
```

### Memory Leak Prevention (500-repo study)

**The #1 bug in 86% of surveyed repositories**: missing cleanup in `useEffect`.

```tsx
// REQUIRED pattern for every useEffect with a subscription/listener/timer
useEffect(() => {
  const controller = new AbortController();
  const handler = (event: Event) => { /* ... */ };

  window.addEventListener('resize', handler);
  const timerId = setInterval(poll, 5000);
  const sub = observable.subscribe(handler);

  // ALWAYS return cleanup
  return () => {
    window.removeEventListener('resize', handler);
    clearInterval(timerId);
    sub.unsubscribe();
    controller.abort();
  };
}, [dependencies]);
```

**Memory leak checklist for every `useEffect`**:
- [ ] `addEventListener` → has matching `removeEventListener` in cleanup
- [ ] `setInterval`/`setTimeout` → has `clearInterval`/`clearTimeout`
- [ ] `.subscribe()` → has `.unsubscribe()` or stop handle in cleanup
- [ ] `fetch` → uses `AbortController`; abort in cleanup
- [ ] WebSocket → closed in cleanup

---

## 4. State Management

### The Colocation Principle

> Keep state as close as possible to where it's used. Lift state only as far as it needs to go.

```
Component-local state  →  useState
Sibling sharing        →  Lift to parent
Sub-tree sharing       →  React Context (narrow provider)
Cross-feature / cache  →  Apollo Client cache or Zustand
Server state           →  Apollo useQuery (never replicate in useState)
```

### State Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Prop drilling (>2 levels)** | Tight coupling, hard to refactor | Context or lift to closest common ancestor |
| **Duplicating server state** | Stale data, cache inconsistency | Use Apollo cache as the truth; don't `useState(queryResult)` |
| **Global state for UI state** | Modal open/closed in Redux | Keep ephemeral UI state in the component |
| **Complex nested state object** | Hard to update safely | Split into multiple `useState` calls |
| **Direct state mutation** | Subtle bugs, no re-render | Always return new objects/arrays |
| **Syncing state** | Infinite loops, stale closures | Derive from existing state; don't sync |

### Context Usage Rules

```tsx
// Good: Narrow context scoped to one feature
const OrgContext = createContext<OrgContextValue | null>(null);

// Provide as low in the tree as needed
export function OrgProvider({ orgId, children }: { orgId: string; children: React.ReactNode }) {
  // ...
}

// Never expose raw context — always use a hook guard
export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be used within OrgProvider');
  return ctx;
}
```

---

## 5. TypeScript Discipline

### Strict Mode (Required)

```json
// tsconfig.json — all flags must be on
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Rules

| Rule | BAD | GOOD |
|------|-----|------|
| No `any` | `const data: any = response` | `const data: User = response as User` or proper type guard |
| No non-null assertion `!` without guard | `user!.name` | `user?.name ?? 'Unknown'` |
| Discriminated unions over booleans | `{ loading: boolean; data?: T; error?: E }` | `{ status: 'loading' } \| { status: 'success'; data: T } \| { status: 'error'; error: E }` |
| Explicit return types on hooks and utils | `function useData() {` | `function useData(): DataResult {` |
| No `as` casts except at API boundaries | `value as string` everywhere | Type guards: `if (typeof value === 'string')` |

### Type-Safe API Boundary

All GraphQL types are **generated** by `graphql-codegen`. Never hand-write response types:

```tsx
// BAD: hand-written type may drift from schema
interface OrgResponse { id: string; name: string; }

// GOOD: generated type is always in sync
import { OrgFragment } from '@/lib/graphql/generated';
```

Always validate external data at the boundary (API responses, localStorage, URL params) before passing into typed functions. TypeScript doesn't protect runtime data from untyped sources.

---

## 6. Styling with Tailwind + Design Tokens

### Design Token System

All visual decisions live in `tailwind.config.ts`. Never hardcode colors, spacing, or radii in components:

```tsx
// BAD
<div className="bg-[#0f172a] p-[14px] rounded-[6px]">

// GOOD — uses design tokens
<div className="bg-background p-3.5 rounded-md">
```

### Component Variant Pattern (CVA)

Use `class-variance-authority` for component variants instead of conditional className logic:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

### Tailwind Rules

- Use `cn()` (clsx + tailwind-merge) for conditional class merging — never string concatenation
- Prefer Tailwind utilities over custom CSS; add custom CSS only for things Tailwind can't express
- Group Tailwind classes by concern: `layout` → `sizing` → `spacing` → `typography` → `color` → `interaction`
- Never use `!important` utilities unless overriding a third-party library

---

## 7. Testing Strategy (Testing Trophy)

Based on **Kent C. Dodds' Testing Trophy** — integration tests are the primary investment:

```
         /\
        /E2E\         ← Few; full flows in browser (Playwright)
       /------\
      / Integr \      ← MOST tests here; components + hooks + API together
     /----------\
    /  Unit      \    ← Pure functions, complex algorithms
   /--------------\
  /     Static     \  ← TypeScript + ESLint (free, runs on every keystroke)
 /==================\
```

### What to Test at Each Level

**Static (TypeScript + ESLint)**
- Type correctness (free with `strict: true`)
- Missing return values, unhandled promise rejections (`@typescript-eslint/no-floating-promises`)
- Accessibility lint (`eslint-plugin-jsx-a11y`)

**Unit Tests (Jest)**
- Pure utility functions in `lib/utils/`
- Complex business logic extracted from components
- GraphQL cache operations
- Custom hook logic (with `renderHook`)

**Integration Tests (Jest + RTL)**
- Full component rendering with realistic props
- User interactions with `userEvent`
- Loading / error / empty states
- Form submission flows
- Apollo mock responses with `MockedProvider`

**E2E Tests (Playwright)**
- Critical user journeys: auth flow, org creation, key actions
- Only for flows that span multiple pages

---

### React Testing Library Rules

**Query Priority** (use in this order — higher = more confidence):
1. `*ByRole` — accessible role (button, heading, textbox); tests a11y simultaneously
2. `*ByLabelText` — form labels
3. `*ByPlaceholderText` — inputs with placeholder
4. `*ByText` — visible text content
5. `*ByTestId` — **last resort only**; add `data-testid` only when no semantic query works

**Core Rules**:
```tsx
// BAD: Testing implementation details
expect(component.state.isLoading).toBe(false);
expect(wrapper.find(Spinner).exists()).toBe(false);

// GOOD: Testing user-visible behavior
expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
expect(screen.getByText('Dashboard')).toBeVisible();

// BAD: fireEvent (synthetic only)
fireEvent.click(button);

// GOOD: userEvent (full browser-like simulation)
await userEvent.click(button);
await userEvent.type(input, 'hello@example.com');
```

**Async testing**:
```tsx
// BAD: arbitrary wait
await new Promise(r => setTimeout(r, 500));

// GOOD: wait for user-visible outcome
await screen.findByText('Saved successfully');
await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
```

**Test structure** (Arrange → Act → Assert):
```tsx
it('GivenValidCredentials_WhenSubmittingLoginForm_ThenRedirectsToDashboard', async () => {
  // Arrange
  const mocks = [mockLoginMutation({ success: true })];
  render(<LoginForm />, { wrapper: createWrapper(mocks) });

  // Act
  await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

  // Assert
  expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
});
```

**Accessibility testing** (use `jest-axe` — already installed):
```tsx
it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 8. Error Handling

### Error Boundary Placement Strategy

Do NOT wrap the entire app in one boundary. Place boundaries at logical failure units:

```tsx
// app/[feature]/error.tsx — Next.js built-in error boundary per route
'use client';
export default function FeatureError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**When to add a nested error boundary**:
- Payment/billing forms (failure should not crash the page)
- Data-heavy widgets (chart, table) that can fail independently
- Third-party embedded components

### Async Error Patterns

Error boundaries do NOT catch async errors. Handle them explicitly:

```tsx
// Pattern 1: Apollo query errors
const { data, loading, error } = useQuery(MY_QUERY);
if (error) return <ErrorState message={error.message} />;

// Pattern 2: Mutations with error display
const [mutate, { loading, error }] = useMutation(MY_MUTATION);
// Show error inline, not as a thrown exception

// Pattern 3: Unhandled promise rejections (global safety net)
// In _app.tsx or layout.tsx:
useEffect(() => {
  const handler = (event: PromiseRejectionEvent) => {
    console.error('Unhandled rejection:', event.reason);
    // Report to monitoring
  };
  window.addEventListener('unhandledrejection', handler);
  return () => window.removeEventListener('unhandledrejection', handler);
}, []);
```

### Loading / Error / Empty State Pattern

Every component that fetches data must handle all three states explicitly:

```tsx
function OrgList({ orgId }: { orgId: string }) {
  const { data, loading, error } = useQuery(GET_ORGS);

  if (loading) return <OrgListSkeleton />; // Not a spinner — a skeleton
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!data?.orgs?.length) return <EmptyState message="No organizations yet" />;

  return <OrgListView orgs={data.orgs} />;
}
```

**Never** render `undefined` silently. Every branch must be handled.

---

## 9. Performance

### Memoization Rules (React 19+)

**React 19's compiler auto-memoizes safe cases**. Manual memoization is often premature optimization and can cause bugs.

| Hook | Use when | Don't use when |
|------|---------|----------------|
| `useMemo` | Expensive calculation (sort >1000 items, heavy transform) | Simple math, string ops, any value that changes every render anyway |
| `useCallback` | Passing a function to a memoized child with `React.memo` | The child is not memoized; the function is recreated rarely |
| `React.memo` | Pure component that renders frequently with same props | Almost any component — profile first |

**Golden rule**: Measure before optimizing. Use React DevTools Profiler to identify actual bottlenecks. Never add `useMemo`/`useCallback` "just in case."

### Lazy Loading

```tsx
// Route-level code splitting (automatic in Next.js App Router)
// Component-level for heavy components
const ReactFlow = dynamic(() => import('reactflow'), {
  ssr: false,
  loading: () => <FlowSkeleton />,
});

// Images: always use Next.js Image
import Image from 'next/image';
<Image src={src} alt={alt} width={800} height={600} priority={isAboveFold} />
```

### Anti-Patterns That Kill Performance

| Anti-Pattern | Effect | Fix |
|-------------|--------|-----|
| Inline object/array props | New reference every render → child always re-renders | Define outside component or use `useMemo` |
| Overly broad Context provider | Every consumer re-renders on any state change | Split contexts by concern; use `useMemo` for value |
| Network waterfall | Parent fetches → child renders → child fetches | Parallel fetch at page level; pass as props |
| Missing Suspense boundaries | Full-page blocking | Wrap async sections in `<Suspense>` with skeleton |

---

## 10. Accessibility (WCAG 2.2 AA)

### Non-Negotiable Requirements

Every component must meet these:

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigable | All interactive elements reachable and activatable via keyboard |
| Focus visible | Focus ring never obscured (WCAG 2.4.11 new in 2.2); use `focus-visible:ring-2` |
| Color contrast | 4.5:1 for normal text, 3:1 for large text (use browser DevTools or axe) |
| Alt text | All `<img>` have descriptive `alt`; decorative images have `alt=""` |
| Form labels | Every input has an associated `<label>` or `aria-label` |
| Error identification | Error messages identify the field and describe how to fix it |
| Semantic HTML | Use `<button>` not `<div onClick>`, `<nav>` not `<div>`, headings in order |
| Screen reader support | Use Radix UI primitives (already installed) — they ship full ARIA |

### Accessibility Checklist per Component

```
- [ ] All interactive elements are <button>, <a>, or have role + keyboard handler
- [ ] Focus order follows visual order
- [ ] No color as the only means of conveying information
- [ ] Touch targets are ≥44×44px on mobile
- [ ] All icons have aria-label or are aria-hidden with accompanying text
- [ ] Forms use fieldset/legend for grouped inputs
- [ ] Dynamic content changes are announced via aria-live
- [ ] jest-axe test passes (no violations)
```

---

## 11. Security

### XSS Prevention

```tsx
// NEVER use dangerouslySetInnerHTML with user content
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌

// Render user content as text only
<div>{userInput}</div> // ✅ — React escapes by default

// If HTML is needed: sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHtml) }} />
```

### Token Storage

```
// NEVER store tokens in localStorage or sessionStorage
localStorage.setItem('token', jwt);  // ❌ — XSS-accessible

// Auth0 nextjs-auth0 uses httpOnly cookies automatically ✅
// Access tokens are retrieved via /api/auth/token endpoint, never exposed to JS
```

### Common Frontend Security Rules

- No secrets or API keys in client-side code — use Next.js Server Actions or API routes
- Never trust URL parameters — validate and sanitize before use
- Use `next/headers` for reading cookies in Server Components (never `document.cookie` in client)
- Content Security Policy headers set at the Next.js config level
- Dependency audit: `npm audit` in CI; lock file committed

---

## 12. Code Review Checklist

Before submitting a PR and before approving one, check every item:

### Component Quality
- [ ] Component has a single, clear responsibility
- [ ] Component is ≤150 lines (excluding types and styles)
- [ ] No prop drilling beyond 2 levels
- [ ] All branches (loading, error, empty, success) are handled
- [ ] No `any` types; no non-null assertions without guard
- [ ] No inline objects/arrays in JSX that would cause unnecessary re-renders
- [ ] No hardcoded strings visible to users (use constants or i18n keys)

### Hooks & State
- [ ] Every `useEffect` has a cleanup function (or explicitly documented why not needed)
- [ ] State is colocated as low as possible
- [ ] Server state (API data) is NOT duplicated in `useState`
- [ ] Custom hooks are named `use*` and have documented input/output contracts

### Testing
- [ ] New behavior has at least one integration test (RTL)
- [ ] Tests query by role/label, not by className or component internals
- [ ] Loading state tested; error state tested; happy path tested
- [ ] `jest-axe` test present for new visual components

### TypeScript
- [ ] `strict: true` has no new suppression comments (`// @ts-ignore`, `// @ts-expect-error`)
- [ ] All generated GraphQL types used for API responses
- [ ] New environment variables typed in `env.d.ts`

### Performance & Memory
- [ ] No new `useMemo`/`useCallback` without a profiler-measured justification
- [ ] Heavy components are lazy-loaded
- [ ] Images use `next/image`

### Security
- [ ] No secrets in client-side code
- [ ] User input is never passed to `dangerouslySetInnerHTML` without sanitization
- [ ] Auth token never stored in localStorage

### Accessibility
- [ ] All interactive elements are keyboard operable
- [ ] Color contrast passes 4.5:1 (check with DevTools)
- [ ] `jest-axe` test passes

---

## 13. Anti-Patterns Catalog

A quick reference of what NOT to do and why:

| Anti-Pattern | Why It's a Problem | Fix |
|-------------|-------------------|-----|
| **God component** (>200 lines, handles fetching + state + rendering) | Impossible to test, tightly coupled, breaks SRP | Split into container + presentation + custom hook |
| **Prop drilling (3+ levels)** | Any intermediate refactor breaks all consumers | Context or compose with children |
| **useEffect for derived state** | `useEffect(() => setX(a + b), [a, b])` creates extra renders | `const x = a + b` — derive directly |
| **Syncing state from props** | `useEffect(() => setState(props.value), [props.value])` | Controlled component pattern or `key` reset |
| **Missing error boundary** | One widget crash kills the page | Wrap every route and independent feature widget |
| **Missing cleanup in useEffect** | Memory leak; 86% of repos affected | Always return cleanup |
| **`any` as escape hatch** | Defeats TypeScript's protection | Type guard, `unknown` + narrowing, or proper type |
| **`useCallback` everywhere** | Adds memory overhead; doesn't help unless child is memoized | Profile first, then memoize the bottleneck |
| **Context for everything** | Global re-renders on every state change | Colocate; use Context only for genuinely global state |
| **Test implementation details** | Tests break on refactor even when behavior is correct | Test user-visible behavior with RTL |
| **`getByTestId` as first query** | Bypasses accessibility; adds maintenance burden | Use `getByRole` or `getByLabelText` first |
| **Unstable component identity** | Defining component inside render → remount on every render | Define all components at module level |
| **Direct DOM manipulation** | `document.querySelector` in React code | Use refs (`useRef`) or React-controlled state |
| **Server state in useState** | Stale data, duplicated cache | Use Apollo `useQuery` as the single source of truth |

---

## 14. Component Quality Score

Rate any component or hook on a 0–100 scale before merging. Use this in code review.

| Dimension | PASS | WARN | FAIL | Points |
|-----------|------|------|------|--------|
| **Single Responsibility** | Does one thing; ≤150 lines | Does 1.5 things; 150–250 lines | Does many things; >250 lines | 15 |
| **Type Safety** | No `any`, full coverage | 1–2 `any` with justification | Multiple `any`, missing types | 15 |
| **State Hygiene** | Colocated, no duplication, no sync antipattern | Minor issues | Server state in useState, wide context | 15 |
| **Error Handling** | All states explicit (loading/error/empty/success) | Loading + success only | No error/empty handling | 15 |
| **Memory Safety** | All `useEffect` cleanups present | 1 missing cleanup (minor) | Multiple missing cleanups | 15 |
| **Test Coverage** | ≥1 RTL integration test; jest-axe test | Unit test only | No tests | 15 |
| **Accessibility** | WCAG 2.2 AA; semantic HTML; jest-axe passes | Mostly accessible; minor gaps | Inaccessible; keyboard traps | 10 |

**Total: X / 100**

| Score | Verdict |
|-------|---------|
| 85–100 | **Ship it** — production-ready |
| 65–84 | **Ship with note** — minor cleanup before next PR |
| 40–64 | **Request changes** — fix before merge |
| 0–39 | **Block** — fundamental issues; rework required |

---

## Quick Reference

### "Should I make this a component?"
Yes if:
- The same JSX appears in 2+ places
- The JSX block exceeds 30 lines in a larger component
- The logic has a clear, nameable responsibility

### "Should I make this a custom hook?"
Yes if:
- The same `useState`/`useEffect` logic appears in 2+ components
- The component's non-rendering logic exceeds 20 lines
- The logic needs to be tested independently

### "Should I add this to global state?"
Only if:
- The data is used by components in different route subtrees
- The data comes from the server (use Apollo cache, not useState)

### "Is this component too big?"
Yes if any of:
- It's over 150 lines
- It handles data fetching AND renders UI
- You need more than 3 `useState` calls
- You can't name it with one noun ("UserCard", "OrgTable")
