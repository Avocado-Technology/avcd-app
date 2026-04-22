/**
 * Federated Logout Tests
 *
 * Verifies that ALL sign-out entry points in the app:
 *   1. Use `?federated` in their logout href so Auth0 also ends the Google
 *      IdP session — preventing silent re-authentication after logout.
 *   2. Use a native <a> tag (server-side navigation) rather than Next.js
 *      client-side routing, as recommended by Auth0 docs.
 *
 * Affected components:
 *   - AppTopBar        (top-bar "Sign out" button on desktop)
 *   - SidebarFooter    (user-menu dropdown in sidebar)
 *   - MobileMoreSheet  (bottom sheet overflow menu on mobile)
 *
 * Background:
 *   Without `?federated`, clicking Sign out clears the Auth0 session but
 *   leaves the Google IdP session alive. The next login click silently
 *   re-authenticates via Google without showing the login page, making
 *   it appear as if logout never happened.
 */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// ─── AppTopBar ──────────────────────────────────────────────────────────────

jest.mock("@/hooks/use-min-width-lg", () => ({
  useMinWidthLg: () => true,
}))

jest.mock("@/lib/feature-flags", () => ({
  isMobileBottomNavEnabled: () => false,
}))

jest.mock("@/components/mobile-nav", () => ({
  MobileNav: () => <div data-testid="mobile-nav" />,
}))

jest.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
}))

jest.mock("next/link", () => {
  const MockNextLink = ({
    href,
    children,
    prefetch: _prefetch,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    prefetch?: boolean
    [key: string]: unknown
  }) => (
    <a href={href} data-next-link="true" {...rest}>
      {children}
    </a>
  )
  MockNextLink.displayName = "MockNextLink"
  return MockNextLink
})

// ─── SidebarFooter ──────────────────────────────────────────────────────────

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => {
    if (asChild && typeof children === "object" && children !== null) {
      return children as React.ReactElement
    }
    return <button>{children}</button>
  },
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div role="menu">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => {
    if (asChild && typeof children === "object" && children !== null) {
      return children as React.ReactElement
    }
    return <div role="menuitem">{children}</div>
  },
}))

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AvatarImage: ({ alt }: { alt: string }) => <img alt={alt} />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

// ─── MobileMoreSheet ────────────────────────────────────────────────────────

jest.mock("@/components/ui/mobile-bottom-sheet", () => ({
  MobileBottomSheet: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open: boolean
  }) =>
    open ? <div data-testid="mobile-bottom-sheet">{children}</div> : null,
}))

// ─── Tests ──────────────────────────────────────────────────────────────────

import { AppTopBar } from "@/app/components/AppTopBar"
import { SidebarFooter } from "@/components/sidebar/sidebar-footer"
import { MobileMoreSheet } from "@/components/mobile-more-sheet"

const FEDERATED_LOGOUT_URL = "/api/auth/logout?federated"

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  picture: null as string | null,
}

const mockSession = { user: mockUser }

// ── AppTopBar ────────────────────────────────────────────────────────────────

describe("AppTopBar — federated logout", () => {
  it("sign out link points to /api/auth/logout?federated", () => {
    render(<AppTopBar session={mockSession} />)

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link).toHaveAttribute("href", FEDERATED_LOGOUT_URL)
  })

  it("sign out link is a native <a> element (not client-side routed)", () => {
    render(<AppTopBar session={mockSession} />)

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link.tagName).toBe("A")
    // Native <a> elements must NOT carry a data-next-link attribute, which
    // would indicate a Next.js <Link> intercepts the click client-side.
    expect(link).not.toHaveAttribute("data-next-link")
  })

  it("sign out link does not use the non-federated logout URL", () => {
    render(<AppTopBar session={mockSession} />)

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link).not.toHaveAttribute("href", "/api/auth/logout")
  })
})

// ── SidebarFooter ────────────────────────────────────────────────────────────

describe("SidebarFooter — federated logout", () => {
  it("sign out link points to /api/auth/logout?federated", () => {
    render(<SidebarFooter user={mockUser} />)

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link).toHaveAttribute("href", FEDERATED_LOGOUT_URL)
  })

  it("sign out link is a native <a> element (not client-side routed)", () => {
    render(<SidebarFooter user={mockUser} />)

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link.tagName).toBe("A")
    expect(link).not.toHaveAttribute("data-next-link")
  })

  it("sign out link does not use the non-federated logout URL", () => {
    render(<SidebarFooter user={mockUser} />)

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link).not.toHaveAttribute("href", "/api/auth/logout")
  })
})

// ── MobileMoreSheet ──────────────────────────────────────────────────────────

describe("MobileMoreSheet — federated logout", () => {
  const onOpenChange = jest.fn()

  it("sign out link points to /api/auth/logout?federated when sheet is open", () => {
    render(
      <MobileMoreSheet
        open={true}
        onOpenChange={onOpenChange}
        overflowItems={[]}
      />,
    )

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link).toHaveAttribute("href", FEDERATED_LOGOUT_URL)
  })

  it("sign out link is a native <a> element (not client-side routed)", () => {
    render(
      <MobileMoreSheet
        open={true}
        onOpenChange={onOpenChange}
        overflowItems={[]}
      />,
    )

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link.tagName).toBe("A")
    expect(link).not.toHaveAttribute("data-next-link")
  })

  it("sign out link does not use the non-federated logout URL", () => {
    render(
      <MobileMoreSheet
        open={true}
        onOpenChange={onOpenChange}
        overflowItems={[]}
      />,
    )

    const link = screen.getByRole("link", { name: /sign out/i })
    expect(link).not.toHaveAttribute("href", "/api/auth/logout")
  })

  it("does not render sign out link when sheet is closed", () => {
    render(
      <MobileMoreSheet
        open={false}
        onOpenChange={onOpenChange}
        overflowItems={[]}
      />,
    )

    expect(screen.queryByRole("link", { name: /sign out/i })).not.toBeInTheDocument()
  })

  it("calls onOpenChange(false) when sign out is clicked", async () => {
    const user = userEvent.setup()
    render(
      <MobileMoreSheet
        open={true}
        onOpenChange={onOpenChange}
        overflowItems={[]}
      />,
    )

    const link = screen.getByRole("link", { name: /sign out/i })
    await user.click(link)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})

// ── Cross-component: exhaustive href audit ────────────────────────────────────

describe("Logout href audit — no bare /api/auth/logout anywhere", () => {
  it("AppTopBar: no link has bare /api/auth/logout without ?federated", () => {
    const { container } = render(<AppTopBar session={mockSession} />)
    const allLinks = container.querySelectorAll('a[href*="logout"]')
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).toContain("?federated")
    })
  })

  it("SidebarFooter: no link has bare /api/auth/logout without ?federated", () => {
    const { container } = render(<SidebarFooter user={mockUser} />)
    const allLinks = container.querySelectorAll('a[href*="logout"]')
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).toContain("?federated")
    })
  })

  it("MobileMoreSheet: no link has bare /api/auth/logout without ?federated", () => {
    const { container } = render(
      <MobileMoreSheet open={true} onOpenChange={jest.fn()} overflowItems={[]} />,
    )
    const allLinks = container.querySelectorAll('a[href*="logout"]')
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).toContain("?federated")
    })
  })
})
