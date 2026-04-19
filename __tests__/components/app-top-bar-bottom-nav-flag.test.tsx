import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
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

describe("AppTopBar — bottom nav feature flag", () => {
  beforeEach(() => {
    mockMatchMedia("(max-width: 767px)")
  })

  afterEach(() => {
    restoreMatchMedia()
    delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
  })

  it("hides drawer trigger when bottom nav flag is enabled", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
    render(
      <ThemeProvider>
        <SidebarProvider>
          <AppTopBar session={mockSession} />
        </SidebarProvider>
      </ThemeProvider>,
    )
    expect(screen.queryByLabelText(/open navigation menu/i)).not.toBeInTheDocument()
  })

  it("shows drawer trigger when bottom nav flag is disabled", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "false"
    render(
      <ThemeProvider>
        <SidebarProvider>
          <AppTopBar session={mockSession} />
        </SidebarProvider>
      </ThemeProvider>,
    )
    expect(screen.getByLabelText(/open navigation menu/i)).toBeInTheDocument()
  })
})
