import { describe, it, expect } from "@jest/globals";
import * as path from "path";
import { execSync } from "child_process";
import { avcdRepoRoot, readInfraOutputsTf, canQueryTerraformOutputs } from "../helpers/avcd-repo-root";

const here = __dirname;

describe("Terraform Outputs (Auth0 APIs)", () => {
  it("contract: root outputs.tf defines auth0_graphql_api_identifier", () => {
    const outputs = readInfraOutputsTf(here);
    expect(outputs).toContain("output \"auth0_graphql_api_identifier\"");
  });

  it("contract: root outputs.tf defines auth0_mcp_api_identifier", () => {
    const outputs = readInfraOutputsTf(here);
    expect(outputs).toContain("output \"auth0_mcp_api_identifier\"");
  });

  it("live (optional): terraform output JSON includes both keys when initialized", () => {
    const infraDir = path.join(avcdRepoRoot(here), "infra");
    if (!canQueryTerraformOutputs(infraDir)) {
      expect(true).toBe(true);
      return;
    }
    const json = execSync("terraform output -json", {
      cwd: infraDir,
      encoding: "utf8",
    });
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect(parsed).toHaveProperty("auth0_graphql_api_identifier");
    expect(parsed).toHaveProperty("auth0_mcp_api_identifier");
  });
});
