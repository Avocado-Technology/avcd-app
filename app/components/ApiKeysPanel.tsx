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
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "var(--avcd-bg-elevated)",
  color: "var(--avcd-text-on-dark)",
  boxShadow: "0 1px 2px rgba(15, 24, 18, 0.15)",
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
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const ok = await mint();
      if (!cancelled) setLoading(false);
      if (!ok && !cancelled) {
        /* error state already set */
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
    if (keyId) {
      await revokeApiKeyAction(keyId);
    }
    await mint();
    setBusy(false);
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
        maxWidth: "42rem",
        marginTop: "2rem",
        textAlign: "left",
      }}
    >
      <h2
        style={{
          margin: "0 0 0.35rem",
          fontSize: "1.35rem",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          color: "var(--avcd-text-on-light)",
          letterSpacing: "-0.02em",
        }}
      >
        API key
      </h2>
      <p
        style={{
          margin: "0 0 1.25rem",
          fontSize: "0.95rem",
          fontFamily: "var(--font-body)",
          color: "var(--avcd-text-muted)",
          lineHeight: 1.55,
        }}
      >
        A key is created when you open this page. Use <strong>Refresh key</strong> to
        revoke it and mint a new one (update any clients using the old secret).         Use this
        secret as <strong>Bearer</strong> authentication for API clients, scripts, or
        automation—send{" "}
        <code style={{ fontSize: "0.88em" }}>
          {`Authorization: Bearer <key>`}
        </code>{" "}
        or set{" "}
        <code style={{ fontSize: "0.88em" }}>AVCD_API_BEARER_TOKEN</code> in your host
        environment.
      </p>

      {error ? (
        <p
          role="alert"
          style={{
            margin: "0 0 1rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
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
            fontSize: "0.9rem",
          }}
        >
          Generating your API key…
        </p>
      ) : error && !apiKey ? (
        <button
          type="button"
          style={btnSecondary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setLoading(true);
            await mint();
            setLoading(false);
            setBusy(false);
          }}
        >
          Try again
        </button>
      ) : apiKey ? (
        <div
          style={{
            borderRadius: "10px",
            border: "1px solid var(--avcd-border-light)",
            background: "var(--avcd-surface-muted)",
            padding: "1rem 1.1rem",
          }}
        >
          <div
            style={{
              padding: "0.75rem 0.85rem",
              borderRadius: "8px",
              background: "var(--avcd-bg-deep)",
              color: "var(--avcd-text-on-dark)",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.78rem",
              wordBreak: "break-all",
              lineHeight: 1.45,
              marginBottom: "0.85rem",
            }}
          >
            {apiKey}
          </div>
          {copyHint ? (
            <p
              style={{
                margin: "0 0 0.65rem",
                fontSize: "0.8rem",
                fontFamily: "var(--font-body)",
                color: "var(--avcd-accent-sage)",
              }}
            >
              {copyHint}
            </p>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              style={btnPrimary}
              disabled={busy}
              onClick={() => copySecret(apiKey)}
            >
              Copy key
            </button>
            <button
              type="button"
              style={btnSecondary}
              disabled={busy}
              onClick={() => handleRefresh()}
            >
              {busy ? "Refreshing…" : "Refresh key"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
