import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { auth0 } from "@/lib/auth0";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return authResponse;
  }

  const intlResponse = intlMiddleware(request);

  authResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      intlResponse.headers.append(key, value);
    }
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest|health|logout).*)",
  ],
};
