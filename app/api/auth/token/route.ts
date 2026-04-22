/**
 * Auth0 Token API Route
 *
 * Returns an access token for GraphQL using getAccessToken(), which refreshes
 * the OAuth access token via refresh_token when the stored JWT is expired.
 */

import { NextRequest, NextResponse } from "next/server";

import { AccessTokenError } from "@auth0/nextjs-auth0/errors";

import { auth0 } from "@/lib/auth0";

/** Never statically cache; session and token responses must be fresh */
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/token
 *
 * @returns {accessToken: string}
 * @returns 401 if not authenticated or token unavailable
 */
export async function GET(req: NextRequest) {
  const res = new NextResponse();

  try {
    const { token } = await auth0.getAccessToken(req, res);

    if (!token?.trim()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = NextResponse.json({ accessToken: token }, res);
    json.headers.set("Cache-Control", "private, no-store, max-age=0");
    return json;
  } catch (error) {
    if (error instanceof AccessTokenError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching access token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
