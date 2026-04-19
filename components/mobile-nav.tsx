'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { SidebarHeader } from './sidebar/sidebar-header'
import { SidebarNav } from './sidebar/sidebar-nav'
import { SidebarFooter } from './sidebar/sidebar-footer'
import { Button } from './ui/button'

interface MobileNavProps {
  user: {
    name?: string | null
    email?: string | null
    picture?: string | null
  }
  currentPath: string
}

export function MobileNav({ user, currentPath }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[280px] p-0"
        aria-label="Navigation menu"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <SidebarHeader />
          </div>
          <div className="flex-1 p-4">
            <SidebarNav currentPath={currentPath} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <SidebarFooter user={user} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
