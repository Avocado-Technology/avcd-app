import { NextResponse } from "next/server";

/**
 * Logout redirect route
 * 
 * Auth0 provides logout at /api/auth/logout
 * This route exists for backward compatibility and redirects to Auth0's logout endpoint.
 */
export async function GET() {
  return NextResponse.redirect(new URL("/api/auth/logout", process.env.AUTH0_BASE_URL || "http://localhost:3000"));
}
