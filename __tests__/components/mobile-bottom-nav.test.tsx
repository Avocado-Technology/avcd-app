import { describe, it, expect, jest } from "@jest/globals"
import { render } from "@testing-library/react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

jest.mock('@/components/mobile-more-sheet', () => ({
  MobileMoreSheet: ({ open, onOpenChange, overflowItems }) => (
    open ? (
      <div role="dialog">
        <button onClick={() => onOpenChange(false)}>close</button>
        <div>Navigation.moreOptions</div>
        {overflowItems.map((item) => (
          <a key={item.href} href={item.href}>{item.labelKey}</a>
        ))}
        <button type="button">sign out</button>
      </div>
    ) : null
  ),
}));

jest.mock('@/components/mobile-bottom-theme-button', () => ({
  MobileBottomThemeButton: () => <button aria-label="toggle color theme">theme</button>,
}));

describe("MobileBottomNav Component", () => {
  it("GivenDefaultState_WhenRendered_ThenShowsPrimaryNavItems", () => {
    const { getByLabelText } = render(<MobileBottomNav />)
    expect(getByLabelText(/Navigation.primaryNavLabel/i)).toBeInTheDocument()
    expect(getByLabelText(/Navigation.finance/i)).toBeInTheDocument()
    expect(getByLabelText(/Navigation.organization/i)).toBeInTheDocument()
  })

  it("GivenMoreOptionsClicked_WhenRendered_ThenShowsMoreSheet", () => {
    const { getByLabelText, getByText } = render(<MobileBottomNav />)
    const moreButton = getByLabelText(/Navigation.moreOptions/i)
    moreButton.click()
    expect(getByText(/Navigation.moreOptions/i)).toBeInTheDocument()
    expect(getByText(/Navigation.settings/i)).toBeInTheDocument()
    expect(getByText(/sign out/i)).toBeInTheDocument()
  })
})
