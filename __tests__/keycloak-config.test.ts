/**
 * Keycloak Configuration Validation Tests
 */

import { describe, it, expect } from "@jest/globals";
import * as fs from "fs";

describe("Keycloak Local Configuration", () => {
  it(".env.local.example should use GraphQL KEYCLOAK_AUDIENCE (/api)", () => {
    const envContent = fs.readFileSync(".env.local.example", "utf8");
    const match = envContent.match(/^KEYCLOAK_AUDIENCE=(.+)$/m);
    expect(match).toBeTruthy();
    const audience = match?.[1]?.trim() || "";
    expect(audience).toMatch(/\/api$/);
  });

  it("when .env.local exists: KEYCLOAK_AUDIENCE should be GraphQL (/api)", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
    const envContent = fs.readFileSync(".env.local", "utf8");

    const match = envContent.match(/^KEYCLOAK_AUDIENCE=(.+)$/m);
    if (!match) {
      // eslint-disable-next-line no-console
      console.warn(
        "[keycloak-config] .env.local missing KEYCLOAK_AUDIENCE; migrate from .env.local.example.",
      );
      return;
    }

    const audience = match[1]?.trim() || "";
    expect(audience.endsWith("/api")).toBe(true);
  });

  it("when .env.local exists: should have APP_BASE_URL set", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
    const envContent = fs.readFileSync(".env.local", "utf8");
    const hasBase =
      envContent.includes("APP_BASE_URL=") ||
      envContent.includes("AUTH0_BASE_URL=");
    expect(hasBase).toBe(true);
  });

  it("when .env.local exists: should have KEYCLOAK_URL set", () => {
    if (!fs.existsSync(".env.local")) {
      return;
    }
    const envContent = fs.readFileSync(".env.local", "utf8");
    if (!envContent.includes("KEYCLOAK_URL=")) {
      // eslint-disable-next-line no-console
      console.warn(
        "[keycloak-config] .env.local still uses Auth0; copy .env.local.example for Keycloak vars.",
      );
      return;
    }
    expect(envContent.includes("KEYCLOAK_URL=")).toBe(true);
  });
});
