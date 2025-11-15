"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNavBar } from "@/components/layout/mobile-navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import PageLoader from "@/components/page-loader";

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
    const desktopLayout = (
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
    );

    const mobileLayout = (
      <>
        <div className="flex min-h-screen flex-col pb-[calc(3.75rem+env(safe-area-inset-bottom))]">
          <div className="flex-1">{children}</div>
        </div>
        <MobileNavBar />
      </>
    );

    const loadingFallback = (
      <div className="flex min-h-screen items-center justify-center">
        <PageLoader />
      </div>
    );

    return (
      <div className="relative mx-auto">
        {typeof isMobile === "boolean"
          ? isMobile
            ? mobileLayout
            : desktopLayout
          : loadingFallback}
      </div>
    );
  }

  // Default public layout structure
  return <section className="w-screen min-h-screen">{children}</section>;
};
