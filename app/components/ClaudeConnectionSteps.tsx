import type { CSSProperties } from "react";

/**
 * Post-login instructions for connecting AVCD MCP to Claude (web or Desktop).
 * Placed above AvcdAccessTokenPanel so steps refer to “sections below”.
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
        Connect to Claude (step by step)
      </h2>
      <p style={{ ...stepBase, marginTop: "0.5rem", color: "var(--avcd-text-muted)" }}>
        Your MCP endpoint is{" "}
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
        . Use the sections <strong>below</strong> to copy the URL and token, then:
      </p>
      <ol style={olStyle}>
        <li style={stepBase}>
          <strong>Copy the MCP URL.</strong> In{" "}
          <strong>MCP Server Configuration</strong> below, press{" "}
          <strong>Copy URL</strong> (or select the URL and copy).
        </li>
        <li style={stepBase}>
          <strong>Copy your access token.</strong> In <strong>Access token</strong> below, press{" "}
          <strong>Copy</strong>. This is a short-lived JWT — if tools fail with 401, use{" "}
          <strong>Refresh token</strong> or sign out and sign in with Google again.
        </li>
        <li style={stepBase}>
          <strong>Claude on the web (claude.ai):</strong> Open your account{" "}
          <strong>Settings</strong>, find <strong>Connectors</strong> / <strong>Integrations</strong> /{" "}
          <strong>Custom MCP</strong> (the name may vary), then <strong>Add</strong> or <strong>Edit</strong> a
          connector. Paste the <strong>remote MCP URL</strong> and set authentication to{" "}
          <strong>Bearer token</strong> (or “API key”) and paste the same JWT.
        </li>
        <li style={stepBase}>
          <strong>Claude Desktop:</strong> Use <strong>Settings → Developer</strong> to edit the MCP config, or
          download <strong>Download MCP bundle</strong> above and install it; when asked for credentials, paste the
          token from below.
        </li>
        <li style={stepBase}>
          <strong>Verify:</strong> Start a <strong>new chat</strong> and ask something that uses your AVCD tools
          (e.g. the current time from the demo MCP). If the connector does not appear, reload the page or re-open
          Settings and confirm the URL has no trailing typo.
        </li>
      </ol>
    </section>
  );
}
