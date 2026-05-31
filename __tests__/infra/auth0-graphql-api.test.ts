import { describe, it, expect } from "@jest/globals";
import * as path from "path";
import { execSync } from "child_process";
import {
  avcdRepoRoot,
  readInfraAuth0Main,
  readInfraModuleAuth0Outputs,
  canQueryTerraformOutputs,
} from "../helpers/avcd-repo-root";

const here = __dirname;

describe("Auth0 GraphQL API Resource Server", () => {
  it("contract: GraphQL API resource exists in Terraform module", () => {
    const main = readInfraAuth0Main(here);
    expect(main).toContain('resource "auth0_resource_server" "avcd_graphql_api"');
    expect(main).toContain("auth0_resource_server_scopes.avcd_graphql_api_scopes");
  });

  it("contract: module exposes graphql_api_identifier output", () => {
    const out = readInfraModuleAuth0Outputs(here);
    expect(out).toContain("graphql_api_identifier");
  });

  it("live (optional): graphql output ends with /api when terraform is initialized", () => {
    const infraDir = path.join(avcdRepoRoot(here), "infra");
    if (!canQueryTerraformOutputs(infraDir)) {
      expect(true).toBe(true);
      return;
    }
    const id = execSync("terraform output -raw auth0_graphql_api_identifier", {
      cwd: infraDir,
      encoding: "utf8",
    }).trim();
    expect(id).toMatch(/\/api$/);
  });
});
