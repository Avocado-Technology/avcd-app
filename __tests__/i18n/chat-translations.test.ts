import { describe, expect, it } from "@jest/globals";
import * as fs from "node:fs";
import * as path from "node:path";

const REQUIRED_CHAT_KEYS = [
  "title",
  "placeholder",
  "sendLabel",
  "loadingLabel",
  "errorLabel",
  "emptyState",
] as const;

function loadLocale(locale: string): Record<string, unknown> {
  const file = path.join(__dirname, "..", "..", "messages", `${locale}.json`);
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

function expectChatAndNav(data: Record<string, unknown>) {
  const chat = data.Chat as Record<string, unknown> | undefined;
  expect(chat).toBeDefined();
  for (const key of REQUIRED_CHAT_KEYS) {
    expect(typeof chat?.[key]).toBe("string");
  }
  const nav = data.Navigation as Record<string, unknown> | undefined;
  expect(typeof nav?.chat).toBe("string");
}

describe("Chat i18n", () => {
  it("GivenEnglishLocale_WhenLoadingMessages_ThenChatAndNavKeysExist", () => {
    expectChatAndNav(loadLocale("en"));
  });

  it("GivenPortugueseLocale_WhenLoadingMessages_ThenChatAndNavKeysExist", () => {
    expectChatAndNav(loadLocale("pt"));
  });
});
