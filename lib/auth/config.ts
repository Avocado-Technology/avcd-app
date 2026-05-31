export type KeycloakAuthEnv = {
  KEYCLOAK_URL?: string;
  KEYCLOAK_REALM?: string;
  KEYCLOAK_CLIENT_ID?: string;
  KEYCLOAK_CLIENT_SECRET?: string;
  KEYCLOAK_AUDIENCE?: string;
  /** OIDC scope for Auth.js authorization (from Infisical / Terraform web-secrets). */
  KEYCLOAK_OIDC_SCOPE?: string;
  AUTH_SECRET?: string;
  APP_BASE_URL?: string;
};

export type KeycloakAuthConfig = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  authorizationParams: {
    scope: string;
    kc_idp_hint: string;
  };
};

export function buildKeycloakAuthConfig(
  env: KeycloakAuthEnv | NodeJS.ProcessEnv,
): KeycloakAuthConfig {
  const keycloakUrl = env.KEYCLOAK_URL?.trim();
  if (!keycloakUrl) {
    throw new Error("KEYCLOAK_URL is required");
  }

  const realm = env.KEYCLOAK_REALM?.trim() || "avcd";
  const clientId = env.KEYCLOAK_CLIENT_ID?.trim();
  const clientSecret = env.KEYCLOAK_CLIENT_SECRET?.trim();
  const audience = env.KEYCLOAK_AUDIENCE?.trim();

  if (!clientId) {
    throw new Error("KEYCLOAK_CLIENT_ID is required");
  }
  if (!clientSecret) {
    throw new Error("KEYCLOAK_CLIENT_SECRET is required");
  }
  if (!audience) {
    throw new Error("KEYCLOAK_AUDIENCE is required");
  }

  const issuer = `${keycloakUrl.replace(/\/$/, "")}/realms/${realm}`;

  const oidcScope =
    env.KEYCLOAK_OIDC_SCOPE?.trim() || "openid profile email";
  if (oidcScope.includes("offline_access")) {
    throw new Error(
      "KEYCLOAK_OIDC_SCOPE must not include offline_access (Keycloak broker login rejects it)",
    );
  }

  return {
    issuer,
    clientId,
    clientSecret,
    audience,
    authorizationParams: {
      scope: oidcScope,
      kc_idp_hint: "google",
    },
  };
}
