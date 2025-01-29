"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProfileHeader from "./sidebar/profile-header";
import { MENU_ITEMS } from "@/constants/data-sidebar";
import SidebarSingleMenuItem from "./sidebar/sidebar-single-menu-item";
import GroupSidebarMenuItem from "./sidebar/group-sidebar-menu-item";
import { LogoutComponent } from "../logout-component";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  return (
    <Sidebar
      // variant="sidebar"
      className="rounded-r-[100px] border border-dashed shadow-lg"
      // collapsible="offcanvas"
      {...props}
    >
      <div className="relative">
        {isMobile && <SidebarTrigger className="absolute top-3 left-3" />}
      </div>
      <div className="px-8 py-8">
        <ProfileHeader />
        <SidebarContent className="mt-4">
          <SidebarGroup>
            <SidebarMenu className="space-y-4">
              {MENU_ITEMS.map((item) =>
                item.type === "single" ? (
                  <SidebarSingleMenuItem key={item.title} item={item} />
                ) : (
                  <GroupSidebarMenuItem key={item.title} item={item} />
                )
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <LogoutComponent
            username="John Doe"
            email="john@example.com"
            avatarUrl="/placeholder.svg?height=40&width=40"
            onLogout={() => {}}
          />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
