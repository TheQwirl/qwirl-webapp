"use client";
import {
  // SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useIsMobile } from "../../hooks/use-mobile";
import QueryProvider from "@/components/query-provider";
import ComingSoon from "@/components/coming-soon";
import { MobileNavBar } from "@/components/layout/mobile-navbar";
import PageLoader from "@/components/page-loader";
// import { toast } from "sonner";
import { authStore } from "@/stores/useAuthStore";
import { usePathname } from "next/navigation";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { checkSession, isLoading } = authStore();
  const pathname = usePathname();

  useEffect(() => {
    checkSession();
    console.log("AuthProvider: Checking session...");
  }, [checkSession, pathname]);

  return (
    <QueryProvider>
      <div className="max-w-7xl mx-auto relative">
        {!isMobile ? (
          <SidebarProvider
            className="flex min-h-screen w-full"
            style={
              {
                "--sidebar-width": "280px",
                "--sidebar-width-collapsed": "0px",
              } as React.CSSProperties
            }
          >
            <AppSidebar
              collapsible="none"
              className="border-r sticky top-0 h-screen"
            />
            {isLoading ? (
              <PageLoader />
            ) : (
              <div className="flex-1">
                <main className="p-4">{children || <ComingSoon />}</main>
              </div>
            )}
          </SidebarProvider>
        ) : (
          <>
            <div className="min-h-screen pb-14">
              {" "}
              <main className="p-4">{children || <ComingSoon />}</main>
            </div>
            <MobileNavBar />
          </>
        )}
      </div>
    </QueryProvider>
  );
};

export default AuthenticatedLayout;
