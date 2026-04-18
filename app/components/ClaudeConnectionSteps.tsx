import type { CSSProperties } from "react";

export function ClaudeConnectionSteps({
  mcpServerUrl,
}: {
  mcpServerUrl: string;
}) {
  const stepBase: CSSProperties = {
    margin: 0,
    fontSize: "1rem",
    fontFamily: "var(--sans)",
    color: "var(--g900)",
    lineHeight: 1.6,
  };

  const olStyle: CSSProperties = {
    margin: "var(--sp-4) 0 0",
    paddingLeft: "var(--sp-6)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--sp-3)",
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "var(--sp-6)",
        borderRadius: "var(--r-xl)",
        background: "var(--bg)",
        border: "1px solid var(--g200)",
      }}
      aria-labelledby="claude-steps-heading"
    >
      <h2
        id="claude-steps-heading"
        style={{
          margin: 0,
          fontSize: "1.125rem",
          fontFamily: "var(--sans)",
          fontWeight: 500,
          color: "var(--g900)",
          letterSpacing: "-0.02em",
        }}
      >
        Connect to Claude
      </h2>

      <div
        style={{
          marginTop: "var(--sp-6)",
          padding: "var(--sp-5)",
          borderRadius: "var(--r-md)",
          background: "var(--green-lt)",
          border: "1px solid var(--green-bd)",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontFamily: "var(--sans)",
            fontWeight: 500,
            color: "var(--g900)",
            marginBottom: "var(--sp-2)",
          }}
        >
          Connect to Claude Web via OAuth (Recommended)
        </h3>
        <p style={{ ...stepBase, color: "var(--g500)", fontSize: "0.875rem" }}>
          Use the OAuth client generated in the panel above for automated authentication.
          Claude will handle token refresh automatically.
        </p>
        <ol style={olStyle}>
          <li style={stepBase}>
            <strong>Copy the OAuth Client ID</strong> from the <strong>OAuth Client Credentials</strong> panel above
          </li>
          <li style={stepBase}>
            In <strong>Claude Web</strong>: Open Settings → Connectors → Add MCP Server
          </li>
          <li style={stepBase}>
            <strong>Enter the MCP URL</strong> shown in the panel above:{" "}
            <code style={{ fontSize: "0.875rem", fontFamily: "var(--mono)", wordBreak: "break-all", color: "var(--g700)" }}>
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

      <details
        style={{
          marginTop: "var(--sp-5)",
          padding: "var(--sp-4)",
          borderRadius: "var(--r-md)",
          background: "var(--g50)",
          border: "1px solid var(--g200)",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.875rem",
            fontFamily: "var(--sans)",
            color: "var(--g900)",
          }}
        >
          Alternative: Manual Bearer Token (for API calls or if OAuth doesn&apos;t work)
        </summary>
        <div style={{ marginTop: "var(--sp-4)" }}>
          <p style={{ ...stepBase, color: "var(--g500)", fontSize: "0.875rem" }}>
            If your client asks for a <strong>server URL + bearer token / API key</strong>, or for{" "}
            <strong>Claude Desktop bundle / stdio</strong> configuration:
          </p>
          <ol style={olStyle}>
            <li style={{...stepBase, fontSize: "0.875rem"}}>
              <strong>Copy the MCP URL</strong> from <strong>MCP Server Configuration</strong> section below
            </li>
            <li style={{...stepBase, fontSize: "0.875rem"}}>
              <strong>Copy your access token</strong> from <strong>Access token</strong> section below.
              This JWT is short-lived (1 hour) — if tools fail with 401, use{" "}
              <strong>Refresh token</strong> or sign out and sign in again.
            </li>
            <li style={{...stepBase, fontSize: "0.875rem"}}>
              <strong>Paste into your client:</strong>
              <ul style={{ margin: "var(--sp-2) 0 0", paddingLeft: "var(--sp-6)" }}>
                <li style={{ ...stepBase, marginTop: "var(--sp-2)", fontSize: "0.875rem" }}>
                  <strong>Claude Web:</strong> Settings → Connectors → Add MCP → paste URL + Bearer token
                </li>
                <li style={{ ...stepBase, marginTop: "var(--sp-2)", fontSize: "0.875rem" }}>
                  <strong>Claude Desktop:</strong> Settings → Developer → edit MCP config, or install the bundle above
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </details>

      <div style={{ marginTop: "var(--sp-5)" }}>
        <p style={{ ...stepBase, fontWeight: 500, marginBottom: "var(--sp-3)" }}>
          Verify your connection:
        </p>
        <ul style={{ margin: 0, paddingLeft: "var(--sp-6)", display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          <li style={{ ...stepBase, fontSize: "0.875rem", color: "var(--g700)" }}>
            Start a <strong>new chat</strong> and ask something that uses your AVCD tools (e.g. &quot;What&apos;s the current
            time on my server?&quot;).
          </li>
          <li style={{ ...stepBase, fontSize: "0.875rem", color: "var(--g700)" }}>
            If the connector doesn&apos;t appear, reload the page or check Settings for typos in the MCP URL.
          </li>
          <li style={{ ...stepBase, fontSize: "0.875rem", color: "var(--g700)" }}>
            If tools fail with <strong>401 Unauthorized</strong>: OAuth users don&apos;t need to worry (Claude handles refresh).
            Manual bearer users should use <strong>Refresh token</strong> below or sign in again.
          </li>
        </ul>
      </div>
    </section>
  );
}
