import { describe, it, expect } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import { MobileBottomSheet } from "@/components/ui/mobile-bottom-sheet"
import { Button } from "@/components/ui/button"

describe("MobileBottomSheet", () => {
  it("renders bottom sheet with dialog role and footer button", () => {
    render(
      <MobileBottomSheet
        open
        title="Edit profile"
        description="Update your details"
        footer={<Button className="w-full">Submit</Button>}
      >
        <p>Body</p>
      </MobileBottomSheet>,
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Edit profile")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /submit/i })).toHaveClass("w-full")
  })
})
