import { describe, it, expect, jest } from "@jest/globals"
import { render, fireEvent } from "@testing-library/react"
import { MobileNav } from "@/components/mobile-nav"
import React from "react"

jest.mock('@/components/sidebar/sidebar-nav', () => ({
  SidebarNav: ({ currentPath }) => (
    <div data-testid="sidebar-nav" data-path={currentPath}>
      sidebar-nav
    </div>
  ),
}));

jest.mock('@/components/sidebar/sidebar-header', () => ({
  SidebarHeader: () => <div data-testid="sidebar-header">sidebar-header</div>,
}));

jest.mock('@/components/sidebar/sidebar-footer', () => ({
  SidebarFooter: ({ user }) => (
    <div data-testid="sidebar-footer">
      {user.name} {user.email}
    </div>
  ),
}));

describe("MobileNav Component", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    picture: "https://example.com/pic.jpg",
  }

  it("GivenUser_WhenRendered_ThenShowsSidebarComponents", async () => {
    const { getByText, getByRole } = render(<MobileNav user={mockUser} currentPath="/test" />)
    
    // Open the sheet
    const trigger = getByRole("button", { name: /Navigation.openMenuLabel/i })
    fireEvent.click(trigger)

    expect(getByText(/AVCD/i)).toBeInTheDocument()
    expect(getByText(/Navigation.finance/i)).toBeInTheDocument()
    expect(getByText(/Test User/i)).toBeInTheDocument()
  })

  it("GivenMenuButton_WhenRendered_ThenHasCorrectAriaLabel", () => {
    const { getByRole } = render(<MobileNav user={mockUser} currentPath="/" />)
    expect(getByRole("button", { name: /Navigation.openMenuLabel/i })).toBeInTheDocument()
  })
})
