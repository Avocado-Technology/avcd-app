"use client";

import { useCallback, useState, type CSSProperties } from "react";

export type OAuthCredentialsPanelProps = {
  mcpServerUrl: string;
};

const MCP_CLIENT_ID =
  process.env.NEXT_PUBLIC_MCP_CLIENT_ID ||
  process.env.NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID ||
  "cc5qINMngWbIsn02ZRC7zPMEpFkqe58y";
const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL?.replace('https://', '') || "avcdtech.us.auth0.com";

const btnSecondary: CSSProperties = {
  fontFamily: "var(--sans)",
  fontSize: "0.75rem",
  fontWeight: 500,
  padding: "var(--sp-2) var(--sp-4)",
  borderRadius: "var(--r-md)",
  border: "1px solid var(--g300)",
  background: "var(--bg)",
  color: "var(--g700)",
  cursor: "pointer",
  transition: "border-color 0.15s, color 0.15s, background 0.15s",
};

export function OAuthCredentialsPanel({ mcpServerUrl }: OAuthCredentialsPanelProps) {
  const [clientIdCopyHint, setClientIdCopyHint] = useState<string | null>(null);
  const [mcpUrlCopyHint, setMcpUrlCopyHint] = useState<string | null>(null);
  const [authUrlCopyHint, setAuthUrlCopyHint] = useState<string | null>(null);
  
  const environment = mcpServerUrl.includes('localhost') 
    ? 'Local Development' 
    : mcpServerUrl.includes('dev.avcd.ai')
    ? 'Development'
    : 'Production';

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
        padding: "var(--sp-6)",
        borderRadius: "var(--r-xl)",
        background: "var(--bg)",
        border: "1px solid var(--g200)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-4)" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.125rem",
            fontFamily: "var(--sans)",
            fontWeight: 500,
            color: "var(--g900)",
            letterSpacing: "-0.02em",
          }}
        >
          OAuth Client Credentials
        </h2>
        <span
          style={{
            fontSize: "0.6875rem",
            fontFamily: "var(--mono)",
            fontWeight: 400,
            color: "var(--g500)",
            background: "var(--g100)",
            padding: "var(--sp-1) var(--sp-3)",
            borderRadius: "var(--r-sm)",
            letterSpacing: "0.02em",
          }}
        >
          {environment}
        </span>
      </div>

      <p
        style={{
          margin: "0 0 var(--sp-6)",
          fontSize: "1rem",
          fontFamily: "var(--sans)",
          color: "var(--g500)",
          lineHeight: 1.6,
        }}
      >
        Use this OAuth client ID to connect Claude with automated authentication via Auth0 (recommended).
        All users share the same client ID. Claude will handle token refresh automatically using PKCE.
      </p>

      <div
        style={{
          marginBottom: "var(--sp-4)",
          padding: "var(--sp-4)",
          borderRadius: "var(--r-md)",
          background: "var(--g50)",
          border: "1px solid var(--g200)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "0.75rem",
              fontFamily: "var(--mono)",
              fontWeight: 500,
              color: "var(--g500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            MCP Server URL
          </h3>
          {mcpUrlCopyHint && (
            <span style={{ fontSize: "0.75rem", color: "var(--green)", fontFamily: "var(--sans)" }}>
              {mcpUrlCopyHint}
            </span>
          )}
        </div>
        <code
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontFamily: "var(--mono)",
            color: "var(--g900)",
            wordBreak: "break-all",
            marginBottom: "var(--sp-3)",
            lineHeight: 1.5,
          }}
        >
          {mcpServerUrl}
        </code>
        <button
          onClick={() => copyToClipboard(mcpServerUrl, setMcpUrlCopyHint)}
          onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--g400)";
            e.currentTarget.style.color = "var(--g900)";
            e.currentTarget.style.background = "var(--g100)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--g300)";
            e.currentTarget.style.color = "var(--g700)";
            e.currentTarget.style.background = "var(--bg)";
          }}
          style={btnSecondary}
        >
          Copy URL
        </button>
      </div>

      <div
        style={{
          padding: "var(--sp-4)",
          borderRadius: "var(--r-md)",
          background: "var(--g50)",
          border: "1px solid var(--g200)",
          marginBottom: "var(--sp-4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--sp-3)" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "0.75rem",
              fontFamily: "var(--mono)",
              fontWeight: 500,
              color: "var(--g500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            OAuth Client ID
          </h3>
          {clientIdCopyHint && (
            <span style={{ fontSize: "0.75rem", color: "var(--green)", fontFamily: "var(--sans)" }}>
              {clientIdCopyHint}
            </span>
          )}
        </div>
        <code
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontFamily: "var(--mono)",
            color: "var(--g900)",
            wordBreak: "break-all",
            marginBottom: "var(--sp-3)",
            lineHeight: 1.5,
          }}
        >
          {MCP_CLIENT_ID}
        </code>

        <button
          onClick={() => copyToClipboard(MCP_CLIENT_ID, setClientIdCopyHint)}
          onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--g400)";
            e.currentTarget.style.color = "var(--g900)";
            e.currentTarget.style.background = "var(--g100)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--g300)";
            e.currentTarget.style.color = "var(--g700)";
            e.currentTarget.style.background = "var(--bg)";
          }}
          style={btnSecondary}
        >
          Copy Client ID
        </button>
      </div>

      <div
        style={{
          padding: "var(--sp-4)",
          borderRadius: "var(--r-md)",
          background: "var(--g50)",
          border: "1px solid var(--g200)",
        }}
      >
        <h3
          style={{
            margin: "0 0 var(--sp-4)",
            fontSize: "0.75rem",
            fontFamily: "var(--mono)",
            fontWeight: 500,
            color: "var(--g500)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          OAuth Configuration
        </h3>
        
        <div style={{ marginBottom: "var(--sp-4)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--g500)", marginBottom: "var(--sp-2)", fontFamily: "var(--sans)" }}>
            <strong>Authorization URL:</strong>
          </div>
          <code
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontFamily: "var(--mono)",
              color: "var(--g900)",
              wordBreak: "break-all",
              marginBottom: "var(--sp-3)",
              lineHeight: 1.5,
            }}
          >
            {authorizationUrl}
          </code>
          <button
            onClick={() => copyToClipboard(authorizationUrl, setAuthUrlCopyHint)}
            onMouseDown={(e) => e.currentTarget.style.transform = "translateY(1px)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--g400)";
              e.currentTarget.style.color = "var(--g900)";
              e.currentTarget.style.background = "var(--g100)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--g300)";
              e.currentTarget.style.color = "var(--g700)";
              e.currentTarget.style.background = "var(--bg)";
            }}
            style={btnSecondary}
          >
            Copy Auth URL
          </button>
          {authUrlCopyHint && (
            <span style={{ marginLeft: "var(--sp-2)", fontSize: "0.75rem", color: "var(--green)", fontFamily: "var(--sans)" }}>
              {authUrlCopyHint}
            </span>
          )}
        </div>

        <div style={{ fontSize: "0.75rem", color: "var(--g500)", fontFamily: "var(--sans)", lineHeight: 1.6 }}>
          <div style={{ marginBottom: "var(--sp-2)" }}>
            <strong>Token URL:</strong>{" "}
            <code style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--g700)" }}>
              {tokenUrl}
            </code>
          </div>
          <div style={{ marginBottom: "var(--sp-2)" }}>
            <strong>Method:</strong> PKCE (no client secret required)
          </div>
          <div>
            <strong>Scopes:</strong>{" "}
            <code style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--g700)" }}>
              openid profile email offline_access
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
