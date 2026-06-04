import { it, expect } from "@jest/globals";
import { describeMonorepoInfra as describe } from "../helpers/test-guards";
import * as fs from "fs";
import * as path from "path";
import { avcdRepoRoot } from "../helpers/avcd-repo-root";

const here = __dirname;

describe("Auth0 Documentation", () => {
  it("should document both API identifiers and dev URLs", () => {
    const content = fs.readFileSync(
      path.join(
        avcdRepoRoot(here),
        "web",
        "docs",
        "setup-guides",
        "AUTH0_LOCALHOST_SETUP.md",
      ),
      "utf8",
    );
    expect(content).toContain("auth0_graphql_api_identifier");
    expect(content).toContain("auth0_mcp_api_identifier");
    expect(content).toContain("https://dev.avcd.ai/api");
    expect(content).toContain("https://dev.avcd.ai/mcp");
  });
});
