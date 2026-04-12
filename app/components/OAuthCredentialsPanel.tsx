"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { generateOAuthClientAction, getOAuthClientAction, revokeOAuthClientAction } from "@/lib/server/oauth-client-actions";

export type OAuthCredentialsPanelProps = {
  mcpServerUrl: string;
};

type OAuthClient = {
  client_id: string;
  redirect_uris: string[];
  created_at: string;
  last_used_at?: string;
};

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
  const [client, setClient] = useState<OAuthClient | null>(null);
  const [newCredentials, setNewCredentials] = useState<OAuthClient | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientIdCopyHint, setClientIdCopyHint] = useState<string | null>(null);
  const [mcpUrlCopyHint, setMcpUrlCopyHint] = useState<string | null>(null);
  
  // Determine environment from mcpServerUrl
  const environment = mcpServerUrl.includes('localhost') 
    ? 'Local Development' 
    : mcpServerUrl.includes('dev.avcd.ai')
    ? 'Development'
    : 'Production';

  // Load existing client on mount
  useEffect(() => {
    let cancelled = false;
    
    async function loadExisting() {
      setLoadingExisting(true);
      setError(null);
      try {
        const result = await getOAuthClientAction();
        if (!cancelled) {
          if (result.ok && result.client) {
            setClient(result.client);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load OAuth client");
        }
      } finally {
        if (!cancelled) {
          setLoadingExisting(false);
        }
      }
    }
    
    loadExisting();
    
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    
    try {
      const result = await generateOAuthClientAction("Claude Web MCP Client");
      
      if (result.ok) {
        setNewCredentials(result.client);
        setClient(result.client);
      } else {
        // If error is "already has client", try to load it
        if (result.error.includes("already has")) {
          const loadResult = await getOAuthClientAction();
          if (loadResult.ok && loadResult.client) {
            setClient(loadResult.client);
            setError("You already have an OAuth client. Using existing client.");
          } else {
            setError(result.error);
          }
        } else {
          setError(result.error);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate client");
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke() {
    if (!confirm("Are you sure you want to revoke this OAuth client? You'll need to generate a new one to reconnect Claude Web.")) {
      return;
    }
    
    setRevoking(true);
    setError(null);
    
    try {
      const result = await revokeOAuthClientAction();
      
      if (result.ok) {
        setClient(null);
        setNewCredentials(null);
        setClientIdCopyHint("Client revoked successfully");
        setTimeout(() => setClientIdCopyHint(null), 2000);
      } else {
        setError(result.error || "Failed to revoke client");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to revoke client");
    } finally {
      setRevoking(false);
    }
  }

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
        Generate an OAuth client to connect Claude Web with automated authentication (recommended).
        Claude will handle token refresh automatically.
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

      {loadingExisting && (
        <div style={{ padding: "1rem", textAlign: "center", color: "var(--avcd-text-muted)", fontSize: "0.875rem" }}>
          Loading existing client...
        </div>
      )}

      {!loadingExisting && !client && !newCredentials && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{ ...btnPrimary, opacity: generating ? 0.6 : 1, cursor: generating ? "wait" : "pointer" }}
        >
          {generating ? "Generating..." : "Generate OAuth Client"}
        </button>
      )}

      {!loadingExisting && (client || newCredentials) && (
        <div
          style={{
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
              Client ID
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
            {(client || newCredentials)?.client_id}
          </code>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <button
              onClick={() => copyToClipboard((client || newCredentials)!.client_id, setClientIdCopyHint)}
              style={btnSecondary}
            >
              Copy Client ID
            </button>
            <button
              onClick={handleRevoke}
              disabled={revoking}
              style={{
                ...btnSecondary,
                opacity: revoking ? 0.6 : 1,
                cursor: revoking ? "wait" : "pointer",
                color: "#9b4444",
              }}
            >
              {revoking ? "Revoking..." : "Revoke Client"}
            </button>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--avcd-text-muted)", marginBottom: "0.5rem" }}>
            <strong>Redirect URIs:</strong>
          </div>
          <ul style={{ margin: "0 0 0.75rem", paddingLeft: "1.25rem", fontSize: "0.75rem", color: "var(--avcd-text-muted)" }}>
            {(client || newCredentials)?.redirect_uris.map((uri: string) => (
              <li key={uri}>
                <code style={{ fontSize: "0.7em", fontFamily: "ui-monospace, monospace" }}>{uri}</code>
              </li>
            ))}
          </ul>

          <div style={{ fontSize: "0.75rem", color: "var(--avcd-text-muted)" }}>
            <div>
              <strong>Created:</strong> {new Date((client || newCredentials)!.created_at).toLocaleString()}
            </div>
            {((client || newCredentials)?.last_used_at) && (
              <div>
                <strong>Last used:</strong> {new Date((client || newCredentials)!.last_used_at!).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "6px",
            background: "rgba(155, 68, 68, 0.1)",
            border: "1px solid rgba(155, 68, 68, 0.3)",
            color: "#9b4444",
            fontSize: "0.875rem",
            fontFamily: "var(--font-body)",
          }}
        >
          {error}
        </div>
      )}
    </section>
  );
}
