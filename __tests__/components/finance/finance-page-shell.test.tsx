import { describe, it, expect, jest } from "@jest/globals"
import { render } from "@testing-library/react"
import React from "react"

jest.mock("@/app/[locale]/finance/finance-client-mock", () => ({
  __esModule: true,
  FinanceClientMock: () => <div data-testid="finance-client-mock">mock-client</div>,
}))

jest.mock("@/app/[locale]/finance/finance-client-live", () => ({
  __esModule: true,
  FinanceClientLive: () => <div data-testid="finance-live">live-client</div>,
}))

// We need to mock the component that USES the env var, or mock the env var before importing it
// Since it's a client component, it might be evaluated at import time.
import { FinancePageShell } from "@/app/[locale]/finance/finance-page-shell"

describe("FinancePageShell", () => {
  it("GivenMockMode_WhenRendered_ThenShowsFinanceClientMock", () => {
    const { getAllByText } = render(<FinancePageShell />)
    
    // Default is mock if not set to api
    expect(getAllByText(/Finance.accounts/i)[0]).toBeInTheDocument()
  })
})
