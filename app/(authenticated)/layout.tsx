"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useIsMobile } from "../../hooks/use-mobile";
import QueryProvider from "@/components/query-provider";
import ComingSoon from "@/components/coming-soon";
import clsx from "clsx";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <QueryProvider>
      <SidebarProvider className="min-h-screen overflow-hidden">
        {isMobile && <SidebarTrigger className="absolute top-3 left-3 z-50" />}
        <AppSidebar />
        <main
          className={clsx(
            isMobile && "",
            "flex-grow  overflow-hidden overflow-x-hidden"
          )}
        >
          {children || <ComingSoon />}
        </main>
      </SidebarProvider>
    </QueryProvider>
  );
};

export default AuthenticatedLayout;
