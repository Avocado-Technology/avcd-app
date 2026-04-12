/**
 * Server-only: get Auth0 access token for AVCD API from session.
 */

import { getAccessToken } from "@auth0/nextjs-auth0";
import type { Fail } from "@/lib/server/backend-fetch";

export async function getApiAccessJwt(): Promise<
  { ok: true; token: string } | Fail
> {
  try {
    const tokenResult = await getAccessToken();
    
    if (!tokenResult || !tokenResult.accessToken) {
      return { 
        ok: false, 
        error: "You are not signed in. Please sign in with Google via Auth0." 
      };
    }
    
    return { ok: true, token: tokenResult.accessToken };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to get access token";
    
    return {
      ok: false,
      error: `Authentication error: ${errorMessage}. Try signing out and signing in again.`
    };
  }
}
