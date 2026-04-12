"use client";

import type { CSSProperties } from "react";
import type { UserProfile } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

type Props = {
  session: { user: UserProfile };
};

const signOutButtonStyle: CSSProperties = {
  flexShrink: 0,
  fontSize: "0.8125rem",
  fontFamily: "var(--font-body)",
  padding: "0.4rem 0.85rem",
  borderRadius: "6px",
  border: "1px solid rgba(245, 240, 232, 0.35)",
  background: "transparent",
  color: "var(--avcd-text-on-dark)",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
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
      <Link href="/api/auth/logout" prefetch={false} style={signOutButtonStyle}>
        Sign out
      </Link>
    </header>
  );
}
