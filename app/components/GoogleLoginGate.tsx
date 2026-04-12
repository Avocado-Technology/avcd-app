"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

function messageForAuthError(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case "Configuration":
      return "Sign-in is misconfigured on the server (check AUTH_SECRET and OAuth settings).";
    case "AccessDenied":
      return "Access was denied. You may not be allowed to sign in.";
    case "Verification":
      return "The sign-in link expired or was already used. Try again.";
    default:
      return "Sign-in failed. Try again or contact support.";
  }
}

function GoogleMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export type GoogleLoginGateProps = {
  /** Shown so users know which MCP URL to use in Claude (full token appears after sign-in). */
  mcpServerUrl: string;
};

export function GoogleLoginGate({ mcpServerUrl }: GoogleLoginGateProps) {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = messageForAuthError(params.get("error"));
    if (msg) setError(msg);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1.25rem, 4vw, 2.5rem)",
        background: `
          linear-gradient(165deg, var(--avcd-bg-deep) 0%, #0a1210 42%, transparent 42%),
          radial-gradient(ellipse 120% 80% at 50% 100%, #e8e2d6 0%, var(--avcd-surface-light) 45%)
        `,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
        aria-hidden
      />
      <div
        style={{
          width: "100%",
          maxWidth: "26rem",
          borderRadius: "16px",
          background: "var(--avcd-surface-light)",
          border: "1px solid var(--avcd-border-light)",
          boxShadow:
            "0 28px 56px rgba(13, 24, 18, 0.14), 0 0 0 1px rgba(15, 26, 20, 0.05)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: "1.35rem 1.5rem 1rem",
            background:
              "linear-gradient(155deg, var(--avcd-bg-elevated) 0%, #15261c 100%)",
            borderBottom: "1px solid rgba(245, 240, 232, 0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(245, 240, 232, 0.55)",
              fontFamily: "var(--font-body)",
            }}
          >
            AVCD Tech
          </p>
          <h1
            style={{
              margin: "0.35rem 0 0",
              fontSize: "1.65rem",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              color: "var(--avcd-text-on-dark)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              margin: "0.5rem 0 0",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              color: "rgba(245, 240, 232, 0.78)",
              fontFamily: "var(--font-body)",
            }}
          >
            Sign in with Google. You will always see Google’s account chooser so you can pick
            or add a different account after signing out.
          </p>
          <div
            style={{
              margin: "1rem 0 0",
              padding: "0.75rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(245, 240, 232, 0.08)",
              border: "1px solid rgba(245, 240, 232, 0.12)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(245, 240, 232, 0.55)",
                fontFamily: "var(--font-body)",
              }}
            >
              MCP server URL (Claude Web / Desktop)
            </p>
            <code
              style={{
                display: "block",
                marginTop: "0.45rem",
                fontSize: "0.78rem",
                lineHeight: 1.45,
                wordBreak: "break-all",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "rgba(245, 240, 232, 0.92)",
              }}
            >
              {mcpServerUrl}
            </code>
            <p
              style={{
                margin: "0.55rem 0 0",
                fontSize: "0.78rem",
                lineHeight: 1.45,
                color: "rgba(245, 240, 232, 0.72)",
                fontFamily: "var(--font-body)",
              }}
            >
              After you sign in, this page shows your <strong>bearer token</strong> to paste into
              Claude’s MCP connector settings together with this URL.
            </p>
          </div>
        </div>

        <div style={{ padding: "1.5rem 1.5rem 1.35rem" }}>
          <button
            type="button"
            disabled={signingIn}
            onClick={() => {
              setError(null);
              setSigningIn(true);
              void signIn("google", { callbackUrl: "/" });
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              border: "1px solid #747775",
              background: "#fffefb",
              color: "#1f1f1f",
              fontSize: "0.9375rem",
              fontWeight: 500,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              cursor: signingIn ? "wait" : "pointer",
              boxShadow: "0 1px 2px rgba(15, 26, 20, 0.06)",
              opacity: signingIn ? 0.85 : 1,
            }}
          >
            <GoogleMark size={22} />
            {signingIn ? "Redirecting…" : "Continue with Google"}
          </button>

          {error ? (
            <p
              role="alert"
              style={{
                margin: "0.85rem 0 0",
                fontSize: "0.8125rem",
                color: "#6b2d2d",
                fontFamily: "var(--font-body)",
                lineHeight: 1.45,
              }}
            >
              {error}
            </p>
          ) : null}

          <p
            style={{
              margin: "1.15rem 0 0",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              color: "var(--avcd-text-muted)",
              fontFamily: "var(--font-body)",
              textAlign: "center",
            }}
          >
            Sign out clears this app’s session only. Your Google account may stay signed in in
            this browser (that is normal). Use Google’s account chooser when signing in again, or
            sign out of Google separately from google.com if you need to.
          </p>
        </div>
      </div>
    </main>
  );
}
