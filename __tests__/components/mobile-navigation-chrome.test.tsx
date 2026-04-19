import { describe, it, expect, afterEach } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { MobileNavigationChrome } from "@/components/mobile-navigation-chrome"

describe("MobileNavigationChrome", () => {
  const prevFlag = process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV

  afterEach(() => {
    if (prevFlag === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
    } else {
      process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = prevFlag
    }
  })

  it("sets data-mobile-nav-clearance when bottom nav flag is enabled", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
    render(
      <MobileNavigationChrome>
        <main>
          <span>child</span>
        </main>
      </MobileNavigationChrome>,
    )
    const main = screen.getByRole("main")
    const wrapper = main.parentElement
    expect(wrapper).toHaveAttribute("data-mobile-nav-clearance", "true")
    expect(wrapper?.className).toContain("pb-24")
  })

  it("does not set clearance attribute when flag is off", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "false"
    render(
      <MobileNavigationChrome>
        <main>
          <span>child</span>
        </main>
      </MobileNavigationChrome>,
    )
    const main = screen.getByRole("main")
    const wrapper = main.parentElement
    expect(wrapper).not.toHaveAttribute("data-mobile-nav-clearance")
  })
})
