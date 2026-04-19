import { describe, it } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { Input } from "@/components/ui/input"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"
import { assertMinimumTouchHeight } from "@/__tests__/utils/touch-target-helpers"

describe("Input — touch targets", () => {
  afterEach(() => {
    restoreMatchMedia()
  })

  it("uses at least 44px height on narrow viewports", () => {
    mockMatchMedia("(max-width: 767px)")
    render(<Input aria-label="Test field" />)
    const input = screen.getByRole("textbox")
    assertMinimumTouchHeight(input, 44)
  })
})
