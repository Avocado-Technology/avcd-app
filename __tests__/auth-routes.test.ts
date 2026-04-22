/**
 * Authentication Routes Tests
 *
 * Verifies that only Auth0 routes exist and NextAuth routes are removed.
 */

import { existsSync } from "fs";
import { join } from "path";

describe("Auth Route Files", () => {
  const appDir = join(process.cwd(), "app");

  it("should configure Auth0 via lib/auth0.ts (SDK v4 + middleware)", () => {
    const auth0LibPath = join(process.cwd(), "lib", "auth0.ts");
    expect(existsSync(auth0LibPath)).toBe(true);
  });

  it("should NOT have legacy catch-all /api/auth/[auth0]/route.ts", () => {
    const legacyAuth0RoutePath = join(
      appDir,
      "api",
      "auth",
      "[auth0]",
      "route.ts",
    );
    expect(existsSync(legacyAuth0RoutePath)).toBe(false);
  });

  it("should NOT have NextAuth route handler at /api/auth/[...nextauth]", () => {
    const nextAuthRoutePath = join(
      appDir,
      "api",
      "auth",
      "[...nextauth]",
      "route.ts",
    );
    expect(existsSync(nextAuthRoutePath)).toBe(false);
  });

  it("should NOT have auth.ts file in root", () => {
    const authFilePath = join(process.cwd(), "auth.ts");
    expect(existsSync(authFilePath)).toBe(false);
  });

  it("should NOT have NextAuth logout route", () => {
    const logoutRoutePath = join(appDir, "logout", "google", "route.ts");
    expect(existsSync(logoutRoutePath)).toBe(false);
  });
});
