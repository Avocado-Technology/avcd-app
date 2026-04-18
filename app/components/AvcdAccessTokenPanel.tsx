"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { getAvcdAccessTokenAction } from "@/app/actions/avcd-access-token";

const btnPrimary: CSSProperties = {
  fontFamily: "var(--sans)",
  fontSize: "0.75rem",
  fontWeight: 500,
  padding: "var(--sp-2) var(--sp-4)",
  borderRadius: "var(--r-md)",
  border: "none",
  cursor: "pointer",
  background: "var(--g900)",
  color: "var(--bg)",
  transition: "background 0.15s",
};

const btnSecondary: CSSProperties = {
  ...btnPrimary,
  background: "var(--bg)",
  color: "var(--g700)",
  border: "1px solid var(--g300)",
};

export type AvcdAccessTokenPanelProps = {
  mcpServerUrl: string;
};

export function AvcdAccessTokenPanel({ mcpServerUrl }: AvcdAccessTokenPanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [mcpUrlCopyHint, setMcpUrlCopyHint] = useState<string | null>(null);
  
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
      <div
        style={{
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
            Access Token
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
            fontSize: "0.875rem",
            fontFamily: "var(--sans)",
            color: "var(--g500)",
            lineHeight: 1.6,
          }}
      >
        This is your AVCD <strong>Bearer access token</strong> (JWT). If you&apos;re using OAuth (recommended, see above),{" "}
        you don&apos;t need this token — Claude obtains it automatically. This token is for:{" "}
          <strong>(1)</strong> Manual Bearer configuration if OAuth doesn&apos;t work,{" "}
          <strong>(2)</strong> Direct API calls from your code,{" "}
          <strong>(3)</strong> Claude Desktop bundle/stdio (<code style={{ fontSize: "0.875rem", fontFamily: "var(--mono)" }}>AVCD_API_BEARER_TOKEN</code> env var).{" "}
          Tokens expire after 1 hour. Use <strong>Refresh token</strong> or sign out and sign in again if expired.
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
          <h3
            style={{
              margin: "0 0 var(--sp-2)",
              fontSize: "0.75rem",
              fontFamily: "var(--mono)",
              fontWeight: 500,
              color: "var(--g500)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            MCP Server Configuration
          </h3>
          <p
            style={{
              margin: "0 0 var(--sp-3)",
              fontSize: "0.875rem",
              fontFamily: "var(--sans)",
              color: "var(--g500)",
              lineHeight: 1.5,
            }}
          >
            This token is valid for the MCP server at:
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--sp-2)",
              marginBottom: "var(--sp-3)",
            }}
          >
            <code
              style={{
                flex: 1,
                padding: "var(--sp-2) var(--sp-3)",
                borderRadius: "var(--r-sm)",
                background: "var(--g100)",
                color: "var(--g900)",
                fontFamily: "var(--mono)",
                fontSize: "0.75rem",
                wordBreak: "break-all",
                lineHeight: 1.5,
              }}
            >
              {mcpServerUrl}
            </code>
            <button
              type="button"
              style={{
                ...btnSecondary,
                flexShrink: 0,
              }}
              onClick={copyMcpUrl}
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
            >
              Copy URL
            </button>
          </div>
          {mcpUrlCopyHint ? (
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                fontFamily: "var(--sans)",
                color: "var(--green)",
              }}
            >
              {mcpUrlCopyHint}
            </p>
          ) : null}
          <p
            style={{
              margin: "var(--sp-3) 0 0",
              fontSize: "0.75rem",
              fontFamily: "var(--sans)",
              color: "var(--g500)",
              lineHeight: 1.5,
            }}
          >
            <strong>Usage:</strong> Copy the token below and paste it into Claude Desktop
            bundle configuration or Claude Web MCP server settings.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            style={{
              margin: "0 0 var(--sp-4)",
              padding: "var(--sp-3)",
              borderRadius: "var(--r-md)",
              background: "var(--red-lt)",
              border: "1px solid var(--red-bd)",
              color: "var(--red)",
              fontSize: "0.875rem",
              fontFamily: "var(--sans)",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--sans)",
              color: "var(--g500)",
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
            onMouseDown={(e) => !busy && (e.currentTarget.style.transform = "translateY(1px)")}
            onMouseUp={(e) => !busy && (e.currentTarget.style.transform = "translateY(0)")}
            onMouseEnter={(e) => {
              if (busy) return;
              e.currentTarget.style.borderColor = "var(--g400)";
              e.currentTarget.style.color = "var(--g900)";
              e.currentTarget.style.background = "var(--g100)";
            }}
            onMouseLeave={(e) => {
              if (busy) return;
              e.currentTarget.style.borderColor = "var(--g300)";
              e.currentTarget.style.color = "var(--g700)";
              e.currentTarget.style.background = "var(--bg)";
            }}
          >
            Try again
          </button>
        ) : token ? (
          <div
            style={{
              borderRadius: "var(--r-md)",
              border: "1px solid var(--g200)",
              background: "var(--g50)",
              padding: "var(--sp-4)",
            }}
          >
            <div
              style={{
                padding: "var(--sp-3)",
                borderRadius: "var(--r-sm)",
                background: "var(--g100)",
                color: "var(--g900)",
                fontFamily: "var(--mono)",
                fontSize: "0.75rem",
                wordBreak: "break-all",
                lineHeight: 1.5,
                marginBottom: "var(--sp-4)",
              }}
            >
              {token}
            </div>
            {copyHint ? (
              <p
                style={{
                  margin: "0 0 var(--sp-3)",
                  fontSize: "0.75rem",
                  fontFamily: "var(--sans)",
                  color: "var(--green)",
                }}
              >
                {copyHint}
              </p>
            ) : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-2)" }}>
              <button
                type="button"
                style={btnPrimary}
                disabled={busy}
                onClick={() => copySecret(token)}
                onMouseDown={(e) => !busy && (e.currentTarget.style.transform = "translateY(1px)")}
                onMouseUp={(e) => !busy && (e.currentTarget.style.transform = "translateY(0)")}
                onMouseEnter={(e) => !busy && (e.currentTarget.style.background = "var(--g700)")}
                onMouseLeave={(e) => !busy && (e.currentTarget.style.background = "var(--g900)")}
              >
                Copy
              </button>
              <button
                type="button"
                style={btnSecondary}
                disabled={busy}
                onClick={() => handleRefresh()}
                onMouseDown={(e) => !busy && (e.currentTarget.style.transform = "translateY(1px)")}
                onMouseUp={(e) => !busy && (e.currentTarget.style.transform = "translateY(0)")}
                onMouseEnter={(e) => {
                  if (busy) return;
                  e.currentTarget.style.borderColor = "var(--g400)";
                  e.currentTarget.style.color = "var(--g900)";
                  e.currentTarget.style.background = "var(--g100)";
                }}
                onMouseLeave={(e) => {
                  if (busy) return;
                  e.currentTarget.style.borderColor = "var(--g300)";
                  e.currentTarget.style.color = "var(--g700)";
                  e.currentTarget.style.background = "var(--bg)";
                }}
              >
                {busy ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
