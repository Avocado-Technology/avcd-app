import type { CSSProperties } from "react";

/**
 * Post-login instructions for connecting AVCD MCP to Claude (web or Desktop).
 * Shows OAuth as primary method with manual bearer as collapsible fallback.
 */
export function ClaudeConnectionSteps({
  mcpServerUrl,
}: {
  mcpServerUrl: string;
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

  const detailsStyle: CSSProperties = {
    marginTop: "1rem",
    padding: "0.85rem",
    borderRadius: "6px",
    background: "rgba(232, 226, 214, 0.05)",
    border: "1px solid var(--avcd-border-light)",
  };

  const summaryStyle: CSSProperties = {
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9375rem",
    fontFamily: "var(--font-display)",
    color: "var(--avcd-text-on-light)",
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

      {/* Primary OAuth Section - Always Visible */}
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
          Connect to Claude Web via OAuth (Recommended)
        </h3>
        <p style={{ ...stepBase, marginTop: "0.5rem", color: "var(--avcd-text-muted)" }}>
          Use the OAuth client generated in the panel above for automated authentication.
          Claude will handle token refresh automatically.
        </p>
        <ol style={{ ...olStyle, paddingLeft: "1.5rem" }}>
          <li style={stepBase}>
            <strong>Copy the OAuth Client ID</strong> from the <strong>OAuth Client Credentials</strong> panel above
          </li>
          <li style={stepBase}>
            In <strong>Claude Web</strong>: Open Settings → Connectors → Add MCP Server
          </li>
          <li style={stepBase}>
            <strong>Enter the MCP URL</strong> shown in the panel above:{" "}
            <code style={{ fontSize: "0.82em", fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>
              {mcpServerUrl}
            </code>
          </li>
          <li style={stepBase}>
            Select <strong>OAuth</strong> as the authentication method
          </li>
          <li style={stepBase}>
            <strong>Paste the Client ID</strong> you copied
          </li>
          <li style={stepBase}>
            Click <strong>Connect</strong> — Claude will open your browser for Auth0/Google sign-in
          </li>
          <li style={stepBase}>
            Sign in with your Google account (via Auth0). Claude obtains the access token automatically. <strong>Done!</strong>
          </li>
        </ol>
      </div>

      {/* Manual Bearer Fallback - Collapsed */}
      <details style={detailsStyle}>
        <summary style={summaryStyle}>
          Alternative: Manual Bearer Token (for API calls or if OAuth doesn&apos;t work)
        </summary>
        <div style={{ marginTop: "0.75rem" }}>
          <p style={{ ...stepBase, color: "var(--avcd-text-muted)" }}>
            If your client asks for a <strong>server URL + bearer token / API key</strong>, or for{" "}
            <strong>Claude Desktop bundle / stdio</strong> configuration:
          </p>
          <ol style={{ ...olStyle, paddingLeft: "1.5rem" }}>
            <li style={stepBase}>
              <strong>Copy the MCP URL</strong> from <strong>MCP Server Configuration</strong> section below
            </li>
            <li style={stepBase}>
              <strong>Copy your access token</strong> from <strong>Access token</strong> section below.
              This JWT is short-lived (1 hour) — if tools fail with 401, use{" "}
              <strong>Refresh token</strong> or sign out and sign in again.
            </li>
            <li style={stepBase}>
              <strong>Paste into your client:</strong>
              <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.25rem" }}>
                <li style={{ ...stepBase, marginTop: "0.25rem" }}>
                  <strong>Claude Web:</strong> Settings → Connectors → Add MCP → paste URL + Bearer token
                </li>
                <li style={{ ...stepBase, marginTop: "0.25rem" }}>
                  <strong>Claude Desktop:</strong> Settings → Developer → edit MCP config, or install the bundle above
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </details>

      {/* Shared Verification */}
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
            If tools fail with <strong>401 Unauthorized</strong>: OAuth users don&apos;t need to worry (Claude handles refresh).
            Manual bearer users should use <strong>Refresh token</strong> below or sign in again.
          </li>
        </ul>
      </div>
    </section>
  );
}
