"use client";

import { useCallback, useState, type CSSProperties } from "react";

export type OAuthCredentialsPanelProps = {
  mcpServerUrl: string;
};

// Auth0 MCP Client - static, shared by all users
const AUTH0_MCP_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID || "cc5qINMngWbIsn02ZRC7zPMEpFkqe58y";
const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '') || "avcdtech.us.auth0.com";

const btnPrimary: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.875rem",
  fontWeight: 600,
  padding: "0.45rem 0.9rem",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "var(--avcd-bg-elevated)",
  color: "var(--avcd-text-on-dark)",
  boxShadow: "0 1px 2px rgba(15, 24, 18, 0.12)",
};

const btnSecondary: CSSProperties = {
  ...btnPrimary,
  background: "var(--avcd-surface-muted)",
  color: "var(--avcd-text-on-light)",
  border: "1px solid var(--avcd-border-light)",
  boxShadow: "none",
};

export function OAuthCredentialsPanel({ mcpServerUrl }: OAuthCredentialsPanelProps) {
  const [clientIdCopyHint, setClientIdCopyHint] = useState<string | null>(null);
  const [mcpUrlCopyHint, setMcpUrlCopyHint] = useState<string | null>(null);
  const [authUrlCopyHint, setAuthUrlCopyHint] = useState<string | null>(null);
  
  // Determine environment from mcpServerUrl
  const environment = mcpServerUrl.includes('localhost') 
    ? 'Local Development' 
    : mcpServerUrl.includes('dev.avcd.ai')
    ? 'Development'
    : 'Production';

  // Auth0 OAuth URLs
  const authorizationUrl = `https://${AUTH0_DOMAIN}/authorize`;
  const tokenUrl = `https://${AUTH0_DOMAIN}/oauth/token`;

  const copyToClipboard = useCallback(async (text: string, setHint: (msg: string | null) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setHint("Copied!");
      setTimeout(() => setHint(null), 2000);
    } catch {
      setHint("Failed to copy");
      setTimeout(() => setHint(null), 2000);
    }
  }, []);

  return (
    <section
      style={{
        width: "100%",
        padding: "1rem 1.05rem",
        borderRadius: "10px",
        background: "var(--avcd-surface-muted)",
        border: "1px solid var(--avcd-border-light)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.1rem",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--avcd-text-on-light)",
            letterSpacing: "-0.02em",
          }}
        >
          OAuth Client Credentials
        </h2>
        <span
          style={{
            fontSize: "0.75rem",
            fontFamily: "var(--font-body)",
            color: "var(--avcd-text-muted)",
            background: "var(--avcd-bg-deep)",
            padding: "0.2rem 0.5rem",
            borderRadius: "4px",
          }}
        >
          {environment}
        </span>
      </div>

      <p
        style={{
          margin: "0 0 1rem",
          fontSize: "0.875rem",
          fontFamily: "var(--font-body)",
          color: "var(--avcd-text-muted)",
          lineHeight: 1.5,
        }}
      >
        Use this OAuth client ID to connect Claude with automated authentication via Auth0 (recommended).
        All users share the same client ID. Claude will handle token refresh automatically using PKCE.
      </p>

      {/* MCP Server URL - always visible */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          borderRadius: "6px",
          background: "var(--avcd-surface-light)",
          border: "1px solid var(--avcd-border-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "var(--avcd-text-on-light)",
            }}
          >
            MCP Server URL
          </h3>
          {mcpUrlCopyHint && (
            <span style={{ fontSize: "0.75rem", color: "var(--avcd-text-muted)", fontStyle: "italic" }}>
              {mcpUrlCopyHint}
            </span>
          )}
        </div>
        <code
          style={{
            display: "block",
            fontSize: "0.8125rem",
            fontFamily: "ui-monospace, monospace",
            color: "var(--avcd-text-on-light)",
            wordBreak: "break-all",
            marginBottom: "0.5rem",
          }}
        >
          {mcpServerUrl}
        </code>
        <button
          onClick={() => copyToClipboard(mcpServerUrl, setMcpUrlCopyHint)}
          style={btnSecondary}
        >
          Copy URL
        </button>
      </div>

      {/* Auth0 MCP Client ID - Static, shared by all users */}
      <div
        style={{
          padding: "0.75rem",
          borderRadius: "6px",
          background: "var(--avcd-surface-light)",
          border: "1px solid var(--avcd-border-light)",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "var(--avcd-text-on-light)",
            }}
          >
            OAuth Client ID
          </h3>
          {clientIdCopyHint && (
            <span style={{ fontSize: "0.75rem", color: "var(--avcd-text-muted)", fontStyle: "italic" }}>
              {clientIdCopyHint}
            </span>
          )}
        </div>
        <code
          style={{
            display: "block",
            fontSize: "0.8125rem",
            fontFamily: "ui-monospace, monospace",
            color: "var(--avcd-text-on-light)",
            wordBreak: "break-all",
            marginBottom: "0.75rem",
          }}
        >
          {AUTH0_MCP_CLIENT_ID}
        </code>

        <button
          onClick={() => copyToClipboard(AUTH0_MCP_CLIENT_ID, setClientIdCopyHint)}
          style={btnSecondary}
        >
          Copy Client ID
        </button>
      </div>

      {/* Auth0 OAuth URLs */}
      <div
        style={{
          padding: "0.75rem",
          borderRadius: "6px",
          background: "var(--avcd-surface-light)",
          border: "1px solid var(--avcd-border-light)",
        }}
      >
        <h3
          style={{
            margin: "0 0 0.75rem",
            fontSize: "0.875rem",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--avcd-text-on-light)",
          }}
        >
          OAuth Configuration
        </h3>
        
        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--avcd-text-muted)", marginBottom: "0.25rem" }}>
            <strong>Authorization URL:</strong>
          </div>
          <code
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontFamily: "ui-monospace, monospace",
              color: "var(--avcd-text-on-light)",
              wordBreak: "break-all",
              marginBottom: "0.5rem",
            }}
          >
            {authorizationUrl}
          </code>
          <button
            onClick={() => copyToClipboard(authorizationUrl, setAuthUrlCopyHint)}
            style={{ ...btnSecondary, fontSize: "0.8125rem", padding: "0.35rem 0.7rem" }}
          >
            Copy Auth URL
          </button>
          {authUrlCopyHint && (
            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--avcd-text-muted)", fontStyle: "italic" }}>
              {authUrlCopyHint}
            </span>
          )}
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--avcd-text-muted)" }}>
          <div><strong>Token URL:</strong> <code style={{ fontSize: "0.7em" }}>{tokenUrl}</code></div>
          <div><strong>Method:</strong> PKCE (no client secret required)</div>
          <div><strong>Scopes:</strong> <code style={{ fontSize: "0.7em" }}>openid profile email offline_access</code></div>
        </div>
      </div>
    </section>
  );
}
