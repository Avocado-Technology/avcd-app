import { authDebug } from "@/lib/auth-debug";
import { getMcpServerUrl } from "@/lib/mcp-server-url";

/**
 * Calls the AVCD auth issuer (same as getApiAccessJwt). Used from the Auth.js jwt callback
 * so we can store a short API JWT in the session cookie instead of the large Google id_token.
 */
export async function exchangeGoogleIdTokenForAvcdAccess(
  googleIdToken: string,
): Promise<string | null> {
  const raw = process.env.AVCD_AUTH_URL?.trim();
  if (!raw) {
    authDebug("exchangeGoogle: AVCD_AUTH_URL unset, skip");
    return null;
  }
  const base = raw.replace(/\/+$/, "");
  const mcpAudience = getMcpServerUrl();
  
  authDebug("exchangeGoogle: starting", { 
    authBase: base,
    mcpAudience,
    hasIdToken: Boolean(googleIdToken && googleIdToken.length > 0)
  });
  
  try {
    const res = await fetch(`${base}/google/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ 
        id_token: googleIdToken,
        resource: mcpAudience
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      authDebug("exchangeGoogle: issuer HTTP", {
        status: res.status,
        ok: res.ok,
      });
      return null;
    }
    const data = (await res.json()) as { access_token?: string };
    const access = data.access_token?.trim();
    if (!access) {
      authDebug("exchangeGoogle: no access_token in JSON");
      return null;
    }
    authDebug("exchangeGoogle: ok", { accessTokenChars: access.length });
    return access;
  } catch (e) {
    authDebug("exchangeGoogle: fetch error", e instanceof Error ? e.message : e);
    return null;
  }
}
