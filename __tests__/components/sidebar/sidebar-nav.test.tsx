import { describe, it, expect } from "@jest/globals"
import { render } from "@testing-library/react"
import { SidebarNav } from "@/components/sidebar/sidebar-nav"
import React from "react"

describe("SidebarNav Component", () => {
  it("should render navigation items", () => {
    const { getByText } = render(<SidebarNav currentPath="/" />)
    expect(getByText(/Navigation.finance/i)).toBeInTheDocument()
    expect(getByText(/Navigation.organization/i)).toBeInTheDocument()
    expect(getByText(/Navigation.settings/i)).toBeInTheDocument()
  })

  it("should have correct link hrefs", () => {
    const { getByRole } = render(<SidebarNav currentPath="/" />)
    expect(getByRole("link", { name: /Navigation.finance/i }).getAttribute("href")).toBe("/finance")
    expect(getByRole("link", { name: /Navigation.organization/i }).getAttribute("href")).toBe("/org")
    expect(getByRole("link", { name: /Navigation.settings/i }).getAttribute("href")).toBe("/settings/mcp")
  })

  it("should highlight active link", () => {
    const { getByText } = render(<SidebarNav currentPath="/finance" />)
    const financeLink = getByText(/Navigation.finance/i).closest('a')
    expect(financeLink).toHaveClass('bg-gray-100')
  })
})
