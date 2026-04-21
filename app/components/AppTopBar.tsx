"use client";

import { usePathname } from "@/i18n/navigation";
import { useMinWidthLg } from "@/hooks/use-min-width-lg";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { isMobileBottomNavEnabled } from "@/lib/feature-flags";
import NextLink from "next/link";

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
  const hideDrawerForBottomNav = isMobileBottomNavEnabled();
  const isLg = useMinWidthLg();
  /** Theme + sign out live in bottom “More” sheet below lg when bottom nav is enabled */
  const hideHeaderChromeActions = hideDrawerForBottomNav && !isLg;

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
        {/* Mobile drawer — hidden when bottom tab navigation is enabled */}
        {!hideDrawerForBottomNav && (
          <div className="md:hidden">
            <MobileNav user={session.user} currentPath={pathname} />
          </div>
        )}
        
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
      {!hideHeaderChromeActions ? (
        <div className="flex items-center gap-[var(--sp-3)]">
          <ThemeToggle />
          <Button variant="secondary" size="default" className="min-h-11 shrink-0 font-sans text-xs font-medium" asChild>
            <NextLink href="/api/auth/logout" prefetch={false}>
              Sign out
            </NextLink>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
