import { NextRequest, NextResponse } from "next/server";

import { auth, signOut } from "@/lib/auth/keycloak";
import { buildKeycloakAuthConfig } from "@/lib/auth/config";

function appBaseUrl(): string {
  return (
    process.env.APP_BASE_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/**
 * Legacy-compatible logout entry point.
 * ?federated ends the Keycloak broker session (Google SSO).
 */
export async function GET(request: NextRequest) {
  const federated = request.nextUrl.searchParams.has("federated");
  const baseUrl = appBaseUrl();
  const session = federated ? await auth() : null;

  const clearSession = await signOut({ redirect: false });

  if (federated) {
    try {
      const { issuer } = buildKeycloakAuthConfig(process.env);
      const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
      logoutUrl.searchParams.set("post_logout_redirect_uri", `${baseUrl}/`);
      if (session?.idToken) {
        logoutUrl.searchParams.set("id_token_hint", session.idToken);
      }
      const response = NextResponse.redirect(logoutUrl);
      clearSession.headers.forEach((value: string, key: string) => {
        if (key.toLowerCase() === "set-cookie") {
          response.headers.append(key, value);
        }
      });
      return response;
    } catch {
      // Fall through to app-only logout
    }
  }

  const response = NextResponse.redirect(`${baseUrl}/`);
  clearSession.headers.forEach((value: string, key: string) => {
    if (key.toLowerCase() === "set-cookie") {
      response.headers.append(key, value);
    }
  });
  return response;
}
