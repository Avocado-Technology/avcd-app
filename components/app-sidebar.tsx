import {
  Sidebar,
  SidebarContent,
  SidebarFooter as SidebarFooterContainer,
  SidebarHeader as SidebarHeaderContainer,
} from "@/components/ui/sidebar"
import { SidebarHeader } from "./sidebar/sidebar-header"
import { SidebarNav } from "./sidebar/sidebar-nav"
import { SidebarFooter } from "./sidebar/sidebar-footer"

interface AppSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    picture?: string | null
  }
  currentPath: string
}

export function AppSidebar({ user, currentPath }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarHeaderContainer>
        <SidebarHeader />
      </SidebarHeaderContainer>
      <SidebarContent>
        <SidebarNav currentPath={currentPath} />
      </SidebarContent>
      <SidebarFooterContainer>
        <SidebarFooter user={user} />
      </SidebarFooterContainer>
    </Sidebar>
  )
}
