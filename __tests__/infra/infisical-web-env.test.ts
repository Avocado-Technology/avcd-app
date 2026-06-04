import { describe, it, expect } from "@jest/globals";
import { readFileSync } from "fs";
import { join } from "path";

const webRoot = join(process.cwd());

describe("Infisical web deploy env", () => {
  it("deploy-digitalocean-dev.yml has OIDC permissions and remote Infisical render", () => {
    const workflow = readFileSync(
      join(webRoot, ".github/workflows/deploy-digitalocean-dev.yml"),
      "utf8",
    );
    const renderScript = readFileSync(
      join(webRoot, "scripts/ci/render-secrets-via-deploy-host.sh"),
      "utf8",
    );
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("INFISICAL_OIDC_IDENTITY_ID");
    expect(workflow).toContain("render-secrets-via-deploy-host.sh");
    expect(workflow).toContain("DEPLOY_USER");
    expect(workflow).toContain("deploy");
    expect(renderScript).toContain("infisical login --method=oidc-auth");
    expect(renderScript).toContain("--machine-identity-id=");
    expect(renderScript).toContain("secrets.ci.template");
    expect(
      readFileSync(join(webRoot, ".kamal/secrets.ci.template"), "utf8"),
    ).toContain("infisical export");
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
    expect(workflow).toContain("KEYCLOAK_OIDC_SCOPE");
    expect(workflow).toContain("offline_access");
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
