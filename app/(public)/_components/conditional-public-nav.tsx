"use client";
import { usePathname } from "next/navigation";
import { authStore } from "@/stores/useAuthStore";
import PublicNav from "./public-nav";
import SiteNav from "@/components/site-nav";

/**
 * Conditional navigation component that decides whether to show PublicNav
 * based on the current route and authentication state.
 *
 * Pages that should adapt their layout when authenticated:
 * - /discover
 * - /question-library
 *
 * These pages will use their own AdaptiveLayout instead of showing PublicNav when logged in.
 */
export const ConditionalPublicNav = () => {
  const pathname = usePathname();
  const { isAuthenticated } = authStore();

  // Routes that should NOT show PublicNav when user is authenticated
  const adaptiveRoutes = ["/discover", "/question-library"];
  const isAdaptiveRoute = adaptiveRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  // If user is authenticated and on an adaptive route, don't show PublicNav
  if (isAuthenticated && isAdaptiveRoute) {
    return null;
  }

  // Show PublicNav for all other cases
  return isAdaptiveRoute ? <SiteNav /> : <PublicNav />;
};
