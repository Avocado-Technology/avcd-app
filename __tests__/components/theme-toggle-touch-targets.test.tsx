import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { assertMinimumTouchTarget } from "@/__tests__/utils/touch-target-helpers"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"

describe("ThemeToggle — touch targets", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ""
    mockMatchMedia("(prefers-color-scheme: dark)")
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.className = ""
    restoreMatchMedia()
  })

  it("trigger meets 44px square minimum", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    const trigger = screen.getByRole("button", { name: /toggle theme/i })
    assertMinimumTouchTarget(trigger, 44)
  })

  it("menu items use min height for touch", async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    await user.click(screen.getByRole("button", { name: /toggle theme/i }))
    const items = screen.getAllByRole("menuitem")
    expect(items.length).toBeGreaterThan(0)
    items.forEach((item) => {
      expect(item.className).toMatch(/min-h-11/)
    })
  })
})
