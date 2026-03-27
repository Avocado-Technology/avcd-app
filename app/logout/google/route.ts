import { redirect } from "next/navigation";

function appOrigin(): string {
  const raw =
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/**
 * Google’s Logout page often rejects or shows an error when `continue` is a non-HTTPS
 * URL (e.g. http://localhost:3000/). In that case we only finish app sign-out and
 * send the user home; use an HTTPS AUTH_URL in production for full Google logout.
 */
function googleAcceptsContinueUrl(absoluteUrl: string): boolean {
  try {
    return new URL(absoluteUrl).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * After Auth.js sign-out, send the user through Google's logout so this browser's
 * Google session ends, then return to the app home. `continue` is built only from
 * AUTH_URL (never from the request) to avoid open redirects.
 */
export function GET() {
  const origin = appOrigin();
  const continueUrl = `${origin}/`;

  if (!googleAcceptsContinueUrl(continueUrl)) {
    redirect("/");
  }

  const googleLogout = new URL("https://www.google.com/accounts/Logout");
  googleLogout.searchParams.set("continue", continueUrl);
  redirect(googleLogout.toString());
}
