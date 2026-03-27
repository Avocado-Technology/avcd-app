"use server";

import { signOut } from "@/auth";

/**
 * Ends the Auth.js session and clears cookies (see Auth.js “Signout” docs).
 * Redirects to /logout/google so the browser can complete Google account logout
 * before returning to the app (see app/logout/google/route.ts).
 */
export async function signOutFromApp() {
  await signOut({ redirectTo: "/logout/google" });
}
