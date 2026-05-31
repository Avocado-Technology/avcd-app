import { signIn } from "@/lib/auth/keycloak";

/**
 * Legacy-compatible login entry point.
 * Redirects to Keycloak with Google IdP hint.
 */
export async function GET() {
  return signIn(
    "keycloak",
    { redirectTo: "/" },
    { kc_idp_hint: "google" },
  );
}
