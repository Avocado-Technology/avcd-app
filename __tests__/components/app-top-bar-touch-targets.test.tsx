import { describe, it, beforeEach, afterEach } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { AppTopBar } from "@/app/components/AppTopBar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"
import { assertMinimumTouchHeight } from "@/__tests__/utils/touch-target-helpers"

const mockSession = {
  user: {
    name: "Test User",
    email: "test@example.com",
    picture: null,
  },
}

describe("AppTopBar — touch targets", () => {
  beforeEach(() => {
    mockMatchMedia("(min-width: 1024px)")
    delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
  })

  afterEach(() => {
    restoreMatchMedia()
    delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
  })

  it("sign out control meets minimum touch height", () => {
    render(
      <ThemeProvider>
        <SidebarProvider>
          <AppTopBar session={mockSession} />
        </SidebarProvider>
      </ThemeProvider>,
    )
    const signOut = screen.getByRole("link", { name: /sign out/i })
    assertMinimumTouchHeight(signOut, 44)
  })
})
