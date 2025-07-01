"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/stores/useAuthStore";
import PageLoader from "@/components/page-loader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { user, isLoading } = authStore();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        console.log(
          "Authenticated user found on an unauthenticated route. Redirecting to /feed."
        );
        router.replace("/feed");
      }
    }
  }, [user, isLoading, router]);

  //   if (isLoading || !isInitialized) {
  //     return <PageLoader description="Loading..." />;
  //   }

  if (user) {
    return <PageLoader description="Redirecting..." />;
  }

  return <>{children}</>;
};

export default Layout;
