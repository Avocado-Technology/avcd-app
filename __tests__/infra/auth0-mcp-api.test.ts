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

describe("Auth0 MCP API Resource Server", () => {
  it("contract: MCP API is avcd_mcp_api (not avcd_api resource block)", () => {
    const main = readInfraAuth0Main(here);
    expect(main).toContain('resource "auth0_resource_server" "avcd_mcp_api"');
    expect(main).not.toMatch(
      /^\s*resource\s+"auth0_resource_server"\s+"avcd_api"\s*$/m,
    );
    expect(main).toContain("auth0_resource_server_scopes.avcd_mcp_api_scopes");
    expect(main).toContain("moved");
    expect(main).toContain("auth0_resource_server.avcd_api");
    expect(main).toContain("auth0_resource_server.avcd_mcp_api");
  });

  it("contract: module exposes mcp_api_identifier output", () => {
    const out = readInfraModuleAuth0Outputs(here);
    expect(out).toContain("mcp_api_identifier");
  });

  it("live (optional): MCP output ends with /mcp when terraform is initialized", () => {
    const infraDir = path.join(avcdRepoRoot(here), "infra");
    if (!canQueryTerraformOutputs(infraDir)) {
      expect(true).toBe(true);
      return;
    }
    const id = execSync("terraform output -raw auth0_mcp_api_identifier", {
      cwd: infraDir,
      encoding: "utf8",
    }).trim();
    expect(id).toMatch(/\/mcp$/);
  });
});
