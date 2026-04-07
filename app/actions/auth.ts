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
  // #region agent log
  fetch("http://127.0.0.1:7747/ingest/68ebbb71-aba6-417b-a281-d3987e458ee7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "64ac3a",
    },
    body: JSON.stringify({
      sessionId: "64ac3a",
      hypothesisId: "A",
      runId: "pre-fix",
      location: "app/actions/auth.ts:signOutFromApp",
      message: "enter",
      data: {},
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const result = await signOut({ redirect: false, redirectTo: "/" });

  // #region agent log
  const r =
    result && typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : null;
  const redirectField =
    typeof r?.redirect === "string" ? r.redirect.slice(0, 220) : null;
  fetch("http://127.0.0.1:7747/ingest/68ebbb71-aba6-417b-a281-d3987e458ee7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "64ac3a",
    },
    body: JSON.stringify({
      sessionId: "64ac3a",
      hypothesisId: "A",
      runId: "pre-fix",
      location: "app/actions/auth.ts:signOutFromApp",
      message: "after signOut redirect:false",
      data: {
        redirectField,
        isGoogleLogout: redirectField?.includes("accounts.google.com") ?? false,
        cookieOps: Array.isArray(r?.cookies) ? r.cookies.length : null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  // #region agent log
  fetch("http://127.0.0.1:7747/ingest/68ebbb71-aba6-417b-a281-d3987e458ee7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "64ac3a",
    },
    body: JSON.stringify({
      sessionId: "64ac3a",
      hypothesisId: "C",
      runId: "pre-fix",
      location: "app/actions/auth.ts:signOutFromApp",
      message: "before redirect(/)",
      data: {},
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  redirect("/");
}
