/**
 * Tests for GET /api/auth/token — Keycloak access token + refresh behavior
 */

import { NextRequest } from "next/server";

import { GET } from "@/app/api/auth/token/route";

import { getAccessToken } from "@/lib/auth/session";

const mockedGetAccessToken = jest.mocked(getAccessToken);

describe("Token API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeRequest(): NextRequest {
    return new NextRequest(new URL("http://localhost:3000/api/auth/token"));
  }

  describe("GET /api/auth/token", () => {
    it("returns access token when getAccessToken resolves", async () => {
      mockedGetAccessToken.mockResolvedValue({ token: "fresh-jwt-from-session" });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        accessToken: "fresh-jwt-from-session",
      });
      expect(mockedGetAccessToken).toHaveBeenCalledTimes(1);
    });

    it("returns 401 when access token is missing", async () => {
      mockedGetAccessToken.mockResolvedValue(null);

      const response = await GET();

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Unauthorized",
      });
    });

    it("returns 401 on unexpected errors without leaking details", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockedGetAccessToken.mockRejectedValue(new Error("network boom"));

      const response = await GET();

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Unauthorized",
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("sets Cache-Control to disable caching", async () => {
      mockedGetAccessToken.mockResolvedValue({ token: "jwt" });

      const response = await GET();

      expect(response.headers.get("cache-control")).toBe(
        "private, no-store, max-age=0",
      );
    });
  });
});
