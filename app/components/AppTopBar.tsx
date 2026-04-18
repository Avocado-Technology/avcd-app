"use client";

import type { UserProfile } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

type Props = {
  session: { user: UserProfile };
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
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sp-4)",
        padding: "0 var(--sp-6)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--g200)",
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", minWidth: 0 }}>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--green)",
            flexShrink: 0,
          }}
          aria-hidden
        />
        <span
          style={{
            fontSize: "0.875rem",
            fontFamily: "var(--sans)",
            fontWeight: 500,
            color: "var(--g900)",
            letterSpacing: "-0.01em",
          }}
        >
          AVCD
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontFamily: "var(--mono)",
            fontWeight: 400,
            color: "var(--g500)",
            marginLeft: "var(--sp-2)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={displayName}
        >
          {displayName}
        </span>
      </div>
      <Link
        href="/api/auth/logout"
        prefetch={false}
        style={{
          flexShrink: 0,
          fontSize: "0.75rem",
          fontFamily: "var(--sans)",
          fontWeight: 500,
          padding: "var(--sp-2) var(--sp-4)",
          borderRadius: "var(--r-md)",
          border: "1px solid var(--g300)",
          background: "var(--bg)",
          color: "var(--g700)",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-block",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--g400)";
          e.currentTarget.style.color = "var(--g900)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--g300)";
          e.currentTarget.style.color = "var(--g700)";
        }}
      >
        Sign out
      </Link>
    </header>
  );
}
