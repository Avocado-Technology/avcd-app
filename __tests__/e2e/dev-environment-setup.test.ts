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

  it("should validate Auth0 v4 environment variables without v3 confusion", () => {
    const requiredV4Vars = [
      "AUTH0_SECRET",
      "APP_BASE_URL",
      "AUTH0_DOMAIN",
      "AUTH0_CLIENT_ID",
      "AUTH0_CLIENT_SECRET",
      "AUTH0_AUDIENCE",
    ];

    const envExample = fs.readFileSync(".env.local.example", "utf8");

    requiredV4Vars.forEach((v) => {
      expect(envExample).toContain(v);
    });

    expect(envExample).not.toContain("AUTH0_ISSUER_BASE_URL");
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

    const required = ["AUTH0_SECRET", "APP_BASE_URL", "AUTH0_DOMAIN"];

    required.forEach((v) => {
      expect(process.env[v]).toBeDefined();
      expect(process.env[v]).not.toBe("");
    });
  });
});
