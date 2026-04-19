import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { AppTopBar } from "@/app/components/AppTopBar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"

const mockSession = {
  user: {
    name: "Test User",
    email: "test@example.com",
    picture: null,
  },
}

function renderBar() {
  return render(
    <ThemeProvider>
      <SidebarProvider>
        <AppTopBar session={mockSession} />
      </SidebarProvider>
    </ThemeProvider>,
  )
}

describe("AppTopBar — bottom nav / More relocation", () => {
  const prevFlag = process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV

  afterEach(() => {
    restoreMatchMedia()
    if (prevFlag === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
    } else {
      process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = prevFlag
    }
  })

  it("hides theme and sign out below lg when bottom nav flag is on", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
    mockMatchMedia("(max-width: 1023px)")
    renderBar()
    expect(
      screen.queryByRole("button", { name: /toggle theme/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /sign out/i })).not.toBeInTheDocument()
  })

  it("shows theme and sign out at lg+ when bottom nav flag is on", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
    mockMatchMedia("(min-width: 1024px)")
    renderBar()
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /sign out/i })).toBeInTheDocument()
  })

  it("shows theme and sign out on small viewport when flag is off", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "false"
    mockMatchMedia("(max-width: 1023px)")
    renderBar()
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /sign out/i })).toBeInTheDocument()
  })
})
