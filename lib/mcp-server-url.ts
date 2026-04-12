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
