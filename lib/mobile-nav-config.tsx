import type { LucideIcon } from "lucide-react"
import { Settings, Users, Wallet } from "lucide-react"

/** Canonical nav item shared by sidebar, bottom bar, and overflow. */
export type MobileNavItemConfig = {
  labelKey: string // key into Navigation namespace
  href: string
  icon: LucideIcon
}

/** Single source of truth for primary app destinations (sidebar + mobile). */
export const APP_NAV_ITEMS: MobileNavItemConfig[] = [
  { labelKey: "finance", href: "/finance", icon: Wallet },
  { labelKey: "organization", href: "/org", icon: Users },
  /** MCP connection UI at this path; Traefik serves the MCP protocol at `/mcp` separately. */
  { labelKey: "settings", href: "/settings/mcp", icon: Settings },
]

/** Bottom bar favorites: first two entries (fixed “favorites”). */
export function getFavoriteNavItems(
  items: MobileNavItemConfig[] = APP_NAV_ITEMS,
): MobileNavItemConfig[] {
  return items.slice(0, 2)
}

/** Routes shown under More instead of the bottom tab row. */
export function getOverflowNavItems(
  items: MobileNavItemConfig[] = APP_NAV_ITEMS,
): MobileNavItemConfig[] {
  return items.slice(2)
}

/** @deprecated Use APP_NAV_ITEMS — kept for incremental refactors */
export const MOBILE_PRIMARY_NAV_ITEMS = APP_NAV_ITEMS
