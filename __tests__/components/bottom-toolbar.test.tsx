import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { Share2, Pencil } from "lucide-react"
import { BottomToolbar } from "@/components/bottom-toolbar"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"

describe("BottomToolbar", () => {
  const prevFlag = process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV

  beforeEach(() => {
    mockMatchMedia("(max-width: 767px)")
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
  })

  afterEach(() => {
    restoreMatchMedia()
    if (prevFlag === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
    } else {
      process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = prevFlag
    }
  })

  it("positions above bottom nav when stacked flag is on", () => {
    render(
      <BottomToolbar
        actions={[
          { label: "Share", icon: Share2, onClick: jest.fn() },
          { label: "Edit", icon: Pencil, onClick: jest.fn() },
        ]}
      />,
    )
    const bar = screen.getByRole("toolbar")
    expect(bar).toHaveAttribute("data-toolbar-stack", "above-nav")
    expect(bar.className).toContain("bottom-[5.25rem]")
  })

  it("uses icon buttons that satisfy touch helpers", () => {
    render(
      <BottomToolbar
        actions={[{ label: "Share", icon: Share2, onClick: jest.fn() }]}
      />,
    )
    expect(screen.getByRole("button", { name: /share/i })).toBeInTheDocument()
  })
})
