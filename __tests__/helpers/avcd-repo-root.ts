import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * Resolve the monorepo root that contains both `web/` and `infra/`
 * from any path under the `web` package (e.g. `web/__tests__/...`).
 */
export function avcdRepoRoot(fromPathUnderWeb: string): string {
  const normalized = path.resolve(fromPathUnderWeb);
  const segments = normalized.split(path.sep);
  const webIdx = segments.lastIndexOf("web");
  if (webIdx <= 0) {
    throw new Error(
      `Could not find 'web' directory segment in path: ${normalized}`,
    );
  }
  return segments.slice(0, webIdx).join(path.sep);
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

export function readInfraAuth0Main(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    path.join(
      avcdRepoRoot(fromPathUnderWeb),
      "infra",
      "modules",
      "auth0",
      "main.tf",
    ),
    "utf8",
  );
}

export function readInfraOutputsTf(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    path.join(avcdRepoRoot(fromPathUnderWeb), "infra", "outputs.tf"),
    "utf8",
  );
}

export function readInfraModuleAuth0Outputs(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    path.join(
      avcdRepoRoot(fromPathUnderWeb),
      "infra",
      "modules",
      "auth0",
      "outputs.tf",
    ),
    "utf8",
  );
}

export function readUpdateWebEnvScript(fromPathUnderWeb: string): string {
  return fs.readFileSync(
    path.join(
      avcdRepoRoot(fromPathUnderWeb),
      "infra",
      "scripts",
      "update-web-env.sh",
    ),
    "utf8",
  );
}
