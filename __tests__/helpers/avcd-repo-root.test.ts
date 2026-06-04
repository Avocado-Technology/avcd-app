import { describe, it, expect } from "@jest/globals";
import * as fs from "fs";
import * as path from "path";
import { avcdRepoRoot, hasMonorepoInfra, webPackageRoot } from "./avcd-repo-root";

const PACKAGE_NAMES = ["web", "avcd-app"] as const;

describe("avcd-repo-root", () => {
  it("resolves package root from paths under this checkout", () => {
    const pkg = webPackageRoot(path.join(__dirname, "..", "infra"));
    expect(PACKAGE_NAMES).toContain(path.basename(pkg));
    expect(fs.existsSync(path.join(pkg, "package.json"))).toBe(true);
  });

  it("resolves avcd-app package root from CI-style paths", () => {
    const pkg = webPackageRoot(
      "/home/runner/work/avcd-app/avcd-app/__tests__/infra",
    );
    expect(pkg).toBe("/home/runner/work/avcd-app/avcd-app");
  });

  it("detects monorepo infra when sibling infra/outputs.tf exists", () => {
    const detected = hasMonorepoInfra(__dirname);
    const pkg = webPackageRoot(__dirname);
    const parent = path.dirname(pkg);
    const expected = fs.existsSync(path.join(parent, "infra", "outputs.tf"));
    expect(detected).toBe(expected);
  });

  it("avcdRepoRoot points at monorepo root when infra is a sibling of the package", () => {
    if (!hasMonorepoInfra(__dirname)) {
      return;
    }
    const root = avcdRepoRoot(__dirname);
    expect(fs.existsSync(path.join(root, "infra", "outputs.tf"))).toBe(true);
  });
});
