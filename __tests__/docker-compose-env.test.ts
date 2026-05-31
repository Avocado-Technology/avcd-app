/* eslint-disable @typescript-eslint/no-require-imports */
import * as fs from "fs";
import * as yaml from "yaml";

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

  it("should not duplicate more than 6 env vars in environment section", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const envVars = webService.environment || {};

    const envCount = Object.keys(envVars).length;
    expect(envCount).toBeLessThanOrEqual(6);
  });

  it("should have required overrides in environment section", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const envVars = webService.environment || {};

    expect(envVars.NODE_ENV).toBeDefined();
    expect(envVars.WATCHPACK_POLLING).toBe("true");
  });

  it("should have develop.watch configured for hot reload", () => {
    const compose = loadCompose();
    const webService = compose.services.web;

    expect(webService.develop).toBeDefined();
    expect(webService.develop.watch).toBeDefined();
    expect(webService.develop.watch.length).toBeGreaterThan(0);
  });

  it("should use named volumes for node_modules and .next (not bind mount)", () => {
    const compose = loadCompose();
    const webService = compose.services.web;
    const volumes = webService.volumes || [];

    // Should NOT have bind mount of source code (that's handled by watch)
    expect(volumes.some((v: string) => v.startsWith(".:/app"))).toBe(false);

    // Should have named volumes for node_modules and .next
    expect(volumes.some((v: string) => v.includes("app_node_modules:/app/node_modules"))).toBe(true);
    expect(volumes.some((v: string) => v.includes("app_next:/app/.next"))).toBe(true);
  });
});
