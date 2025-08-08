import ProfileHeader from "@/components/profile/profile-header";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileTabs from "@/components/profile/profile-tabs";
import { serverFetchClient } from "@/lib/api/server";
import { safeToNumber } from "@/lib/utils";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProfileStoreInitializer from "../_components/profile-store-initializer";

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
    <>
      <ProfileStoreInitializer profileFor="other" user={user} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full md:col-span-8">
          <ProfileHeader
            profileOf="other"
            initialUser={user}
            isLoading={false}
          />
          <div className="mt-6 pl-5 pb-10">
            <ProfileTabs />
          </div>
        </div>
        <div className="col-span-full md:col-span-4">
          <ProfileSidebar />
        </div>
      </div>
    </>
  );
}
