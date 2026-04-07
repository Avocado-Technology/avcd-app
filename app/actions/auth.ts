"use server";

import { redirect } from "next/navigation";

import { signOut } from "@/auth";

/**
 * Ends the Auth.js session and clears cookies (see Auth.js “Signout” docs).
 *
 * We use `signOut({ redirect: false })` so Next.js does not treat Auth.js’s
 * internal post-signout URL as a second navigation (see NextAuth v5 + App Router
 * redirect quirks). We always end with `redirect("/")`.
 *
 * Note: Auth.js does not redirect to `accounts.google.com/Logout` on sign-out.
 * That URL is Google’s account logout page; `?continue=` to arbitrary sites is
 * unsupported/unreliable and often returns 400 — avoid “federated logout” via
 * that endpoint; `prompt: "select_account"` on sign-in is the usual pattern.
 */
export async function signOutFromApp() {
  await signOut({ redirect: false, redirectTo: "/" });
  redirect("/");
}
