import { describe, it, expect, jest } from "@jest/globals"
import { render, screen, waitFor } from "@testing-library/react"
import { AnimatedOrgChart } from "@/components/org-chart/animated-org-chart"
import { mockOrgData } from "@/lib/mock-org-data"

jest.mock("reactflow", () => ({
  ReactFlow: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="react-flow">{children}</div>
  ),
  Controls: () => null,
  Background: () => null,
  useNodesState: (initial: unknown[]) => [initial, jest.fn(), jest.fn()],
  useEdgesState: (initial: unknown[]) => [initial, jest.fn(), jest.fn()],
}))

describe("AnimatedOrgChart — touch configuration surface", () => {
  it("sets pinch and pan data attributes for QA / automation", async () => {
    render(<AnimatedOrgChart data={mockOrgData} />)
    const surface = await waitFor(() => screen.getByRole("application"))
    expect(surface.getAttribute("data-zoom-on-pinch")).toBe("true")
    expect(surface.getAttribute("data-pan-on-scroll")).toBe("true")
  })
})
