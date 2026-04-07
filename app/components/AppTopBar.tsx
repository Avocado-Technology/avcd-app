"use client";

import type { Session } from "next-auth";

import { signOutFromApp } from "@/app/actions/auth";
import { SignOutSubmitButton } from "@/app/components/SignOutSubmitButton";

type Props = {
  session: Session;
};

export function AppTopBar({ session }: Props) {
  const displayName =
    session.user?.name?.trim() ||
    session.user?.email?.trim() ||
    "Account";

  return (
    <header
      role="banner"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.65rem clamp(1rem, 3vw, 1.5rem)",
        borderBottom: "1px solid var(--avcd-border-light)",
        background:
          "linear-gradient(165deg, var(--avcd-bg-elevated) 0%, #15261c 100%)",
        boxShadow: "0 1px 0 rgba(245, 240, 232, 0.06)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245, 240, 232, 0.5)",
            fontFamily: "var(--font-body)",
          }}
        >
          AVCD Tech
        </p>
        <p
          style={{
            margin: "0.15rem 0 0",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
            color: "var(--avcd-text-on-dark)",
            letterSpacing: "-0.02em",
            lineHeight: 1.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "min(50vw, 20rem)",
          }}
          title={displayName}
        >
          {displayName}
        </p>
        {session.user?.email && session.user?.name ? (
          <p
            style={{
              margin: "0.2rem 0 0",
              fontSize: "0.75rem",
              color: "rgba(245, 240, 232, 0.72)",
              fontFamily: "var(--font-body)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "min(70vw, 24rem)",
            }}
            title={session.user.email}
          >
            {session.user.email}
          </p>
        ) : null}
      </div>
      <form
        action={signOutFromApp}
        style={{ flexShrink: 0, margin: 0 }}
        onSubmit={() => {
          // #region agent log
          fetch(
            "http://127.0.0.1:7747/ingest/68ebbb71-aba6-417b-a281-d3987e458ee7",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "64ac3a",
              },
              body: JSON.stringify({
                sessionId: "64ac3a",
                hypothesisId: "B",
                runId: "pre-fix",
                location: "AppTopBar.tsx:form onSubmit",
                message: "client sign-out form submit",
                data: { hrefLen: window.location.href.length },
                timestamp: Date.now(),
              }),
            },
          ).catch(() => {});
          // #endregion
        }}
      >
        <SignOutSubmitButton
          label="Sign out"
          pendingLabel="Signing out…"
          style={{
            fontSize: "0.8125rem",
            fontFamily: "var(--font-body)",
            padding: "0.4rem 0.85rem",
            borderRadius: "6px",
            border: "1px solid rgba(245, 240, 232, 0.35)",
            background: "transparent",
            color: "var(--avcd-text-on-dark)",
            cursor: "pointer",
          }}
        />
      </form>
    </header>
  );
}
