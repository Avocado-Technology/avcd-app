import { describe, expect, it } from "@jest/globals";

import { extractBearerToken } from "@/lib/chat/token-extractor";

describe("extractBearerToken", () => {
  it("GivenNonEmptyToken_WhenExtracting_ThenReturnsBearerPrefixedString", () => {
    expect(extractBearerToken("abc.def.ghi")).toBe("Bearer abc.def.ghi");
  });

  it("GivenEmptyString_WhenExtracting_ThenReturnsNull", () => {
    expect(extractBearerToken("")).toBeNull();
  });

  it("GivenWhitespaceOnly_WhenExtracting_ThenReturnsNull", () => {
    expect(extractBearerToken("   \t\n")).toBeNull();
  });

  it("GivenNull_WhenExtracting_ThenReturnsNull", () => {
    expect(extractBearerToken(null)).toBeNull();
  });

  it("GivenUndefined_WhenExtracting_ThenReturnsNull", () => {
    expect(extractBearerToken(undefined)).toBeNull();
  });
});
