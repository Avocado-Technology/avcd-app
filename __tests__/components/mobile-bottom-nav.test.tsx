import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals"
import type { ReactElement } from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LayoutList, Settings } from "lucide-react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import {
  APP_NAV_ITEMS,
  MOBILE_PRIMARY_NAV_ITEMS,
} from "@/lib/mobile-nav-config"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"
import {
  assertMinimumTouchHeight,
  assertMinimumTouchTarget,
} from "@/__tests__/utils/touch-target-helpers"
import { ThemeProvider } from "@/components/theme-provider"

const mockUsePathname = jest.fn(() => "/")

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe("MobileBottomNav", () => {
  const prevFlag = process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV

  beforeEach(() => {
    mockMatchMedia("(max-width: 1023px)")
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
    mockUsePathname.mockReturnValue("/")
  })

  afterEach(() => {
    restoreMatchMedia()
    if (prevFlag === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
    } else {
      process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = prevFlag
    }
  })

  it("renders fixed bottom navigation when flag is enabled", () => {
    renderWithTheme(<MobileBottomNav />)
    const nav = screen.getByRole("navigation", { name: /primary navigation/i })
    expect(nav).toHaveClass("fixed", "bottom-0", "left-0", "right-0")
    expect(nav).toHaveClass("lg:hidden")
  })

  it("includes safe-area padding style", () => {
    renderWithTheme(<MobileBottomNav />)
    const nav = screen.getByRole("navigation", { name: /primary navigation/i })
    expect(nav.getAttribute("style")).toContain("env(safe-area-inset-bottom")
    expect(nav.getAttribute("style")).toContain("max(16px")
  })

  it("shows two favorite links, color theme button, and More button", () => {
    renderWithTheme(<MobileBottomNav />)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    MOBILE_PRIMARY_NAV_ITEMS.forEach(({ label }) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument()
    })
    expect(
      screen.getByRole("button", { name: /toggle color theme/i }),
    ).toBeInTheDocument()
    const more = screen.getByRole("button", { name: /more options/i })
    expect(more).toHaveAttribute("type", "button")
    expect(more).not.toHaveAttribute("aria-current")
  })

  it("More and theme buttons meet touch target minimum", () => {
    renderWithTheme(<MobileBottomNav />)
    assertMinimumTouchTarget(
      screen.getByRole("button", { name: /toggle color theme/i }),
      44,
    )
    assertMinimumTouchTarget(
      screen.getByRole("button", { name: /more options/i }),
      44,
    )
  })

  it("favorite links meet touch height minimum", () => {
    renderWithTheme(<MobileBottomNav />)
    const links = screen.getAllByRole("link")
    links.forEach((link) => assertMinimumTouchHeight(link, 44))
  })

  it("renders nothing when flag is disabled", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "false"
    renderWithTheme(<MobileBottomNav />)
    expect(
      screen.queryByRole("navigation", { name: /primary navigation/i }),
    ).not.toBeInTheDocument()
  })

  it("renders nothing when nav list is empty", () => {
    renderWithTheme(<MobileBottomNav items={[]} />)
    expect(
      screen.queryByRole("navigation", { name: /primary navigation/i }),
    ).not.toBeInTheDocument()
  })

  it("with one item renders one link, theme, and More", () => {
    const one = [APP_NAV_ITEMS[0]]
    renderWithTheme(<MobileBottomNav items={one} />)
    expect(screen.getAllByRole("link")).toHaveLength(1)
    expect(
      screen.getByRole("button", { name: /toggle color theme/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /more options/i })).toBeInTheDocument()
  })

  it("opens More sheet with sign out (theme on bottom bar)", async () => {
    const user = userEvent.setup()
    renderWithTheme(<MobileBottomNav />)
    await user.click(screen.getByRole("button", { name: /more options/i }))
    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText("More options")).toBeInTheDocument()
    expect(
      within(dialog).queryByRole("button", { name: /toggle theme/i }),
    ).not.toBeInTheDocument()
    expect(
      within(dialog).getByRole("link", { name: /sign out/i }),
    ).toBeInTheDocument()
  })

  it("puts overflow routes only in More sheet for four destinations", async () => {
    const user = userEvent.setup()
    const fourItems = [
      ...APP_NAV_ITEMS,
      {
        label: "Third",
        href: "/third",
        icon: LayoutList,
      },
      {
        label: "Fourth",
        href: "/fourth",
        icon: Settings,
      },
    ]
    renderWithTheme(<MobileBottomNav items={fourItems} />)
    expect(screen.getAllByRole("link")).toHaveLength(2)
    await user.click(screen.getByRole("button", { name: /more options/i }))
    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByRole("link", { name: "Third" })).toHaveAttribute(
      "href",
      "/third",
    )
    expect(within(dialog).getByRole("link", { name: "Fourth" })).toHaveAttribute(
      "href",
      "/fourth",
    )
  })
})
