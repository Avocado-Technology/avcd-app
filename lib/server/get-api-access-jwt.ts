/**
 * Server-only: exchange Google ID token (from Auth.js JWT) for AVCD API JWT via auth issuer.
 */

import { auth } from "@/auth";
import { authDebug, dbgLen, isAuthDebugEnabled } from "@/lib/auth-debug";
import { getAvcdAuthBaseUrl } from "@/lib/avcd-auth";

import {
  fetchBackend,
  type Fail,
  isConnectionFail,
  readFastApiDetail,
} from "@/lib/server/backend-fetch";
import { isJwtExpired } from "@/lib/server/jwt-exp";
import { getSessionJwt } from "@/lib/server/session-token";

/** Safe fields from a Google JWT (no signature verification). */
function dbgGoogleIdTokenMeta(jwt: string): Record<string, unknown> {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return { shape: "non-jwt" };
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as Record<string, unknown>;
    const sub = payload.sub;
    return {
      iss: payload.iss,
      exp: payload.exp,
      emailInPayload: Boolean(payload.email),
      subHint:
        typeof sub === "string" && sub.length > 0
          ? `${sub.slice(0, 8)}…(${sub.length} chars)`
          : undefined,
    };
  } catch {
    return { parse: "failed" };
  }
}

export async function getApiAccessJwt(): Promise<
  { ok: true; token: string } | Fail
> {
  authDebug("getApiAccessJwt: start");
  const session = await auth();
  if (!session?.user) {
    authDebug("getApiAccessJwt: no session user");
    return { ok: false, error: "You are not signed in." };
  }
  authDebug("getApiAccessJwt: session ok", {
    userId: session.user.id ?? "(no id)",
    email: session.user.email ? "(set)" : "(none)",
  });

  const jwtPayload = await getSessionJwt();
  if (!jwtPayload) {
    authDebug(
      "getApiAccessJwt: getSessionJwt null while session.user exists (cookie/secret mismatch?)",
    );
    return {
      ok: false,
      error:
        "Session cookie could not be read. Sign out and sign in again. Set AUTH_SECRET the same everywhere. If you use http:// (e.g. local Docker), set AUTH_URL to that exact origin so cookie names match (do not rely on NODE_ENV alone).",
    };
  }

  const avcd = jwtPayload.avcdAccessJwt;
  if (
    typeof avcd === "string" &&
    avcd.length > 0 &&
    !isJwtExpired(avcd)
  ) {
    authDebug(
      "getApiAccessJwt: using avcdAccessJwt from session (minted at sign-in)",
      { accessTokenChars: dbgLen(avcd) },
    );
    return { ok: true, token: avcd };
  }

  const idToken =
    typeof jwtPayload.googleIdToken === "string" && jwtPayload.googleIdToken.length > 0
      ? jwtPayload.googleIdToken
      : null;
  if (!idToken) {
    authDebug(
      "getApiAccessJwt: abort — no avcdAccessJwt or Google id_token (sign out + sign in; ensure auth issuer is up at sign-in and AVCD_AUTH_URL is set)",
    );
    return {
      ok: false,
      error:
        "No API sign-in credential in session. Sign out and sign in with Google again. If you use Docker, start the auth service and set AVCD_AUTH_URL before signing in so the app can mint a session token.",
    };
  }
  authDebug("getApiAccessJwt: falling back to live Google id_token exchange", {
    idTokenChars: dbgLen(idToken),
    idTokenMeta: dbgGoogleIdTokenMeta(idToken),
  });

  let authBase: string;
  try {
    authBase = getAvcdAuthBaseUrl();
    authDebug("getApiAccessJwt: AVCD_AUTH_URL resolved", { authBase });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Auth service URL is not configured.";
    authDebug("getApiAccessJwt: AVCD_AUTH_URL missing", { msg });
    return { ok: false, error: msg };
  }

  const res = await fetchBackend(authBase, `${authBase}/google/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id_token: idToken }),
    cache: "no-store",
  });
  if (isConnectionFail(res)) {
    authDebug("getApiAccessJwt: fetch to issuer failed (network)", res);
    return res;
  }

  if (isAuthDebugEnabled()) {
    authDebug("getApiAccessJwt: issuer response", {
      status: res.status,
      ok: res.ok,
    });
  }

  if (!res.ok) {
    const detail = await readFastApiDetail(res);
    authDebug("getApiAccessJwt: issuer error body detail", detail);
    if (res.status === 503) {
      return {
        ok: false,
        error:
          "The auth service could not issue a token (check JWT_SECRET and GOOGLE_CLIENT_IDS on auth). " +
          detail,
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        error:
          detail +
          " Try signing out and signing in with Google again.",
      };
    }
    return { ok: false, error: detail };
  }

  let data: { access_token?: string };
  try {
    data = (await res.json()) as { access_token?: string };
  } catch {
    return { ok: false, error: "Auth service returned invalid JSON for token." };
  }
  const token = data.access_token?.trim();
  if (!token) {
    authDebug("getApiAccessJwt: JSON ok but access_token missing/empty");
    return { ok: false, error: "Auth service returned no access token." };
  }
  authDebug("getApiAccessJwt: success", { accessTokenChars: dbgLen(token) });
  return { ok: true, token };
}
