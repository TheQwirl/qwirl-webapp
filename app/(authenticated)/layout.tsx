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
import { AuthProvider } from "@/components/auth-provider";
import { MobileNavBar } from "@/components/layout/mobile-navbar";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/page-loader";
import { toast } from "sonner";
import { authStore } from "@/stores/useAuthStore";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { user, isLoading, isInitialized, error } = authStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      if (error) {
        toast.error("Authentication Error", {
          description: error,
          className: "bg-red-500 text-white",
        });
      } else {
        toast("Logged Out!", {
          // description: "You need to be logged in to access this page.",
          className: "bg-red-500 text-white",
        });
      }
      console.log("layout.tsx: Redirecting to /auth due to no user");
      router.push("/auth");
    }
  }, [isInitialized, isLoading, user, error, router]);

  return (
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
          {isLoading && !isInitialized && !user ? (
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
  );
};

export default function WrappedAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </AuthProvider>
    </QueryProvider>
  );
}
