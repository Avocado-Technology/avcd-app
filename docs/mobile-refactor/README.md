# Mobile bottom navigation (2 favorites + More)

## Feature flag

- `NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV=true` — fixed bottom bar (icon-only, evenly spaced): first two entries from [`lib/mobile-nav-config.tsx`](../../lib/mobile-nav-config.tsx) (favorites) + **Toggle color theme** + **More options** (overflow routes and sign out). Labels are `aria-label` / `title` only—no captions.
- When enabled, **Theme** (header dropdown) and **Sign out** are removed from the top bar below the `lg` breakpoint (see `useMinWidthLg` in [`hooks/use-min-width-lg.ts`](../../hooks/use-min-width-lg.ts)). Color theme is toggled from the bottom bar; **Sign out** stays under **More**.

## Breakpoint matrix (aligns with Tailwind `lg:` = 1024px)

| Feature | Viewport |
|--------|----------|
| Bottom bar + More | `&lt; 1024px` (class `lg:hidden` on [`MobileBottomNav`](../../components/mobile-bottom-nav.tsx)) |
| Header theme + sign out | `≥ 1024px`, or flag off |

## Canonical navigation

- **`APP_NAV_ITEMS`** in [`lib/mobile-nav-config.tsx`](../../lib/mobile-nav-config.tsx) is the single source for sidebar and mobile bar.
- Favorites: `slice(0, 2)`. Overflow (More list): `slice(2)`.
- Empty `APP_NAV_ITEMS`: bottom bar is not rendered.

## Layout testing hooks

- Main content inset: `data-mobile-nav-clearance="true"` on the wrapper in [`mobile-navigation-chrome.tsx`](../../components/mobile-navigation-chrome.tsx) when padding is applied.
- [`BottomToolbar`](../../components/bottom-toolbar.tsx): `data-toolbar-stack="above-nav"` when stacked above the tab bar.

## References

- [Apple Human Interface Guidelines — Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Material Design 3 — Navigation bar](https://m3.material.io/components/navigation-bar/overview)
- [WCAG 2.2 Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## Manual QA

- Open **More options**, confirm focus moves into the sheet; **Escape** closes it.
- With flag on, on a phone or narrow emulator: theme and sign out only under More, not in the header.
- Safe-area: bottom bar clears the home indicator on iOS (padding uses `env(safe-area-inset-bottom)`).
