'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className={cn("h-16 border-b border-sidebar-border flex items-center", collapsed ? "justify-center" : "px-4")}>
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <Logo className="w-8 h-8 text-primary" />
          {!collapsed && <span className="text-xl font-bold text-foreground">SportsShop</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <MainNav collapsed={collapsed} />
      </SidebarContent>
      <SidebarFooter>
        {/* Can add footer items here */}
      </SidebarFooter>
    </Sidebar>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
