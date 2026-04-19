import { describe, it, expect, beforeEach, afterEach } from "@jest/globals"
import { isMobileBottomNavEnabled } from "@/lib/feature-flags"

describe("feature flags", () => {
  const original = process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
  })

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV
    } else {
      process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = original
    }
  })

  it("mobile bottom nav is false when unset", () => {
    expect(isMobileBottomNavEnabled()).toBe(false)
  })

  it("mobile bottom nav is true when env is true", () => {
    process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV = "true"
    expect(isMobileBottomNavEnabled()).toBe(true)
  })
})
