import { describe, it, expect } from "@jest/globals";
import { readFileSync } from "fs";
import { join } from "path";

describe("Keycloak web deploy env", () => {
  it("render-web-env.py emits KEYCLOAK_* vars when configured", () => {
    const script = readFileSync(
      join(
        process.cwd(),
        ".github/actions/droplet-compose-deploy/render-web-env.py",
      ),
      "utf8",
    );
    expect(script).toContain("KEYCLOAK_URL=");
    expect(script).toContain("KEYCLOAK_CLIENT_SECRET=");
    expect(script).toContain("KEYCLOAK_AUDIENCE=");
    expect(script).toContain("E_KEYCLOAK_URL");
  });

  it("deploy workflow passes Keycloak secrets to droplet-compose-deploy", () => {
    const workflow = readFileSync(
      join(process.cwd(), ".github/workflows/deploy-digitalocean-dev.yml"),
      "utf8",
    );
    expect(workflow).toContain("web_keycloak_url:");
    expect(workflow).toContain("web_keycloak_client_secret:");
    expect(workflow).toContain("KEYCLOAK_WEB_CLIENT_SECRET");
  });
});
