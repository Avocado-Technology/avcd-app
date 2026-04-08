import { redirect } from "next/navigation";

import { signOut } from "@/auth";

/**
 * Legacy URL kept for bookmarks and prior deploys. Clears the Auth.js session
 * (no Google `/Logout?continue=` hop), then sends the user home.
 */
export async function GET() {
  await signOut({ redirect: false, redirectTo: "/" });
  redirect("/");
}
