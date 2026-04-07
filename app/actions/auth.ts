"use server";

import { signOut } from "@/auth";

/**
 * Ends the Auth.js session and clears cookies (see Auth.js “Signout” docs).
 * Redirects home. We do not use Google’s /accounts/Logout?continue=… to a third-party
 * URL — Google often returns 400 “malformed” for that flow.
 */
export async function signOutFromApp() {
  await signOut({ redirectTo: "/" });
}
