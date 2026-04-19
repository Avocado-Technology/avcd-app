import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function SidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-4 py-3">
          <div
            data-testid="status-dot"
            className="h-[7px] w-[7px] rounded-full"
            style={{ background: 'var(--green)' }}
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
