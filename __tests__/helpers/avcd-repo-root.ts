import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const PACKAGE_DIR_NAMES = ["web", "avcd-app"] as const;

/**
 * Directory of the web app package (folder name `web` or GitHub repo `avcd-app`).
 */
export function webPackageRoot(fromPath: string): string {
  const normalized = path.resolve(fromPath);
  const segments = normalized.split(path.sep);
  for (const name of PACKAGE_DIR_NAMES) {
    const idx = segments.lastIndexOf(name);
    if (idx > 0) {
      return segments.slice(0, idx + 1).join(path.sep);
    }
  }
  throw new Error(
    `Could not find web package directory (${PACKAGE_DIR_NAMES.join(" or ")}) in path: ${normalized}`,
  );
}

/**
 * Monorepo root containing `infra/` (parent of `web/`), or the package root when
 * checked out standalone (e.g. CI for avcd-app only).
 */
export function avcdRepoRoot(fromPathUnderWeb: string): string {
  const pkgRoot = webPackageRoot(fromPathUnderWeb);
  const parent = path.dirname(pkgRoot);
  if (fs.existsSync(path.join(parent, "infra", "outputs.tf"))) {
    return parent;
  }
  return pkgRoot;
}

/** True when sibling `infra/outputs.tf` exists (local monorepo layout). */
export function hasMonorepoInfra(fromPathUnderWeb: string): boolean {
  const pkgRoot = webPackageRoot(fromPathUnderWeb);
  const parent = path.dirname(pkgRoot);
  return fs.existsSync(path.join(parent, "infra", "outputs.tf"));
}

/** True when `terraform output` works (backend initialized, not just `.terraform/` present). */
export function canQueryTerraformOutputs(infraDir: string): boolean {
  if (!fs.existsSync(path.join(infraDir, ".terraform"))) {
    return false;
  }
  try {
    execSync("terraform output -json", {
      cwd: infraDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return true;
  } catch {
    return false;
  }
}

function infraPath(fromPathUnderWeb: string, ...parts: string[]): string {
  const root = avcdRepoRoot(fromPathUnderWeb);
  return path.join(root, "infra", ...parts);
}

export function readInfraAuth0Main(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    infraPath(fromPathUnderWeb, "modules", "auth0", "main.tf"),
    "utf8",
  );
}

export function readInfraOutputsTf(fromPathUnderWeb: string): string {
  return fs.readFileSync(infraPath(fromPathUnderWeb, "outputs.tf"), "utf8");
}

export function readInfraModuleAuth0Outputs(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    infraPath(fromPathUnderWeb, "modules", "auth0", "outputs.tf"),
    "utf8",
  );
}

export function readUpdateWebEnvScript(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    path.join(avcdRepoRoot(fromPathUnderWeb), "infra", "scripts", "update-web-env.sh"),
    "utf8",
  );
}
