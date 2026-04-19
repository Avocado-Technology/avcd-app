import { describe, it, beforeEach, afterEach } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { SidebarNav } from "@/components/sidebar/sidebar-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { mockMatchMedia, restoreMatchMedia } from "@/__tests__/utils/mockMatchMedia"
import { assertMinimumTouchHeight } from "@/__tests__/utils/touch-target-helpers"

describe("SidebarNav — mobile touch targets", () => {
  beforeEach(() => {
    mockMatchMedia("(max-width: 767px)")
  })

  afterEach(() => {
    restoreMatchMedia()
  })

  it("nav links meet minimum touch height on small screens", () => {
    render(
      <SidebarProvider>
        <SidebarNav currentPath="/" />
      </SidebarProvider>,
    )
    const links = screen.getAllByRole("link")
    links.forEach((link) => assertMinimumTouchHeight(link, 44))
  })
})
