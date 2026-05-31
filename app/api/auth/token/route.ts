/**
 * Keycloak access token API route.
 *
 * Returns an access token for GraphQL using the Auth.js session JWT,
 * refreshing via refresh_token when the stored JWT is expired.
 */

import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/session";

/** Never statically cache; session and token responses must be fresh */
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/token
 *
 * @returns {accessToken: string}
 * @returns 401 if not authenticated or token unavailable
 */
export async function GET() {
  try {
    const tokenResult = await getAccessToken();

    if (!tokenResult?.token?.trim()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = NextResponse.json({ accessToken: tokenResult.token });
    json.headers.set("Cache-Control", "private, no-store, max-age=0");
    return json;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
