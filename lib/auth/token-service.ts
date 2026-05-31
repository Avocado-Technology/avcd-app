/**
 * Browser/client token broker for GraphQL.
 *
 * Fetches access tokens from `/api/auth/token`, coalesces concurrent refreshes,
 * and proactively refreshes when the JWT is within {@link REFRESH_BUFFER_MS}
 * of expiry.
 */

const DEFAULT_TOKEN_URL = "/api/auth/token";
export const REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

export class TokenAuthError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TokenAuthError";
    this.status = status;
  }
}

export type TokenServiceOptions = {
  /** Injected fetch (browser default: global fetch) */
  fetchImpl?: typeof fetch;
  tokenUrl?: string;
};

type TokenState = {
  token: string | null;
  expiresAtMs: number | null;
  refreshPromise: Promise<string | null> | null;
};

/**
 * Returns true when the access token should be refreshed before use.
 * Exported for focused unit tests (buffer / clock boundaries).
 */
export function shouldRefreshForExpiry(
  expiresAtMs: number | null,
  nowMs: number,
  bufferMs: number = REFRESH_BUFFER_MS,
): boolean {
  if (expiresAtMs == null) return true;
  return nowMs + bufferMs >= expiresAtMs;
}

function decodeJwtExpMs(accessToken: string): number | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      typeof atob === "function"
        ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { exp?: number };
    if (typeof payload.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export class TokenService {
  private readonly fetchImpl: typeof fetch;
  private readonly tokenUrl: string;
  private state: TokenState = {
    token: null,
    expiresAtMs: null,
    refreshPromise: null,
  };

  constructor(options: TokenServiceOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.tokenUrl = options.tokenUrl ?? DEFAULT_TOKEN_URL;
  }

  /** Test / recovery hook: drop cached token state */
  clear(): void {
    this.state = {
      token: null,
      expiresAtMs: null,
      refreshPromise: null,
    };
  }

  /**
   * Force a new token fetch even if the current token is still "fresh".
   * Used by the GraphQL error link after `UNAUTHENTICATED`.
   */
  async forceRefresh(): Promise<string | null> {
    if (this.state.refreshPromise) {
      try {
        await this.state.refreshPromise;
      } catch {
        // ignore; we'll attempt a fresh fetch below
      }
    }
    this.state.refreshPromise = null;
    this.state.token = null;
    this.state.expiresAtMs = null;
    try {
      return await this.refreshToken();
    } catch (error) {
      if (error instanceof TokenAuthError) {
        return null;
      }
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    if (this.state.refreshPromise) {
      return this.state.refreshPromise;
    }

    if (
      this.state.token &&
      !shouldRefreshForExpiry(this.state.expiresAtMs, Date.now())
    ) {
      return this.state.token;
    }

    return this.refreshToken();
  }

  private async refreshToken(): Promise<string | null> {
    if (!this.state.refreshPromise) {
      this.state.refreshPromise = (async () => {
        try {
          return await this.performRefresh();
        } finally {
          this.state.refreshPromise = null;
        }
      })();
    }
    return this.state.refreshPromise;
  }

  private async performRefresh(): Promise<string | null> {
    // Call through Reflect.apply to preserve native fetch receiver in all runtimes.
    const response = (await Reflect.apply(this.fetchImpl, globalThis, [
      this.tokenUrl,
      {
        method: "GET",
        credentials: "same-origin",
      },
    ])) as Response;

    if (!response.ok) {
      throw new TokenAuthError(
        `Token refresh failed: ${response.status}`,
        response.status,
      );
    }

    const body = (await response.json()) as { accessToken?: string };
    const accessToken = body.accessToken?.trim() ?? "";
    if (!accessToken) {
      throw new TokenAuthError("Token refresh returned empty accessToken");
    }

    this.state.token = accessToken;
    this.state.expiresAtMs = decodeJwtExpMs(accessToken);
    return accessToken;
  }
}
