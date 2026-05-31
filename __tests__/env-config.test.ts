/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");

describe("Environment File Structure", () => {
  it("should have .env file committed to git", () => {
    expect(fs.existsSync(".env")).toBe(true);
  });

  it("should not contain secrets in .env", () => {
    const envContent = fs.readFileSync(".env", "utf8");

    expect(envContent).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
    expect(envContent).not.toMatch(/[a-f0-9]{32,}/i);
  });

  it("should contain only NEXT_PUBLIC_ and non-sensitive vars", () => {
    const envContent = fs.readFileSync(".env", "utf8");

    expect(envContent).toContain("NEXT_PUBLIC_AVCD_API_URL");
    expect(envContent).toContain("NEXT_PUBLIC_MCP_SERVER_URL");
  });
});

describe("Environment Local Template", () => {
  it("should have .env.local.example file", () => {
    expect(fs.existsSync(".env.local.example")).toBe(true);
  });

  it("should contain all required Keycloak / Auth.js variables", () => {
    const content = fs.readFileSync(".env.local.example", "utf8");

    expect(content).toContain("AUTH_SECRET");
    expect(content).toContain("APP_BASE_URL");
    expect(content).toContain("KEYCLOAK_URL");
    expect(content).toContain("KEYCLOAK_CLIENT_ID");
    expect(content).toContain("KEYCLOAK_CLIENT_SECRET");
    expect(content).toContain("KEYCLOAK_AUDIENCE");
  });

  it("should have empty values or placeholders for secrets", () => {
    const content = fs.readFileSync(".env.local.example", "utf8");

    expect(content).toContain("KEYCLOAK_CLIENT_ID=");
    expect(content).toContain("local-web-client-secret");
  });
});
