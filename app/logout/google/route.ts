import { redirect } from "next/navigation";

/**
 * Legacy path from an older sign-out flow. Sign-out now goes straight to `/` after Auth.js.
 */
export function GET() {
  redirect("/");
}
