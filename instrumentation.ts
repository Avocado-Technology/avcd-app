import { authDebug, isAuthDebugEnabled } from "@/lib/auth-debug";

/**
 * Runs once when the Node server starts (dev and production). Confirms AUTH_DEBUG is visible in the process.
 */
export function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    return;
  }
  if (!isAuthDebugEnabled()) {
    return;
  }
  console.warn(
    "[avcd:auth-debug] instrumentation register(): debug logging is ON. If you see nothing else, trigger a page / sign-in. Docker: docker compose logs -f web",
  );
  authDebug("process env snapshot (no secrets)", {
    NODE_ENV: process.env.NODE_ENV,
    hasAuthSecret: Boolean(
      process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim(),
    ),
    AUTH_DEBUG: process.env.AUTH_DEBUG ?? "(unset)",
    AVCD_AUTH_DEBUG: process.env.AVCD_AUTH_DEBUG ?? "(unset)",
    AVCD_AUTH_URL: process.env.AVCD_AUTH_URL ?? "(unset)",
  });
}
