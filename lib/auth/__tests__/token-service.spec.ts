import {
  TokenAuthError,
  TokenService,
  shouldRefreshForExpiry,
} from "@/lib/auth/token-service";

function base64UrlEncode(obj: unknown): string {
  const json = JSON.stringify(obj);
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(json, "utf8").toString("base64url")
      : btoa(json);
  return b64;
}

function makeJwt(expSeconds: number, payload: Record<string, unknown> = {}): string {
  const header = base64UrlEncode({ alg: "none", typ: "JWT" });
  const body = base64UrlEncode({ ...payload, exp: expSeconds });
  return `${header}.${body}.sig`;
}

describe("TokenService", () => {
  it("GivenConcurrentRequests_WhenTokenExpired_ThenOnlyOneRefreshOccurs", async () => {
    let inFlight = 0;
    let peak = 0;
    const fetchImpl = jest.fn(async () => {
      inFlight += 1;
      peak = Math.max(peak, inFlight);
      await new Promise((r) => setTimeout(r, 50));
      inFlight -= 1;
      const exp = Math.floor(Date.now() / 1000) + 3600;
      return {
        ok: true,
        json: async () => ({ accessToken: makeJwt(exp) }),
      } as Response;
    });

    const svc = new TokenService({ fetchImpl });

    await Promise.all([
      svc.getToken(),
      svc.getToken(),
      svc.getToken(),
      svc.getToken(),
      svc.getToken(),
    ]);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(peak).toBe(1);
  });

  it("GivenTokenExpiringSoon_WhenChecking_ThenReturnsShouldRefresh", () => {
    const now = new Date("2026-01-01T00:00:00.000Z").getTime();
    const expiresAt = now + 4 * 60 * 1000; // 4 minutes
    expect(shouldRefreshForExpiry(expiresAt, now)).toBe(true);
  });

  it("GivenExpiredToken_WhenRefreshing_ThenReturnsNewToken", async () => {
    const exp = Math.floor(Date.now() / 1000) + 7200;
    const fetchImpl = jest.fn(async () => ({
      ok: true,
      json: async () => ({ accessToken: makeJwt(exp) }),
    })) as unknown as typeof fetch;

    const svc = new TokenService({ fetchImpl });
    const token = await svc.getToken();
    expect(token).toContain(".");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("GivenRefreshFailure_WhenRefreshing_ThenThrowsAuthError", async () => {
    const fetchImpl = jest.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({}),
    })) as unknown as typeof fetch;

    const svc = new TokenService({ fetchImpl });
    await expect(svc.getToken()).rejects.toThrow(TokenAuthError);
  });
});
