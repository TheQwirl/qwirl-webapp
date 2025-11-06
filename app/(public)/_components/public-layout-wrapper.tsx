"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNavBar } from "@/components/layout/mobile-navbar";
import { useIsMobile } from "@/hooks/use-mobile";

interface PublicLayoutWrapperProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

/**
 * Wrapper that determines the layout structure based on authentication and route.
 * For adaptive routes (/discover, /question-library), uses authenticated layout when logged in.
 */
export const PublicLayoutWrapper = ({
  children,
  isAuthenticated,
}: PublicLayoutWrapperProps) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Routes that should use authenticated layout when user is logged in
  const adaptiveRoutes = ["/discover", "/question-library"];
  const isAdaptiveRoute = adaptiveRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  // If authenticated and on an adaptive route, use authenticated layout structure
  if (isAuthenticated && isAdaptiveRoute) {
    return (
      <div className=" mx-auto relative">
        {!isMobile ? (
          <SidebarProvider
            className="flex min-h-screen w-full"
            style={
              {
                "--sidebar-width": "300px",
                "--sidebar-width-collapsed": "0px",
              } as React.CSSProperties
            }
          >
            <AppSidebar collapsible="none" className="sticky top-0 h-screen" />
            <div className="flex-1">{children}</div>
          </SidebarProvider>
        ) : (
          <>
            <div className="min-h-screen pb-14">{children}</div>
            <MobileNavBar />
          </>
        )}
      </div>
    );
  }

  // Default public layout structure
  return <section className="w-screen min-h-screen">{children}</section>;
};
