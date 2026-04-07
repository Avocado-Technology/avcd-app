import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import type { JWT } from "next-auth/jwt";

import { authDebug, isAuthDebugEnabled } from "@/lib/auth-debug";

/**
 * Match Auth.js cookie strategy: secure names only when the configured public URL is HTTPS,
 * not when NODE_ENV=production alone (Docker often runs production build on http://localhost).
 */
function inferSecureCookieFromAuthUrl(): boolean {
  const u = (
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    ""
  ).toLowerCase();
  if (u.startsWith("https://")) return true;
  if (u.startsWith("http://")) return false;
  return process.env.NODE_ENV === "production";
}

async function buildCookieHeader(): Promise<string> {
  const jar = await cookies();
  const all = jar.getAll();
  if (all.length > 0) {
    return all.map((c) => `${c.name}=${c.value}`).join("; ");
  }
  const h = await headers();
  return h.get("cookie") ?? "";
}

/**
 * Decoded Auth.js JWT from the session cookie (server-only). Used for AVCD access JWT refresh path.
 */
export async function getSessionJwt(): Promise<JWT | null> {
  const secret =
    process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (!secret) {
    authDebug("getSessionJwt: missing AUTH_SECRET / NEXTAUTH_SECRET");
    return null;
  }

  const cookieHeader = await buildCookieHeader();
  const preferredSecure = inferSecureCookieFromAuthUrl();
  const tryOrder = preferredSecure ? [true, false] : [false, true];

  if (isAuthDebugEnabled()) {
    const names = cookieHeader
      ? cookieHeader.split(";").map((p) => p.trim().split("=")[0])
      : [];
    authDebug("getSessionJwt: cookies", {
      cookieHeaderChars: cookieHeader.length,
      cookieNames: names.filter(Boolean),
      inferredSecureCookie: preferredSecure,
      AUTH_URL: process.env.AUTH_URL ?? "(unset)",
    });
  }

  for (const secureCookie of tryOrder) {
    const token = await getToken({
      req: { headers: { cookie: cookieHeader } },
      secret,
      secureCookie,
    });
    if (token) {
      if (isAuthDebugEnabled() && secureCookie !== preferredSecure) {
        authDebug("getSessionJwt: matched with secureCookie", secureCookie);
      }
      return token;
    }
  }

  authDebug(
    "getSessionJwt: getToken null for both cookie name variants (check AUTH_URL vs how you open the site, and AUTH_SECRET)",
  );
  return null;
}
