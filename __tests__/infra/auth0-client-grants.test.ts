import { describe, it, expect } from "@jest/globals";
import { readInfraAuth0Main } from "../helpers/avcd-repo-root";

const here = __dirname;

describe("Auth0 Client Grants", () => {
  it("contract: web_app grant targets GraphQL API and read/write only", () => {
    const main = readInfraAuth0Main(here);
    expect(main).toContain('resource "auth0_client_grant" "web_app_grant"');
    expect(main).toContain(
      "audience  = auth0_resource_server.avcd_graphql_api[0].identifier",
    );
    expect(main).toContain('scopes = ["read", "write"]');
    expect(main).toContain(
      "depends_on = [auth0_resource_server_scopes.avcd_graphql_api_scopes]",
    );
  });

  it("contract: mcp_app grant targets MCP API with read/write/mcp", () => {
    const main = readInfraAuth0Main(here);
    expect(main).toContain('resource "auth0_client_grant" "mcp_app_grant"');
    expect(main).toContain(
      "audience  = auth0_resource_server.avcd_mcp_api[0].identifier",
    );
    expect(main).toContain('scopes = ["read", "write", "mcp"]');
    expect(main).toContain(
      "depends_on = [auth0_resource_server_scopes.avcd_mcp_api_scopes]",
    );
  });
});
