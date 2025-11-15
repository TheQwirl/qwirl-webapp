"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useIsMobile } from "../../hooks/use-mobile";
import ComingSoon from "@/components/coming-soon";
import { MobileNavBar } from "@/components/layout/mobile-navbar";
import PageLoader from "@/components/page-loader";
import { authStore } from "@/stores/useAuthStore";
import { InfoAlertProvider } from "@/components/info-alert-provider";
import { ConfirmationModal } from "@/components/confirmation-modal";
import {
  UserSetupProvider,
  InteractiveOnboardingProvider,
} from "@/components/onboarding";
import { AuthenticatedCartWrapper } from "./_components/authenticated-cart-wrapper";
import { FloatingCartButton } from "@/components/layout/cart-button";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { checkSession, isLoading } = authStore();

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      console.log("AuthProvider: Checking session on initial load...");
      checkSession();
      isInitialLoad.current = false;
    }
  }, [checkSession]);

  const resolvedContent = isLoading ? (
    <PageLoader />
  ) : (
    children || <ComingSoon />
  );

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
      <div className="flex-1">
        <main>{resolvedContent}</main>
      </div>
    </SidebarProvider>
  );

  const mobileLayout = (
    <>
      <div className="flex min-h-screen flex-col pb-[calc(3.75rem+env(safe-area-inset-bottom))]">
        <main className="flex-1 sm:p-4">{resolvedContent}</main>
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
    <InfoAlertProvider>
      <UserSetupProvider>
        <InteractiveOnboardingProvider>
          <FloatingCartButton />
          <div className="relative mx-auto">
            {typeof isMobile === "boolean"
              ? isMobile
                ? mobileLayout
                : desktopLayout
              : loadingFallback}
          </div>
          <ConfirmationModal />
          <AuthenticatedCartWrapper />
        </InteractiveOnboardingProvider>
      </UserSetupProvider>
    </InfoAlertProvider>
  );
};

export default AuthenticatedLayout;
