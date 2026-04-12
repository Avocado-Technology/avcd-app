/**
 * Canonical MCP HTTP(S) URL for this deployment (JWT audience / Claude connector URL).
 *
 * Order: explicit AVCD_MCP_URL → NEXT_PUBLIC_AVCD_MCP_URL → derive from PUBLIC_HOST
 * when not localhost (same host as the web app, Traefik path `/mcp`) → local default.
 */
export function getMcpServerUrl(): string {
  const explicit =
    process.env.AVCD_MCP_URL?.trim() ||
    process.env.NEXT_PUBLIC_AVCD_MCP_URL?.trim();
  if (explicit) return explicit;

  const host = process.env.PUBLIC_HOST?.trim();
  if (host && host !== "localhost") {
    return `https://${host}/mcp`;
  }

  return "http://localhost:3001/mcp";
}

/**
 * Public authorization server URL for OAuth-capable MCP clients.
 * This is the `authorization_servers[0]` value from MCP resource metadata.
 *
 * Matches mcp-app/server.ts /.well-known/oauth-protected-resource logic:
 * - Production: https://${PUBLIC_HOST}/auth
 * - Local dev: http://localhost:8010
 *
 * Override with AVCD_PUBLIC_AUTH_URL or NEXT_PUBLIC_AVCD_AUTH_ISSUER if needed.
 */
export function getOAuthAuthorizationServerUrl(): string {
  const explicit =
    process.env.AVCD_PUBLIC_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_AVCD_AUTH_ISSUER?.trim();
  if (explicit) return explicit;

  const host = process.env.PUBLIC_HOST?.trim();
  if (host && host !== "localhost") {
    return `https://${host}/auth`;
  }

  return "http://localhost:8010";
}

/**
 * MCP resource metadata URL (RFC 9728 discovery endpoint).
 * Clients can fetch this to discover authorization_servers and bearer_methods_supported.
 *
 * Returns absolute URL: {mcpServerUrl}/.well-known/oauth-protected-resource
 * Note: Some clients may receive this as a relative path in WWW-Authenticate headers.
 */
export function getMcpResourceMetadataUrl(): string {
  const mcpUrl = getMcpServerUrl();
  return `${mcpUrl}/.well-known/oauth-protected-resource`;
}
