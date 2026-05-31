import { describe, it, expect } from "@jest/globals";
import { readFileSync } from "fs";
import { join } from "path";

const webRoot = join(process.cwd());

describe("Infisical web deploy env", () => {
  it("deploy-digitalocean-dev.yml has OIDC permissions and Infisical export", () => {
    const workflow = readFileSync(
      join(webRoot, ".github/workflows/deploy-digitalocean-dev.yml"),
      "utf8",
    );
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("INFISICAL_OIDC_IDENTITY_ID");
    expect(workflow).toContain("infisical login --method=oidc-auth");
    expect(workflow).toContain("--machine-identity-id=");
    expect(workflow).toContain("infisical export");
    expect(workflow).toContain(".env.infisical");
  });

  it("deploy-digitalocean-dev.yml does not reference GitHub app secrets", () => {
    const workflow = readFileSync(
      join(webRoot, ".github/workflows/deploy-digitalocean-dev.yml"),
      "utf8",
    );
    expect(workflow).not.toContain("WEB_AUTH0_SECRET");
    expect(workflow).not.toContain("KEYCLOAK_WEB_CLIENT_SECRET");
    expect(workflow).not.toContain("web_keycloak_client_secret");
    expect(workflow).not.toContain("OPENAI_API_KEY");
  });

  it("deploy workflow validates required Keycloak secrets after export", () => {
    const workflow = readFileSync(
      join(webRoot, ".github/workflows/deploy-digitalocean-dev.yml"),
      "utf8",
    );
    expect(workflow).toContain("KEYCLOAK_CLIENT_SECRET");
    expect(workflow).toContain("AUTH_SECRET");
    expect(workflow).toContain("KEYCLOAK_AUDIENCE");
  });

  it("docker-compose.yml loads .env.infisical", () => {
    const compose = readFileSync(
      join(webRoot, "deploy/production/docker-compose.yml"),
      "utf8",
    );
    expect(compose).toContain(".env.infisical");
    expect(compose).toContain("KEYCLOAK_CLIENT_SECRET");
    expect(compose).toContain("AUTH_SECRET");
  });

  it("KEYCLOAK_AUDIENCE in workflow validation avoids host-only trailing slash", () => {
    const workflow = readFileSync(
      join(webRoot, ".github/workflows/deploy-digitalocean-dev.yml"),
      "utf8",
    );
    expect(workflow).not.toMatch(/KEYCLOAK_AUDIENCE.*dev\.avcd\.ai\/"/);
  });
});
