/**
 * Feature flags read from NEXT_PUBLIC_* env vars (inlined at build time for client bundles).
 */

export function isMobileBottomNavEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV === "true"
}
