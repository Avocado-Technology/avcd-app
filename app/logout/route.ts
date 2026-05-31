import { NextResponse } from "next/server";

/**
 * Logout redirect route (backward compatibility).
 */
export async function GET() {
  const baseUrl =
    process.env.APP_BASE_URL?.trim() ||
    process.env.AUTH_URL?.trim() ||
    "http://localhost:3000";
  return NextResponse.redirect(new URL("/api/auth/logout?federated", baseUrl));
}
