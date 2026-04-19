import React from "react"
import { describe, it, expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Mobile interaction smoke (jsdom-safe)", () => {
  it("button retains active press feedback class", () => {
    render(<Button>Tap</Button>)
    expect(screen.getByRole("button").className).toContain("active:translate-y-px")
  })
})
