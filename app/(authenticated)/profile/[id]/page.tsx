import ProfileHeader from "@/components/profile/profile-header";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileTabs from "@/components/profile/profile-tabs";
import { serverFetchClient } from "@/lib/api/server";
import { safeToNumber } from "@/lib/utils";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProfileStoreInitializer from "../_components/profile-store-initializer";
import { PageLayout } from "@/components/layout/page-layout";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  const userResponse = await serverFetchClient.GET("/api/v1/users/{user_id}", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      path: {
        user_id: safeToNumber(id, null) ?? 0,
      },
    },
  });
  const user = userResponse?.data;

  if (userResponse?.error) {
    notFound();
  }
  return (
    <PageLayout
      rightSidebar={<ProfileSidebar />}
      backNavigation={{
        title: "Profile",
      }}
    >
      <ProfileStoreInitializer profileFor="other" user={user} />

      <div className="">
        <ProfileHeader profileOf="other" initialUser={user} isLoading={false} />
      </div>
      <div className="mt-6 pl-5 pb-10">
        <ProfileTabs />
      </div>
    </PageLayout>
  );
}
