import { beforeAll, describe, expect, it } from "@jest/globals";
import * as fs from "fs";

describe("NPM Scripts Configuration", () => {
  let packageJson: { scripts: Record<string, string> };

  beforeAll(() => {
    packageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };
  });

  it("should have dev script using docker compose", () => {
    expect(packageJson.scripts.dev).toContain("docker");
    expect(packageJson.scripts.dev).toContain("compose");
  });

  it("should have dev:local fallback", () => {
    expect(packageJson.scripts["dev:local"]).toBeDefined();
    expect(packageJson.scripts["dev:local"]).toContain("next dev");
  });

  it("should preserve dev:turbo with turbopack", () => {
    expect(packageJson.scripts["dev:turbo"]).toContain("turbopack");
  });

  it("should not have old local dev as default", () => {
    expect(packageJson.scripts.dev).not.toBe("next dev");
  });
});

describe("Docker entrypoint", () => {
  it("should run Next.js in-container via dev:local (not docker compose)", () => {
    const script = fs.readFileSync("docker-entrypoint-dev.sh", "utf8");
    expect(script).toContain("exec npm run dev:local");
    expect(script).not.toContain("exec npm run dev\n");
  });
});

describe("Documentation References", () => {
  it("should reference npm run dev in docker docs", () => {
    const content = fs.readFileSync("docs/DOCKER_DEVELOPMENT.md", "utf8");
    expect(content).toContain("npm run dev");
    expect(content).toContain("docker compose");
  });
});

