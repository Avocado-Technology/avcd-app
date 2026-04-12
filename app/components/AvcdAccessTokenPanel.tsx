"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { getAvcdAccessTokenAction } from "@/app/actions/avcd-access-token";

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

export type AvcdAccessTokenPanelProps = {
  /** Resolved on the server from PUBLIC_HOST / AVCD_MCP_URL so deploys show the right URL without a rebuild. */
  mcpServerUrl: string;
};

export function AvcdAccessTokenPanel({ mcpServerUrl }: AvcdAccessTokenPanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [mcpUrlCopyHint, setMcpUrlCopyHint] = useState<string | null>(null);
  
  // Determine environment based on URL
  const environment = mcpServerUrl.includes('localhost') 
    ? 'Local Development' 
    : mcpServerUrl.includes('dev.avcd.ai')
    ? 'Development'
    : 'Production';

  const loadToken = useCallback(async () => {
    setError(null);
    try {
      const r = await getAvcdAccessTokenAction();
      if (!r.ok) {
        setError(r.error);
        setToken(null);
        return false;
      }
      setToken(r.token);
      return true;
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Something went wrong while loading the token.";
      setError(msg);
      setToken(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await loadToken();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadToken]);

  async function handleRefresh() {
    setBusy(true);
    setError(null);
    setCopyHint(null);
    try {
      await loadToken();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong while refreshing.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copySecret(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard.");
      setTimeout(() => setCopyHint(null), 2500);
    } catch {
      setCopyHint("Could not copy — select and copy manually.");
      setTimeout(() => setCopyHint(null), 3500);
    }
  }
  
  async function copyMcpUrl() {
    try {
      await navigator.clipboard.writeText(mcpServerUrl);
      setMcpUrlCopyHint("MCP URL copied to clipboard.");
      setTimeout(() => setMcpUrlCopyHint(null), 2500);
    } catch {
      setMcpUrlCopyHint("Could not copy — select and copy manually.");
      setTimeout(() => setMcpUrlCopyHint(null), 3500);
    }
  }

  return (
    <section
      style={{
        width: "100%",
        marginTop: 0,
        textAlign: "left",
      }}
    >
      <h2
        style={{
          margin: "0 0 0.35rem",
          fontSize: "1.1rem",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--avcd-text-on-light)",
          letterSpacing: "-0.02em",
        }}
      >
        Access token
      </h2>
      <p
        style={{
          margin: "0 0 1rem",
          fontSize: "0.875rem",
          fontFamily: "var(--font-body)",
          color: "var(--avcd-text-muted)",
          lineHeight: 1.5,
        }}
      >
        This is your AVCD <strong>Bearer access token</strong> (JWT). If you&apos;re using OAuth (recommended, see above),{" "}
        you don&apos;t need this token — Claude obtains it automatically. This token is for:{" "}
        <strong>(1)</strong> Manual Bearer configuration if OAuth doesn&apos;t work,{" "}
        <strong>(2)</strong> Direct API calls from your code,{" "}
        <strong>(3)</strong> Claude Desktop bundle/stdio (<code style={{ fontSize: "0.88em" }}>AVCD_API_BEARER_TOKEN</code> env var).{" "}
        Tokens expire after 1 hour. Use <strong>Refresh token</strong> or sign out and sign in again if expired.
      </p>

      {/* MCP Server Configuration Section */}
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          borderRadius: "6px",
          background: "var(--avcd-surface-muted)",
          border: "1px solid var(--avcd-border-light)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "var(--avcd-text-on-light)",
            }}
          >
            MCP Server Configuration
          </h3>
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
            margin: "0 0 0.5rem",
            fontSize: "0.8125rem",
            fontFamily: "var(--font-body)",
            color: "var(--avcd-text-muted)",
            lineHeight: 1.5,
          }}
        >
          This token is valid for the MCP server at:
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <code
            style={{
              flex: 1,
              padding: "0.4rem 0.6rem",
              borderRadius: "4px",
              background: "var(--avcd-bg-deep)",
              color: "var(--avcd-text-on-dark)",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            {mcpServerUrl}
          </code>
          <button
            type="button"
            style={{
              ...btnSecondary,
              padding: "0.35rem 0.7rem",
              fontSize: "0.8125rem",
            }}
            onClick={copyMcpUrl}
          >
            Copy URL
          </button>
        </div>
        {mcpUrlCopyHint ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              fontFamily: "var(--font-body)",
              color: "var(--avcd-accent-sage)",
            }}
          >
            {mcpUrlCopyHint}
          </p>
        ) : null}
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.75rem",
            fontFamily: "var(--font-body)",
            color: "var(--avcd-text-muted)",
            lineHeight: 1.4,
          }}
        >
          <strong>Usage:</strong> Copy the token below and paste it into Claude Desktop
          bundle configuration or Claude Web MCP server settings.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          style={{
            margin: "0 0 1rem",
            padding: "0.55rem 0.75rem",
            borderRadius: "6px",
            background: "rgba(107, 45, 45, 0.08)",
            border: "1px solid rgba(107, 45, 45, 0.2)",
            color: "#4a2525",
            fontSize: "0.875rem",
            fontFamily: "var(--font-body)",
            lineHeight: 1.5,
          }}
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-body)",
            color: "var(--avcd-text-muted)",
            fontSize: "0.875rem",
          }}
        >
          Loading token…
        </p>
      ) : error && !token ? (
        <button
          type="button"
          style={btnSecondary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setLoading(true);
            try {
              await loadToken();
            } finally {
              setLoading(false);
              setBusy(false);
            }
          }}
        >
          Try again
        </button>
      ) : token ? (
        <div
          style={{
            borderRadius: "8px",
            border: "1px solid var(--avcd-border-light)",
            background: "var(--avcd-surface-muted)",
            padding: "0.85rem",
          }}
        >
          <div
            style={{
              padding: "0.6rem 0.7rem",
              borderRadius: "6px",
              background: "var(--avcd-bg-deep)",
              color: "var(--avcd-text-on-dark)",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
              lineHeight: 1.45,
              marginBottom: "0.75rem",
            }}
          >
            {token}
          </div>
          {copyHint ? (
            <p
              style={{
                margin: "0 0 0.55rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-body)",
                color: "var(--avcd-accent-sage)",
              }}
            >
              {copyHint}
            </p>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            <button
              type="button"
              style={btnPrimary}
              disabled={busy}
              onClick={() => copySecret(token)}
            >
              Copy
            </button>
            <button
              type="button"
              style={btnSecondary}
              disabled={busy}
              onClick={() => handleRefresh()}
            >
              {busy ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
