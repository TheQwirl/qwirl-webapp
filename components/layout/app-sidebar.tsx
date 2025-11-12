"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import ProfileHeader from "./sidebar/profile-header";
import { MENU_SECTIONS } from "@/constants/data-sidebar";
import SidebarSingleMenuItem from "./sidebar/sidebar-single-menu-item";
import GroupSidebarMenuItem from "./sidebar/group-sidebar-menu-item";
import { LogoutComponent } from "../logout-component";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <ProfileHeader />
          </div>
        </div>
        <SidebarContent className="mt-6">
          {MENU_SECTIONS.map((section, sectionIndex) => (
            <React.Fragment key={section.title}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) =>
                    item.type === "single" ? (
                      <SidebarSingleMenuItem key={item.title} item={item} />
                    ) : (
                      <GroupSidebarMenuItem key={item.title} item={item} />
                    )
                  )}
                </SidebarMenu>
              </SidebarGroup>
              {/* Add divider between sections except after last section */}
              {sectionIndex < MENU_SECTIONS.length - 1 && (
                <div className="my-4 border-t border-sidebar-border" />
              )}
            </React.Fragment>
          ))}
        </SidebarContent>
        <SidebarFooter className="">
          <LogoutComponent />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
