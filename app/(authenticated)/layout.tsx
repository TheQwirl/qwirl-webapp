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
      <SidebarProvider>
        {isMobile && (
          <SidebarTrigger className="absolute top-3 left-3 z-[1000]" />
        )}
        <AppSidebar />
        <main
          className={clsx(
            isMobile && "mt-6",
            "flex-grow min-h-screen overflow-hidden"
          )}
        >
          {children || <ComingSoon />}
        </main>
      </SidebarProvider>
    </QueryProvider>
  );
};

export default AuthenticatedLayout;
