import ProfileHeader from "@/components/profile/profile-header";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileTabs from "@/components/profile/profile-tabs";
import { serverFetchClient } from "@/lib/api/server";
import { safeToNumber } from "@/lib/utils";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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
  const user = userResponse.data;

  if (userResponse?.error) {
    notFound();
  }
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-full lg:col-span-8">
        <ProfileHeader profileOf="other" initialUser={user} isLoading={!user} />
        <div className="mt-6 pl-5 pb-10">
          <ProfileTabs profileFor="other" user={user} />
        </div>
      </div>
      <div className="col-span-full lg:col-span-4">
        <ProfileSidebar />
      </div>
    </div>
  );
}
