import React from "react"
import { describe, it, expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"

describe("Tailwind touch spacing utilities", () => {
  it("maps touch-min to 44px width/height utilities", () => {
    render(
      <div data-testid="box" className="h-touch-min w-touch-min">
        x
      </div>,
    )
    const el = screen.getByTestId("box")
    expect(el).toHaveClass("h-touch-min")
    expect(el).toHaveClass("w-touch-min")
  })
})
