/**
 * Development environment validation (repo contract for onboarding).
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const yaml = require("yaml");

describe("Dev Environment Setup Validation", () => {
  describe("Environment File Presence", () => {
    it("should have .env file committed (public defaults)", () => {
      expect(fs.existsSync(".env")).toBe(true);
    });

    it("should have .env.local.example template", () => {
      expect(fs.existsSync(".env.local.example")).toBe(true);
    });

    it("should have .env.local or warn if missing", () => {
      const hasLocal = fs.existsSync(".env.local");
      const hasExample = fs.existsSync(".env.local.example");

      if (!hasLocal) {
        expect(hasExample).toBe(true);
      }
    });
  });

  describe("Keycloak Configuration Structure", () => {
    it("should have Keycloak variables in .env.local.example", () => {
      const content = fs.readFileSync(".env.local.example", "utf8");

      expect(content).toContain("APP_BASE_URL");
      expect(content).toContain("KEYCLOAK_URL");
      expect(content).toContain("KEYCLOAK_CLIENT_ID");
    });

    it("should document local Keycloak setup", () => {
      const content = fs.readFileSync(".env.local.example", "utf8");

      expect(content.toLowerCase()).toContain("keycloak");
    });
  });

  describe("Docker Compose Integration", () => {
    it("should load env files in correct order", () => {
      const compose = yaml.parse(fs.readFileSync("docker-compose.yml", "utf8"));

      const webService = compose.services.web;
      const envFiles = webService.env_file || [];

      const envIndex = envFiles.findIndex(
        (f: { path?: string } | string) => (typeof f === "object" ? f.path : f) === ".env",
      );
      const localIndex = envFiles.findIndex(
        (f: { path?: string } | string) => (typeof f === "object" ? f.path : f) === ".env.local",
      );

      if (envIndex !== -1 && localIndex !== -1) {
        expect(localIndex).toBeGreaterThan(envIndex);
      }
    });

    it("should use develop.watch instead of bind mount for source code", () => {
      const compose = yaml.parse(fs.readFileSync("docker-compose.yml", "utf8"));
      const webService = compose.services.web;

      // Should have develop.watch configured
      expect(webService.develop).toBeDefined();
      expect(webService.develop.watch).toBeDefined();
      expect(webService.develop.watch.length).toBeGreaterThan(0);

      // Should NOT have bind mount of source code
      const volumes = webService.volumes || [];
      expect(volumes.some((v: string) => v.startsWith(".:/app"))).toBe(false);
    });
  });

  describe("No Secret Leakage", () => {
    it("should not have secrets in committed .env", () => {
      const content = fs.readFileSync(".env", "utf8");

      const suspiciousPatterns = [
        /sk-[a-zA-Z0-9]{20,}/,
        /[a-f0-9]{64}/i,
        /client_secret[a-zA-Z0-9]{20,}/i,
      ];

      suspiciousPatterns.forEach((pattern) => {
        expect(content).not.toMatch(pattern);
      });
    });
  });

  describe("Documentation Currency", () => {
    it("should have up-to-date setup guide", () => {
      const guidePath = "docs/setup-guides/AUTH0_LOCALHOST_SETUP.md";
      expect(fs.existsSync(guidePath)).toBe(true);

      const content = fs.readFileSync(guidePath, "utf8");
      expect(content).toContain(".env.local");
    });

    it("should reference docker compose in setup guide", () => {
      const content = fs.readFileSync(
        "docs/setup-guides/AUTH0_LOCALHOST_SETUP.md",
        "utf8",
      );

      expect(content.toLowerCase()).toContain("docker compose");
    });
  });
});
