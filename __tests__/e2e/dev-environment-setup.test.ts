/**
 * E2E-style acceptance tests for dev environment layout (files + compose).
 * No network; validates repository contract for onboarding.
 */

const fs = require("fs");
const yaml = require("yaml");

describe("E2E: Dev Environment Setup - Business Goal: New developer can set up and run authenticated dev environment", () => {
  it("should have all required environment files and templates", () => {
    const expectedFiles = [".env", ".env.local.example"];

    const results = expectedFiles.map((f) => ({
      file: f,
      exists: fs.existsSync(f),
    }));

    results.forEach((r) => {
      expect(r.exists).toBe(true);
    });
  });

  it("should validate Keycloak / Auth.js environment variables in template", () => {
    const requiredVars = [
      "AUTH_SECRET",
      "APP_BASE_URL",
      "KEYCLOAK_URL",
      "KEYCLOAK_CLIENT_ID",
      "KEYCLOAK_CLIENT_SECRET",
      "KEYCLOAK_AUDIENCE",
    ];

    const envExample = fs.readFileSync(".env.local.example", "utf8");

    requiredVars.forEach((v) => {
      expect(envExample).toContain(v);
    });
  });

  it("should have docker compose loading env files correctly", () => {
    const composeContent = fs.readFileSync("docker-compose.yml", "utf8");
    const compose = yaml.parse(composeContent);

    const webService = compose.services.web;
    const envFiles = webService.env_file || [];

    expect(envFiles.length).toBeGreaterThan(0);
    expect(
      envFiles.some(
        (f: { path?: string } | string) =>
          (typeof f === "string" && f.includes(".env")) ||
          (typeof f === "object" && f.path && f.path.includes(".env")),
      ),
    ).toBe(true);

    const envCount = Object.keys(webService.environment || {}).length;
    expect(envCount).toBeLessThan(10);
  });

  it("should start web container with valid env config", async () => {
    const inDocker = process.env.DOCKER_CONTAINER === "true";
    if (!inDocker) {
      return;
    }

    const required = ["AUTH_SECRET", "APP_BASE_URL", "KEYCLOAK_URL"];

    required.forEach((v) => {
      expect(process.env[v]).toBeDefined();
      expect(process.env[v]).not.toBe("");
    });
  });
});
