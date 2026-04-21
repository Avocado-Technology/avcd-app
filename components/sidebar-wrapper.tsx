'use client'

import { usePathname } from '@/i18n/navigation'
import { AppSidebar } from './app-sidebar'

interface SidebarWrapperProps {
  user: {
    name?: string | null
    email?: string | null
    picture?: string | null
  }
}

export function SidebarWrapper({ user }: SidebarWrapperProps) {
  const pathname = usePathname()
  
  return <AppSidebar user={user} currentPath={pathname} />
}
