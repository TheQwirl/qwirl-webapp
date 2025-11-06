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
import { OnboardingProvider } from "@/components/onboarding";
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

  return (
    <InfoAlertProvider>
      <OnboardingProvider>
        <FloatingCartButton />
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
              <AppSidebar
                collapsible="none"
                className="sticky top-0 h-screen"
              />
              {isLoading ? (
                <PageLoader />
              ) : (
                <div className="flex-1">
                  <main className="">{children || <ComingSoon />}</main>
                </div>
              )}
            </SidebarProvider>
          ) : (
            <>
              <div className="min-h-screen pb-14">
                <main className="sm:p-4">{children || <ComingSoon />}</main>
              </div>
              <MobileNavBar />
            </>
          )}
        </div>
        <ConfirmationModal />
        <AuthenticatedCartWrapper />
      </OnboardingProvider>
    </InfoAlertProvider>
  );
};

export default AuthenticatedLayout;
