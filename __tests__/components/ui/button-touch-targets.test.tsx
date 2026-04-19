import { describe, it, expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  assertMinimumTouchTarget,
  assertMinimumTouchHeight,
  assertHasTouchHeightClass,
} from "@/__tests__/utils/touch-target-helpers"

describe("Button — touch target compliance", () => {
  it("default button meets 44px minimum height", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: /click me/i })
    assertMinimumTouchHeight(button, 44)
  })

  it("icon button meets 44×44px minimum", () => {
    render(
      <Button size="icon" aria-label="Menu">
        <Menu />
      </Button>,
    )
    const button = screen.getByRole("button", { name: /menu/i })
    assertMinimumTouchTarget(button, 44)
  })

  it("lg button meets 56px minimum height for primary actions", () => {
    render(<Button size="lg">Primary</Button>)
    const button = screen.getByRole("button", { name: /primary/i })
    assertMinimumTouchHeight(button, 56)
  })

  it("default size uses touch height utilities", () => {
    render(<Button>Ok</Button>)
    assertHasTouchHeightClass(screen.getByRole("button"))
  })

  it("has no serious axe violations on a simple button", async () => {
    const { container } = render(<Button>Accessible</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
