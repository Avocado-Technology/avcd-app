/**
 * Tests for GET /api/auth/token — Auth0 access token + refresh behavior
 */

import { NextRequest } from "next/server";
import { getAccessToken, AccessTokenError } from "@auth0/nextjs-auth0";
import { GET } from "@/app/api/auth/token/route";

jest.mock("@auth0/nextjs-auth0", () => {
  class MockAccessTokenError extends Error {
    readonly code: string;
    constructor(code: string, message: string) {
      super(message);
      this.name = "AccessTokenError";
      this.code = code;
    }
  }
  return {
    getAccessToken: jest.fn(),
    AccessTokenError: MockAccessTokenError,
  };
});

const mockedGetAccessToken = getAccessToken as jest.MockedFunction<
  typeof getAccessToken
>;

describe("Token API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeRequest(): NextRequest {
    return new NextRequest(new URL("http://localhost:3000/api/auth/token"));
  }

  describe("GET /api/auth/token", () => {
    it("returns access token when getAccessToken resolves", async () => {
      mockedGetAccessToken.mockResolvedValue({
        accessToken: "fresh-jwt-from-sdk",
      });

      const response = await GET(makeRequest());

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        accessToken: "fresh-jwt-from-sdk",
      });
      expect(mockedGetAccessToken).toHaveBeenCalledTimes(1);
    });

    it("merges headers from NextResponse when SDK sets cookies on res", async () => {
      mockedGetAccessToken.mockImplementation(async (_req, res) => {
        res.headers.append(
          "Set-Cookie",
          "appSession=test-chunk; Path=/; HttpOnly",
        );
        return { accessToken: "jwt-with-cookie-merge" };
      });

      const response = await GET(makeRequest());

      expect(response.status).toBe(200);
      const setCookie = response.headers.getSetCookie?.() ?? [];
      const joined =
        setCookie.length > 0
          ? setCookie.join("; ")
          : response.headers.get("set-cookie") ?? "";
      expect(joined).toContain("appSession=test-chunk");
      await expect(response.json()).resolves.toEqual({
        accessToken: "jwt-with-cookie-merge",
      });
    });

    it("returns 401 when access token is missing", async () => {
      mockedGetAccessToken.mockResolvedValue({
        accessToken: undefined,
      });

      const response = await GET(makeRequest());

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Unauthorized",
      });
    });

    it("returns 401 when getAccessToken throws AccessTokenError", async () => {
      mockedGetAccessToken.mockRejectedValue(
        new AccessTokenError("ERR_MISSING_SESSION", "no session"),
      );

      const response = await GET(makeRequest());

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Unauthorized",
      });
    });

    it("returns 401 on unexpected errors without leaking details", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockedGetAccessToken.mockRejectedValue(new Error("network boom"));

      const response = await GET(makeRequest());

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Unauthorized",
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("sets Cache-Control to disable caching", async () => {
      mockedGetAccessToken.mockResolvedValue({ accessToken: "jwt" });

      const response = await GET(makeRequest());

      expect(response.headers.get("cache-control")).toBe(
        "private, no-store, max-age=0",
      );
    });
  });
});
