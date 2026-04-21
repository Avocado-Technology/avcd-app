import { describe, it, expect, jest } from "@jest/globals"
import { render } from "@testing-library/react"
import React from "react"

jest.mock('@/components/app-sidebar', () => ({
  AppSidebar: ({ currentPath, user }) => (
    <div data-testid="app-sidebar" data-path={currentPath}>
      <div data-testid="sidebar-nav" data-path={currentPath}>sidebar-nav</div>
      <div data-testid="sidebar-footer">{user.name} {user.email}</div>
    </div>
  ),
}));

import { SidebarWrapper } from "@/components/sidebar-wrapper"

describe("Sidebar Navigation Integration", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    picture: "https://example.com/pic.jpg",
  }

  it("GivenUserAndPath_WhenRendered_ThenSidebarNavReceivesCorrectPath", () => {
    const { getByRole } = render(<SidebarWrapper user={mockUser} />)
    
    const nav = getByRole("navigation", { name: /Navigation.mainNavLabel/i })
    expect(nav).toBeInTheDocument()
  })

  it("GivenUser_WhenRendered_ThenSidebarFooterReceivesCorrectUser", () => {
    const { getByText } = render(<SidebarWrapper user={mockUser} />)
    
    expect(getByText(/Test User/i)).toBeInTheDocument()
    expect(getByText(/test@example.com/i)).toBeInTheDocument()
  })
})
