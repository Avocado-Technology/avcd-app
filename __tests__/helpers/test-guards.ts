import { hasMonorepoInfra } from "./avcd-repo-root";

const here = __dirname;

export const isCi =
  process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

/** Live deploy / auth redirect checks against dev.avcd.ai */
export const shouldRunLiveDeployE2e =
  !isCi && process.env.E2E_SKIP_DEPLOY !== "1";

/** Terraform contract tests under ../infra (local monorepo only; skipped in CI) */
export const shouldRunMonorepoInfraTests =
  hasMonorepoInfra(here) && !isCi;

export const describeLiveDeployE2e = shouldRunLiveDeployE2e
  ? describe
  : describe.skip;

export const describeMonorepoInfra = shouldRunMonorepoInfraTests
  ? describe
  : describe.skip;
