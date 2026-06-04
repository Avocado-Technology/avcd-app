/**
 * Auth0 API separation: GraphQL audience for web, MCP audience for MCP clients.
 * Contract tests read Terraform sources (no remote state required).
 * When `infra/.terraform` exists, also asserts live `terraform output` values.
 */

import { it, expect } from "@jest/globals";
import { describeMonorepoInfra as describe } from "../helpers/test-guards";
import * as path from "path";
import { execSync } from "child_process";
import {
  avcdRepoRoot,
  readInfraAuth0Main,
  readInfraOutputsTf,
  canQueryTerraformOutputs,
} from "../helpers/avcd-repo-root";

const here = __dirname;

describe("E2E: Auth0 API Separation - Web and MCP use distinct audiences", () => {
  it("should have separate API identifiers for GraphQL and MCP (contract + optional live)", () => {
    const main = readInfraAuth0Main(here);
    const outputs = readInfraOutputsTf(here);
    expect(main).toMatch(
      /resource\s+"auth0_resource_server"\s+"avcd_graphql_api"/,
    );
    expect(main).toMatch(/resource\s+"auth0_resource_server"\s+"avcd_mcp_api"/);
    expect(outputs).toContain("auth0_graphql_api_identifier");
    expect(outputs).toContain("auth0_mcp_api_identifier");

    const infraDir = path.join(avcdRepoRoot(here), "infra");
    if (!canQueryTerraformOutputs(infraDir)) {
      return;
    }
    const graphqlAudience = execSync(
      "terraform output -raw auth0_graphql_api_identifier",
      { cwd: infraDir, encoding: "utf8" },
    ).trim();
    const mcpAudience = execSync("terraform output -raw auth0_mcp_api_identifier", {
      cwd: infraDir,
      encoding: "utf8",
    }).trim();

    expect(graphqlAudience).not.toBe(mcpAudience);
    expect(graphqlAudience).toMatch(/\/api$/);
    expect(mcpAudience).toMatch(/\/mcp$/);
  });

  it("should have web app granted to GraphQL API only (Terraform contract)", () => {
    const main = readInfraAuth0Main(here);
    expect(main).toContain(
      "audience  = auth0_resource_server.avcd_graphql_api[0].identifier",
    );
    expect(main).toContain('resource "auth0_client_grant" "web_app_grant"');
    expect(main).toContain('scopes = ["read", "write"]');
  });

  it("should have MCP app granted to MCP API only (Terraform contract)", () => {
    const main = readInfraAuth0Main(here);
    expect(main).toContain(
      "audience  = auth0_resource_server.avcd_mcp_api[0].identifier",
    );
    expect(main).toContain('resource "auth0_client_grant" "mcp_app_grant"');
    expect(main).toContain('scopes = ["read", "write", "mcp"]');
  });
});
