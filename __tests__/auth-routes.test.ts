/**
 * Authentication Routes Tests
 *
 * Verifies Keycloak / Auth.js routes exist.
 */

import { existsSync } from "fs";
import { join } from "path";

describe("Auth Route Files", () => {
  const appDir = join(process.cwd(), "app");

  it("should configure Keycloak via lib/auth/keycloak.ts (Auth.js + Keycloak provider)", () => {
    const keycloakLibPath = join(process.cwd(), "lib", "auth", "keycloak.ts");
    expect(existsSync(keycloakLibPath)).toBe(true);
  });

  it("should have Auth.js route handler at /api/auth/[...nextauth]", () => {
    const nextAuthRoutePath = join(
      appDir,
      "api",
      "auth",
      "[...nextauth]",
      "route.ts",
    );
    expect(existsSync(nextAuthRoutePath)).toBe(true);
  });

  it("should have legacy login route at /api/auth/login", () => {
    const loginRoutePath = join(appDir, "api", "auth", "login", "route.ts");
    expect(existsSync(loginRoutePath)).toBe(true);
  });

  it("should have legacy logout route at /api/auth/logout", () => {
    const logoutRoutePath = join(appDir, "api", "auth", "logout", "route.ts");
    expect(existsSync(logoutRoutePath)).toBe(true);
  });

  it("should NOT have legacy Auth0 lib/auth0.ts", () => {
    const auth0LibPath = join(process.cwd(), "lib", "auth0.ts");
    expect(existsSync(auth0LibPath)).toBe(false);
  });
});
