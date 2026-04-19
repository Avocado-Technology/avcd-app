import { describe, it, expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button — keyboard accessibility", () => {
  it("invokes onClick on Enter when focused", async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await user.tab()
    expect(screen.getByRole("button", { name: /save/i })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("invokes onClick on Space when focused", async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await user.tab()
    await user.keyboard(" ")
    expect(onClick).toHaveBeenCalled()
  })

  it("includes focus-visible ring utilities", () => {
    render(<Button>Focus me</Button>)
    expect(screen.getByRole("button").className).toMatch(/focus-visible:ring/)
  })
})
