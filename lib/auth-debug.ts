/**
 * Opt-in server logs for Auth.js + AVCD token flow. Set AUTH_DEBUG=1 in web/.env.local.
 * Never logs secrets, raw id_token, or access_token bodies.
 */

function truthyEnv(v: string | undefined): boolean {
  const t = v?.trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes";
}

export function isAuthDebugEnabled(): boolean {
  return (
    truthyEnv(process.env.AUTH_DEBUG) ||
    truthyEnv(process.env.AVCD_AUTH_DEBUG)
  );
}

export function authDebug(...args: unknown[]): void {
  if (!isAuthDebugEnabled()) return;
  // stderr so lines show up like warnings in Docker / log aggregators
  console.warn("[avcd:auth-debug]", ...args);
}

/** Safe length for diagnostics (avoid logging content). */
export function dbgLen(s: string | null | undefined): number {
  return typeof s === "string" ? s.length : 0;
}
