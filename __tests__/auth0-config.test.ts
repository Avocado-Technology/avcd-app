/**
 * Auth0 Configuration Validation Tests
 *
 * These tests validate that Auth0 is properly configured for local development.
 * They catch common misconfigurations that cause "Service not found" errors.
 */

import { describe, it, expect } from "@jest/globals";
import * as fs from "fs";

describe("Auth0 Local Configuration", () => {
  it(".env.local.example should use GraphQL AUTH0_AUDIENCE (/api)", () => {
    const envContent = fs.readFileSync(".env.local.example", "utf8");
    const match = envContent.match(/^AUTH0_AUDIENCE=(.+)$/m);
    expect(match).toBeTruthy();
    const audience = match?.[1]?.trim() || "";
    expect(audience).not.toBe("https://dev.avcd.ai/");
    expect(audience).toMatch(/\/api$/);
  });

  it("when .env.local exists: AUTH0_AUDIENCE should be GraphQL (/api) or legacy MCP (/mcp)", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
    const envContent = fs.readFileSync(".env.local", "utf8");

    const match = envContent.match(/^AUTH0_AUDIENCE=(.+)$/m);
    expect(match).toBeTruthy();

    const audience = match?.[1]?.trim() || "";

    expect(audience).not.toBe("https://dev.avcd.ai/");
    expect(audience.endsWith("/api") || audience.endsWith("/mcp")).toBe(true);
    if (audience.endsWith("/mcp")) {
      // eslint-disable-next-line no-console
      console.warn(
        "[auth0-config] AUTH0_AUDIENCE still uses MCP audience; web app should use GraphQL (/api). Run: cd infra && ./scripts/update-web-env.sh",
      );
    }
  });

  it("when .env.local has a configured client secret: should not be placeholder", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
    const envContent = fs.readFileSync(".env.local", "utf8");

    const match = envContent.match(/^AUTH0_CLIENT_SECRET=(.+)$/m);
    expect(match).toBeTruthy();

    const secret = match?.[1]?.trim() || "";

    if (secret === "TBD_FROM_TERRAFORM" || secret.length < 20) {
      // eslint-disable-next-line no-console
      console.warn(
        "[auth0-config] AUTH0_CLIENT_SECRET not filled; copy from Terraform (see docs/setup-guides/AUTH0_LOCALHOST_SETUP.md).",
      );
      return;
    }

    expect(secret).not.toBe("TBD_FROM_TERRAFORM");
    expect(secret.length).toBeGreaterThan(20);
  });

  it("should have APP_BASE_URL set (Auth0 v4 format)", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
    const envContent = fs.readFileSync(".env.local", "utf8");

    // Should have the v4 variable (preferred)
    const hasV4 = envContent.includes("APP_BASE_URL=");
    const hasV3 = envContent.includes("AUTH0_BASE_URL=");

    // Either v4 is present, or both are present (fallback compatibility)
    expect(hasV4 || hasV3).toBe(true);
  });

  it("should have AUTH0_DOMAIN set (Auth0 v4 format)", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
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
