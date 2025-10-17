import React from "react";
import PublicNav from "./_components/public-nav";
import { cookies } from "next/headers";
import { serverFetchClient } from "@/lib/api/server";
import { PublicUserProvider } from "./_components/public-user-provider";
import { InfoAlertProvider } from "@/components/info-alert-provider";

const PublicLayout = async ({ children }: { children: React.ReactElement }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  let userData = null;

  if (accessToken) {
    try {
      const userResponse = await serverFetchClient.GET("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userData = userResponse.data || null;
    } catch (error) {
      console.error("Failed to fetch user in public layout:", error);
    }
  }

  return (
    <section className="w-screen min-h-screen">
      <PublicUserProvider initialUser={userData}>
        <InfoAlertProvider>
          <PublicNav />
          <main className="pt-0">{children}</main>
        </InfoAlertProvider>
      </PublicUserProvider>
    </section>
  );
};

export default PublicLayout;
