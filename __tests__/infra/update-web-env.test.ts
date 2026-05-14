import { describe, it, expect } from "@jest/globals";
import { readUpdateWebEnvScript } from "../helpers/avcd-repo-root";

const here = __dirname;

describe("Update Web Env Script", () => {
  it("should read AUTH0_AUDIENCE from auth0_graphql_api_identifier terraform output", () => {
    const script = readUpdateWebEnvScript(here);
    expect(script).toContain(".auth0_graphql_api_identifier.value");
    expect(script).toContain("AUTH0_GRAPHQL_API_IDENTIFIER");
    expect(script).toContain("AUTH0_AUDIENCE");
    expect(script).not.toContain(".auth0_api_identifier.value");
  });
});
