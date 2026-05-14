/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const yaml = require("yaml");

function loadCompose() {
  const content = fs.readFileSync("docker-compose.yml", "utf8");
  return yaml.parse(content);
}

describe("Docker Compose Environment Configuration", () => {
  it("should use env_file to load environment files", () => {
    const compose = loadCompose();
    const webService = compose.services.web;

    expect(webService.env_file).toBeDefined();
    expect(webService.env_file.length).toBeGreaterThan(0);
  });

  it("should load .env and .env.local via env_file", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const envFiles = webService.env_file || [];

    const hasEnvFile = envFiles.some(
      (f: { path?: string } | string) =>
        (typeof f === "string" && f === ".env") ||
        (typeof f === "object" && f.path === ".env"),
    );
    const hasEnvLocal = envFiles.some(
      (f: { path?: string } | string) =>
        (typeof f === "string" && f === ".env.local") ||
        (typeof f === "object" && f.path === ".env.local"),
    );

    expect(hasEnvFile).toBe(true);
    expect(hasEnvLocal).toBe(true);
  });

  it("should not duplicate more than 5 env vars in environment section", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const envVars = webService.environment || {};

    const envCount = Object.keys(envVars).length;
    expect(envCount).toBeLessThanOrEqual(5);
  });

  it("should have required overrides in environment section", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const envVars = webService.environment || {};

    expect(envVars.NODE_ENV).toBeDefined();
    expect(envVars.WATCHPACK_POLLING).toBe("true");
  });

  it("should not have empty defaults for critical secrets", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const envVars = webService.environment || {};

    const auth0Secret = envVars.AUTH0_SECRET;
    if (auth0Secret !== undefined) {
      expect(auth0Secret).not.toBe("");
    }
  });
});
