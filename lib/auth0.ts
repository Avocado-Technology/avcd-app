import { Auth0Client } from "@auth0/nextjs-auth0/server";

function domainFromIssuer(): string | undefined {
  const issuer = process.env.AUTH0_ISSUER_BASE_URL?.trim();
  if (!issuer) return undefined;
  try {
    return new URL(issuer).hostname;
  } catch {
    return undefined;
  }
}

function normalizeScope(scope: string | undefined): string | undefined {
  if (!scope) return undefined;
  const s = scope.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

/**
 * Single Auth0 client for App Router (Next.js 15–compatible async cookies).
 * Uses existing env: AUTH0_DOMAIN or AUTH0_ISSUER_BASE_URL hostname, APP_BASE_URL or AUTH0_BASE_URL.
 */
export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN?.trim() || domainFromIssuer(),
  appBaseUrl: process.env.APP_BASE_URL?.trim() || process.env.AUTH0_BASE_URL?.trim(),
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE?.trim(),
    scope: normalizeScope(process.env.AUTH0_SCOPE),
  },
  routes: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    callback: "/api/auth/callback",
    backChannelLogout: "/api/auth/backchannel-logout",
    connectAccount: "/api/auth/connect",
  },
});
