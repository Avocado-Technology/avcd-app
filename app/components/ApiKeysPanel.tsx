"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

import {
  createApiKeyAction,
  revokeApiKeyAction,
} from "@/app/actions/api-keys";

/** Stable label for the browser-minted key (listed in API if you query keys elsewhere). */
const BROWSER_API_KEY_NAME = "Browser";

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

export function ApiKeysPanel() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const mint = useCallback(async () => {
    setError(null);
    try {
      const r = await createApiKeyAction(BROWSER_API_KEY_NAME);
      if (!r.ok) {
        setError(r.error);
        setApiKey(null);
        setKeyId(null);
        return false;
      }
      setApiKey(r.key.apiKey);
      setKeyId(r.key.keyId);
      return true;
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Something went wrong while creating the token.";
      setError(msg);
      setApiKey(null);
      setKeyId(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await mint();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mint]);

  async function handleRefresh() {
    setBusy(true);
    setError(null);
    setCopyHint(null);
    try {
      if (keyId) {
        const rev = await revokeApiKeyAction(keyId);
        if (!rev.ok) {
          setError(rev.error);
          return;
        }
      }
      await mint();
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
        Token
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
        Paste into the MCP installer as the API bearer token (or set{" "}
        <code style={{ fontSize: "0.88em" }}>AVCD_API_BEARER_TOKEN</code>
        for stdio). <strong>Refresh</strong> revokes this secret and creates a new one.
      </p>

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
          Generating token…
        </p>
      ) : error && !apiKey ? (
        <button
          type="button"
          style={btnSecondary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setLoading(true);
            try {
              await mint();
            } finally {
              setLoading(false);
              setBusy(false);
            }
          }}
        >
          Try again
        </button>
      ) : apiKey ? (
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
            {apiKey}
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
              onClick={() => copySecret(apiKey)}
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
