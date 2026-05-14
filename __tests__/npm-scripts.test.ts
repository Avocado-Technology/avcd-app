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
