/**
 * Tests for GET /api/auth/token — Auth0 access token + refresh behavior
 */

import { NextRequest } from "next/server";
import {
  AccessTokenError,
  AccessTokenErrorCode,
} from "@auth0/nextjs-auth0/errors";

import { GET } from "@/app/api/auth/token/route";

import { auth0 } from "@/lib/auth0";

const mockedGetAccessToken = jest.mocked(auth0.getAccessToken);

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
        token: "fresh-jwt-from-sdk",
        expiresAt: Date.now() / 1000 + 3600,
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
        return {
          token: "jwt-with-cookie-merge",
          expiresAt: Date.now() / 1000 + 3600,
        };
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
        token: "",
        expiresAt: 0,
      });

      const response = await GET(makeRequest());

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Unauthorized",
      });
    });

    it("returns 401 when getAccessToken throws AccessTokenError", async () => {
      mockedGetAccessToken.mockRejectedValue(
        new AccessTokenError(
          AccessTokenErrorCode.MISSING_SESSION,
          "no session",
        ),
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
      mockedGetAccessToken.mockResolvedValue({
        token: "jwt",
        expiresAt: Date.now() / 1000 + 3600,
      });

      const response = await GET(makeRequest());

      expect(response.headers.get("cache-control")).toBe(
        "private, no-store, max-age=0",
      );
    });
  });
});
