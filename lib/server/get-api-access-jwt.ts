/**
 * Server-only: get Auth0 access token for AVCD API from session.
 */

import type { Fail } from "@/lib/server/backend-fetch";

import { auth0 } from "@/lib/auth0";

export async function getApiAccessJwt(): Promise<
  { ok: true; token: string } | Fail
> {
  try {
    const tokenResult = await auth0.getAccessToken();

    if (!tokenResult?.token) {
      return {
        ok: false,
        error:
          "You are not signed in. Please sign in with Google via Auth0.",
      };
    }

    return { ok: true, token: tokenResult.token };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get access token";

    return {
      ok: false,
      error: `Authentication error: ${errorMessage}. Try signing out and signing in again.`,
    };
  }
}
