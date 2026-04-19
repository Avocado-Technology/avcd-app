"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

type Props = {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      picture?: string | null;
    };
  };
};

export function AppTopBar({ session }: Props) {
  const displayName =
    session.user?.name?.trim() ||
    session.user?.email?.trim() ||
    "Account";
  const pathname = usePathname();

  return (
    <header
      role="banner"
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sp-4)",
        padding: "0 clamp(1rem, 5vw, 3rem)",
        background: "var(--bg-blur)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--g200)",
        position: "sticky",
        top: 0,
        zIndex: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", minWidth: 0 }}>
        {/* Mobile Navigation - visible on mobile/tablet only */}
        <div className="md:hidden">
          <MobileNav user={session.user} currentPath={pathname} />
        </div>
        
        {/* Desktop Sidebar Trigger - visible on desktop only */}
        <div className="hidden md:block">
          <SidebarTrigger />
        </div>
        
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
          className="hidden sm:inline"
        >
          {displayName}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
        <ThemeToggle />
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
      </div>
    </header>
  );
}
