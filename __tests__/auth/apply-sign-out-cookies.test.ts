import { NextResponse } from "next/server";

import { applySignOutCookies } from "@/lib/auth/apply-sign-out-cookies";

describe("applySignOutCookies", () => {
  it("sets cookies from Auth.js signOut result", () => {
    const response = NextResponse.next();
    applySignOutCookies(response, {
      cookies: [
        {
          name: "__Secure-authjs.session-token",
          value: "",
          options: { maxAge: 0 },
        },
      ],
    });

    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("__Secure-authjs.session-token=");
  });

  it("ignores string redirect return from signOut", () => {
    const response = NextResponse.next();
    applySignOutCookies(response, "https://example.com/");
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
