"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
} from "@/components/ui/sidebar";
import ProfileHeader from "./sidebar/profile-header";
import { MENU_ITEMS } from "@/constants/data-sidebar";
import SidebarSingleMenuItem from "./sidebar/sidebar-single-menu-item";
import GroupSidebarMenuItem from "./sidebar/group-sidebar-menu-item";
import { LogoutComponent } from "../logout-component";
import { authStore } from "@/stores/useAuthStore";
// import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = authStore();
  // const router = useRouter();

  const handleLogout = () => {
    console.log("LogoutButton: Initiating logout");
    logout();
  };
  return (
    <Sidebar {...props}>
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
          <LogoutComponent onLogout={() => handleLogout()} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
