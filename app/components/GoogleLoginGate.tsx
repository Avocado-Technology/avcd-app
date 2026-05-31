"use client";

import { useEffect, useState } from "react";

function messageForAuthError(code: string | null): string | null {
  if (!code) return null;
  switch (code) {
    case "Configuration":
      return "Sign-in is misconfigured on the server (check Keycloak settings).";
    case "AccessDenied":
    case "access_denied":
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
        padding: "var(--sp-6)",
        background: "var(--g50)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "26rem",
          borderRadius: "var(--r-xl)",
          background: "var(--bg)",
          border: "1px solid var(--g200)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "var(--sp-8) var(--sp-6) var(--sp-6)",
            borderBottom: "1px solid var(--g200)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", marginBottom: "var(--sp-3)" }}>
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--green)",
              }}
              aria-hidden
            />
            <span
              style={{
                fontSize: "0.6875rem",
                fontFamily: "var(--mono)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--g500)",
              }}
            >
              AVCD MCP
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              fontFamily: "var(--sans)",
              color: "var(--g900)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "var(--sp-3)",
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "var(--g700)",
              fontFamily: "var(--sans)",
            }}
          >
            Sign in with Google to access your MCP server and generate OAuth credentials for Claude.
          </p>
          <div
            style={{
              marginTop: "var(--sp-6)",
              padding: "var(--sp-4)",
              borderRadius: "var(--r-md)",
              background: "var(--g50)",
              border: "1px solid var(--g200)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--g500)",
                fontFamily: "var(--mono)",
                marginBottom: "var(--sp-2)",
              }}
            >
              MCP Server URL
            </p>
            <code
              style={{
                display: "block",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                wordBreak: "break-all",
                fontFamily: "var(--mono)",
                color: "var(--g900)",
              }}
            >
              {mcpServerUrl}
            </code>
          </div>
        </div>

        <div style={{ padding: "var(--sp-6)" }}>
          <button
            type="button"
            disabled={signingIn}
            onClick={() => {
              setError(null);
              setSigningIn(true);
              window.location.href = "/api/auth/login";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--sp-3)",
              padding: "var(--sp-3) var(--sp-5)",
              borderRadius: "var(--r-md)",
              border: "1px solid #747775",
              background: "#fffefb",
              color: "#1f1f1f",
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: "system-ui, -apple-system, sans-serif",
              cursor: signingIn ? "wait" : "pointer",
              opacity: signingIn ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            <GoogleMark size={20} />
            {signingIn ? "Redirecting…" : "Continue with Google"}
          </button>

          {error ? (
            <div
              role="alert"
              style={{
                marginTop: "var(--sp-4)",
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

          <p
            style={{
              marginTop: "var(--sp-5)",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              color: "var(--g500)",
              fontFamily: "var(--sans)",
              textAlign: "center",
            }}
          >
            Sign out clears this app&apos;s session only. Your Google account may stay signed in your browser.
          </p>
        </div>
      </div>
    </main>
  );
}
