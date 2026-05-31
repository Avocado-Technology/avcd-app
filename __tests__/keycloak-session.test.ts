/**
 * Keycloak Session Management Tests
 */

describe("Keycloak Configuration", () => {
  it("should have required Keycloak environment variables", () => {
    expect(process.env.AUTH_SECRET).toBeDefined();
    expect(process.env.KEYCLOAK_URL).toBeDefined();
    expect(process.env.KEYCLOAK_CLIENT_ID).toBeDefined();
    expect(process.env.KEYCLOAK_CLIENT_SECRET).toBeDefined();
    expect(process.env.KEYCLOAK_AUDIENCE).toBeDefined();
  });

  it("should have AUTH_SECRET with minimum length", () => {
    const secret = process.env.AUTH_SECRET || "";
    expect(secret.length).toBeGreaterThanOrEqual(32);
  });
});

describe("NextAuth Package Installation", () => {
  it("should have next-auth in package.json dependencies", () => {
    const packageJson = require("../package.json");
    expect(packageJson.dependencies["next-auth"]).toBeDefined();
  });

  it("should have next-auth module in node_modules", () => {
    const { existsSync } = require("fs");
    const { join } = require("path");
    const nextAuthPath = join(process.cwd(), "node_modules", "next-auth");
    expect(existsSync(nextAuthPath)).toBe(true);
  });
});

describe("Auth0 SDK Removal Verification", () => {
  it("should NOT have @auth0/nextjs-auth0 package installed", () => {
    let auth0Exists = true;
    try {
      require("@auth0/nextjs-auth0");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "MODULE_NOT_FOUND"
      ) {
        auth0Exists = false;
      }
    }
    expect(auth0Exists).toBe(false);
  });
});
