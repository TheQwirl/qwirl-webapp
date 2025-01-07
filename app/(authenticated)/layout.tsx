"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useIsMobile } from "../../hooks/use-mobile";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider>
      {isMobile && <SidebarTrigger />}
      <AppSidebar />
      <main className="p-10">{children}</main>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
