import { describe, expect, it } from "@jest/globals";

import { APP_NAV_ITEMS } from "@/lib/mobile-nav-config";

/**
 * Lightweight smoke checks for the chat feature wiring (no browser automation in this repo).
 */
describe("Chat smoke", () => {
  it("GivenAppNavItems_WhenInspected_ThenChatRouteExistsBeforeSettings", () => {
    const chatIdx = APP_NAV_ITEMS.findIndex((i) => i.href === "/chat");
    const settingsIdx = APP_NAV_ITEMS.findIndex((i) =>
      i.href.includes("/settings"),
    );

    expect(chatIdx).toBeGreaterThanOrEqual(0);
    expect(settingsIdx).toBeGreaterThanOrEqual(0);
    expect(chatIdx).toBeLessThan(settingsIdx);
  });
});
