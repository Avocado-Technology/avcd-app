import { buildKeycloakAuthConfig } from "../config";

describe("Keycloak auth config", () => {
  const baseEnv = {
    KEYCLOAK_URL: "https://auth.dev.avcd.ai",
    KEYCLOAK_REALM: "avcd",
    KEYCLOAK_CLIENT_ID: "avcd-web",
    KEYCLOAK_CLIENT_SECRET: "test-secret",
    KEYCLOAK_AUDIENCE: "https://dev.avcd.ai/api",
    AUTH_SECRET: "test-auth-secret-32-chars-minimum!!",
    APP_BASE_URL: "http://localhost:3000",
  };

  it("GivenKeycloakEnv_WhenBuildingAuthConfig_ThenIssuerMatchesRealm", () => {
    const config = buildKeycloakAuthConfig(baseEnv);
    expect(config.issuer).toBe("https://auth.dev.avcd.ai/realms/avcd");
    expect(config.clientId).toBe("avcd-web");
    expect(config.audience).toBe("https://dev.avcd.ai/api");
  });

  it("GivenKeycloakEnv_WhenBuildingAuthConfig_ThenIncludesKcIdpHintGoogle", () => {
    const config = buildKeycloakAuthConfig(baseEnv);
    expect(config.authorizationParams.kc_idp_hint).toBe("google");
    expect(config.authorizationParams.scope).toContain("offline_access");
  });

  it("GivenMissingKeycloakUrl_WhenBuildingAuthConfig_ThenThrows", () => {
    expect(() =>
      buildKeycloakAuthConfig({ ...baseEnv, KEYCLOAK_URL: "" }),
    ).toThrow("KEYCLOAK_URL is required");
  });
});
