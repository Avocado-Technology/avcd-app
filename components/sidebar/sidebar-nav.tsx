import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { APP_NAV_ITEMS } from "@/lib/mobile-nav-config"

interface SidebarNavProps {
  currentPath: string
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  return (
    <nav aria-label="Main navigation" className="px-3">
      <SidebarMenu>
        {APP_NAV_ITEMS.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/" && currentPath.startsWith(`${item.href}/`))
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link
                  href={item.href}
                  className={isActive ? "bg-gray-100" : ""}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </nav>
  )
}
