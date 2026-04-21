import { describe, it, expect } from "@jest/globals"
import { routing } from "../../i18n/routing"

describe("i18n Routing Configuration", () => {
  it("GivenRoutingConfig_WhenInspected_ThenHasCorrectLocales", () => {
    expect(routing.locales).toEqual(["en", "pt"])
  })

  it("GivenRoutingConfig_WhenInspected_ThenHasCorrectDefaultLocale", () => {
    expect(routing.defaultLocale).toBe("en")
  })

  it("GivenRoutingConfig_WhenInspected_ThenHasCorrectLocalePrefix", () => {
    expect(routing.localePrefix).toBe("as-needed")
  })
})
