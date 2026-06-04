import { hasMonorepoInfra } from "./avcd-repo-root";

const here = __dirname;

export const isCi =
  process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

/** Live deploy / auth redirect checks against dev.avcd.ai */
export const shouldRunLiveDeployE2e =
  !isCi && process.env.E2E_SKIP_DEPLOY !== "1";

/** Terraform contract tests under ../infra (monorepo checkout only) */
export const shouldRunMonorepoInfraTests = hasMonorepoInfra(here);

export const describeLiveDeployE2e = shouldRunLiveDeployE2e
  ? describe
  : describe.skip;

export const describeMonorepoInfra = shouldRunMonorepoInfraTests
  ? describe
  : describe.skip;
