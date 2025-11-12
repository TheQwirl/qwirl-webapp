"use client";
import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { authStore } from "@/stores/useAuthStore";
import { usePathname } from "next/navigation";

interface AdaptiveLayoutProps {
  children: React.ReactNode;
}

/**
 * AdaptiveLayout component that wraps content with PageLayout when authenticated.
 * The layout structure (sidebar/mobile nav) is handled by PublicLayoutWrapper.
 * This component only handles the PageLayout header and content presentation.
 */
export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated } = authStore();

  // Get page-specific title and subtitle
  const getPageConfig = () => {
    if (pathname?.startsWith("/discover")) {
      return {
        title: "Discover",
        subtitle: "Explore Qwirls from people around the world",
      };
    }
    if (pathname?.startsWith("/question-library")) {
      return {
        title: "Question Library",
        subtitle: "Find the perfect questions for your next Qwirl",
      };
    }
    return {
      title: "Explore",
      subtitle: "",
    };
  };

  const pageConfig = getPageConfig();

  // If authenticated, wrap content in PageLayout with header
  if (isAuthenticated) {
    return (
      <PageLayout
        backNavigation={{
          title: pageConfig.title,
          subtitle: pageConfig.subtitle,
          hideBackButton: true,
        }}
      >
        {children}
      </PageLayout>
    );
  }

  // For non-authenticated users, return children directly
  return <>{children}</>;
};
