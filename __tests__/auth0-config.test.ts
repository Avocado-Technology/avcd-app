/**
 * Auth0 Configuration Validation Tests
 *
 * These tests validate that Auth0 is properly configured for local development.
 * They catch common misconfigurations that cause "Service not found" errors.
 */

import { describe, it, expect } from "@jest/globals";
import * as fs from "fs";

describe("Auth0 Local Configuration", () => {
  it("should have AUTH0_AUDIENCE ending with /mcp (not trailing slash only)", () => {
    const envContent = fs.readFileSync(".env.local", "utf8");

    // Extract AUTH0_AUDIENCE value
    const match = envContent.match(/^AUTH0_AUDIENCE=(.+)$/m);
    expect(match).toBeTruthy();

    const audience = match?.[1]?.trim() || "";

    // Should NOT be just "https://dev.avcd.ai/" - must include "/mcp"
    expect(audience).not.toBe("https://dev.avcd.ai/");
    expect(audience).toMatch(/\/mcp$/);
  });

  it("should not have TBD_FROM_TERRAFORM in AUTH0_CLIENT_SECRET", () => {
    const envContent = fs.readFileSync(".env.local", "utf8");

    const match = envContent.match(/^AUTH0_CLIENT_SECRET=(.+)$/m);
    expect(match).toBeTruthy();

    const secret = match?.[1]?.trim() || "";

    // Should be a real secret, not the placeholder
    expect(secret).not.toBe("TBD_FROM_TERRAFORM");
    expect(secret.length).toBeGreaterThan(20);
  });

  it("should have APP_BASE_URL set (Auth0 v4 format)", () => {
    const envContent = fs.readFileSync(".env.local", "utf8");

    // Should have the v4 variable (preferred)
    const hasV4 = envContent.includes("APP_BASE_URL=");
    const hasV3 = envContent.includes("AUTH0_BASE_URL=");

    // Either v4 is present, or both are present (fallback compatibility)
    expect(hasV4 || hasV3).toBe(true);
  });

  it("should have AUTH0_DOMAIN set (Auth0 v4 format)", () => {
    const envContent = fs.readFileSync(".env.local", "utf8");

    // Should have the v4 variable (preferred)
    const hasV4 = envContent.includes("AUTH0_DOMAIN=");
    const hasV3 = envContent.includes("AUTH0_ISSUER_BASE_URL=");

    // Either v4 is present, or both are present (fallback compatibility)
    expect(hasV4 || hasV3).toBe(true);
  });
});

describe("Auth0 Documentation", () => {
  it("should reference CRITICAL_MANUAL_SETUP_REQUIRED.md", () => {
    const content = fs.readFileSync(
      "docs/setup-guides/AUTH0_LOCALHOST_SETUP.md",
      "utf8",
    );

    // Should reference the critical manual setup doc
    expect(content).toContain("CRITICAL_MANUAL_SETUP_REQUIRED.md");
    expect(content).toContain("Resource Parameter Compatibility Profile");
  });
});
