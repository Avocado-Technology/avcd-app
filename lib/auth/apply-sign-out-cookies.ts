import type { NextResponse } from "next/server";

/** Auth.js v5 `signOut({ redirect: false })` return shape (raw mode). */
export type AuthSignOutResult = {
  redirect?: string | URL;
  cookies?: Array<{
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }>;
};

export function applySignOutCookies(
  response: NextResponse,
  signOutResult: AuthSignOutResult | string | undefined,
): void {
  if (!signOutResult || typeof signOutResult === "string") {
    return;
  }
  for (const cookie of signOutResult.cookies ?? []) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
}
