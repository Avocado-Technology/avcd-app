import type { CSSProperties } from "react";

/**
 * Post-login instructions for connecting AVCD MCP to Claude (web or Desktop).
 * Shows both OAuth/discovery (Method A) and manual Bearer JWT (Method B).
 * Placed above AvcdAccessTokenPanel so steps refer to "sections below".
 */
export function ClaudeConnectionSteps({
  mcpServerUrl,
  authIssuerUrl,
  resourceMetadataUrl,
}: {
  mcpServerUrl: string;
  authIssuerUrl: string;
  resourceMetadataUrl: string;
}) {
  const stepBase: CSSProperties = {
    margin: 0,
    fontSize: "0.875rem",
    fontFamily: "var(--font-body)",
    color: "var(--avcd-text-on-light)",
    lineHeight: 1.55,
  };

  const olStyle: CSSProperties = {
    margin: "0.75rem 0 0",
    paddingLeft: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "1rem 1.05rem",
        borderRadius: "10px",
        background: "var(--avcd-surface-muted)",
        border: "1px solid var(--avcd-border-light)",
      }}
      aria-labelledby="claude-steps-heading"
    >
      <h2
        id="claude-steps-heading"
        style={{
          margin: 0,
          fontSize: "1.05rem",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--avcd-text-on-light)",
          letterSpacing: "-0.02em",
        }}
      >
        Connect to Claude
      </h2>
      <p style={{ ...stepBase, marginTop: "0.5rem", color: "var(--avcd-text-muted)" }}>
        Your MCP server is at{" "}
        <code
          style={{
            fontSize: "0.82em",
            wordBreak: "break-all",
            fontFamily: "ui-monospace, monospace",
            color: "var(--avcd-text-on-light)",
          }}
        >
          {mcpServerUrl}
        </code>
        . Choose the method that matches how your Claude client connects:
      </p>

      {/* Method A: OAuth / Discovery */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.85rem",
          borderRadius: "6px",
          background: "rgba(139, 195, 171, 0.08)",
          border: "1px solid rgba(139, 195, 171, 0.2)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--avcd-text-on-light)",
          }}
        >
          Method A: OAuth / Discovery (Recommended)
        </h3>
        <p style={{ ...stepBase, marginTop: "0.5rem", color: "var(--avcd-text-muted)" }}>
          If Claude (or your MCP client) supports <strong>OAuth-based authentication</strong>, it will:
        </p>
        <ol style={{ ...olStyle, paddingLeft: "1.5rem" }}>
          <li style={stepBase}>
            Fetch resource metadata from{" "}
            <code style={{ fontSize: "0.82em", fontFamily: "ui-monospace, monospace" }}>
              {resourceMetadataUrl}
            </code>
          </li>
          <li style={stepBase}>
            Discover the authorization server at{" "}
            <code style={{ fontSize: "0.82em", fontFamily: "ui-monospace, monospace" }}>
              {authIssuerUrl}
            </code>
          </li>
          <li style={stepBase}>
            Open your browser to complete sign-in with Google (via the authorization server)
          </li>
          <li style={stepBase}>
            Obtain an access token automatically — <strong>no manual copy from this page</strong>
          </li>
        </ol>
        <p style={{ ...stepBase, marginTop: "0.65rem", fontSize: "0.8125rem", color: "var(--avcd-text-muted)" }}>
          <strong>How to tell:</strong> If the client never asks you to paste a token, you&apos;re using OAuth discovery. UI
          labels vary by product version.
        </p>
      </div>

      {/* Method B: Manual Bearer JWT */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.85rem",
          borderRadius: "6px",
          background: "rgba(232, 226, 214, 0.08)",
          border: "1px solid rgba(232, 226, 214, 0.2)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--avcd-text-on-light)",
          }}
        >
          Method B: Manual Bearer JWT
        </h3>
        <p style={{ ...stepBase, marginTop: "0.5rem", color: "var(--avcd-text-muted)" }}>
          If your client asks for a <strong>server URL + bearer token / API key</strong>, or for{" "}
          <strong>Claude Desktop bundle / stdio</strong> configuration:
        </p>
        <ol style={{ ...olStyle, paddingLeft: "1.5rem" }}>
          <li style={stepBase}>
            <strong>Copy the MCP URL.</strong> In <strong>MCP Server Configuration</strong> below, press{" "}
            <strong>Copy URL</strong> (or select and copy manually).
          </li>
          <li style={stepBase}>
            <strong>Copy your access token.</strong> In <strong>Access token</strong> below, press{" "}
            <strong>Copy</strong>. This JWT is short-lived (1 hour) — if tools fail with 401, use{" "}
            <strong>Refresh token</strong> or sign out and sign in with Google again.
          </li>
          <li style={stepBase}>
            <strong>Paste into your client:</strong>
            <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.25rem" }}>
              <li style={{ ...stepBase, marginTop: "0.25rem" }}>
                <strong>Claude Web:</strong> Settings → Connectors / Integrations → Add custom MCP → paste URL +
                Bearer token
              </li>
              <li style={{ ...stepBase, marginTop: "0.25rem" }}>
                <strong>Claude Desktop:</strong> Settings → Developer → edit MCP config, or install the bundle above
              </li>
            </ul>
          </li>
        </ol>
      </div>

      {/* Shared Verify */}
      <div style={{ marginTop: "0.85rem" }}>
        <p style={{ ...stepBase, fontWeight: 600, color: "var(--avcd-text-on-light)" }}>
          Verify your connection:
        </p>
        <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.25rem" }}>
          <li style={{ ...stepBase, marginTop: "0.25rem" }}>
            Start a <strong>new chat</strong> and ask something that uses your AVCD tools (e.g. &quot;What&apos;s the current
            time on my server?&quot;).
          </li>
          <li style={{ ...stepBase, marginTop: "0.25rem" }}>
            If the connector doesn&apos;t appear, reload the page or check Settings for typos in the MCP URL.
          </li>
          <li style={{ ...stepBase, marginTop: "0.25rem" }}>
            If tools fail with <strong>401 Unauthorized</strong>, use <strong>Refresh token</strong> below or sign
            out and sign in with Google again to get a fresh JWT.
          </li>
        </ul>
      </div>
    </section>
  );
}
