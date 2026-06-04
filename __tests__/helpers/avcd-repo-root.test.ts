import { describe, it, expect } from "@jest/globals";
import * as path from "path";
import { avcdRepoRoot, hasMonorepoInfra, webPackageRoot } from "./avcd-repo-root";

describe("avcd-repo-root", () => {
  it("resolves web package root from paths under web/", () => {
    const pkg = webPackageRoot(path.join(__dirname, "..", "infra"));
    expect(pkg.endsWith(`${path.sep}web`)).toBe(true);
  });

  it("resolves avcd-app package root from CI-style paths", () => {
    const pkg = webPackageRoot(
      "/home/runner/work/avcd-app/avcd-app/__tests__/infra",
    );
    expect(pkg).toBe("/home/runner/work/avcd-app/avcd-app");
  });

  it("detects monorepo infra when sibling infra/ exists", () => {
    expect(hasMonorepoInfra(__dirname)).toBe(
      hasMonorepoInfra(path.join(__dirname)),
    );
  });

  it("avcdRepoRoot returns parent when infra is a sibling of web/", () => {
    if (!hasMonorepoInfra(__dirname)) {
      return;
    }
    const root = avcdRepoRoot(__dirname);
    expect(root.endsWith(`${path.sep}avcd`)).toBe(true);
  });
});
