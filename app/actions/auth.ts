"use server";

import { redirect } from "next/navigation";

import { signOut } from "@/auth";

/**
 * Ends the Auth.js session and clears cookies (see Auth.js “Signout” docs).
 *
 * We call `signOut({ redirect: false })` so we never follow Auth.js’s `Location`
 * after POST /signout — with the Google OIDC provider that can be
 * `https://accounts.google.com/Logout?continue=…`, which Google often rejects
 * with 400 “malformed”. We always `redirect("/")` ourselves after cookies are cleared.
 */
export async function signOutFromApp() {
  await signOut({ redirect: false, redirectTo: "/" });
  redirect("/");
}
