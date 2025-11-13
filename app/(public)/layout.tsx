import React from "react";
import { cookies } from "next/headers";
import { serverFetchClient } from "@/lib/api/server";
import { PublicUserProvider } from "./_components/public-user-provider";
import { InfoAlertProvider } from "@/components/info-alert-provider";
import { ConditionalPublicNav } from "./_components/conditional-public-nav";
import { PublicLayoutWrapper } from "./_components/public-layout-wrapper";
import { PublicCartWrapper } from "./_components/public-cart-wrapper";
import { FloatingCartButton } from "@/components/layout/cart-button";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  let userData = null;
  let isAuthenticated = false;

  if (accessToken) {
    try {
      const userResponse = await serverFetchClient.GET("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userData = userResponse.data || null;
      isAuthenticated = !!userData;
    } catch (error) {
      console.error("Failed to fetch user in public layout:", error);
    }
  }

  return (
    <PublicUserProvider initialUser={userData}>
      <InfoAlertProvider>
        <PublicLayoutWrapper isAuthenticated={isAuthenticated}>
          <ConditionalPublicNav />
          <main className="pt-0">{children}</main>
          {isAuthenticated && <FloatingCartButton />}
        </PublicLayoutWrapper>
        <PublicCartWrapper isAuthenticated={isAuthenticated} />
      </InfoAlertProvider>
    </PublicUserProvider>
  );
};

export default PublicLayout;
