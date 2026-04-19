import Link from "next/link"
import { Home, Users } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface SidebarNavProps {
  currentPath: string
}

const navItems = [
  {
    title: "MCP Setup",
    href: "/",
    icon: Home,
  },
  {
    title: "Organization",
    href: "/org",
    icon: Users,
  },
]

export function SidebarNav({ currentPath }: SidebarNavProps) {
  return (
    <nav aria-label="Main navigation" className="px-3">
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = currentPath === item.href
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link 
                  href={item.href}
                  className={isActive ? 'bg-gray-100' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </nav>
  )
}
