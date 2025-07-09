import ProfileHeader from "@/components/profile/profile-header";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileTabs from "@/components/profile/profile-tabs";
import { serverFetchClient } from "@/lib/api/server";
import { safeToNumber } from "@/lib/utils";
import { cookies } from "next/headers";
import Image from "next/image";

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
    return (
      <div className="h-full px-20 py-20 w-full flex items-center justify-center">
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/assets/error-user.svg"
            alt="error user"
            width={200}
            height={200}
          />
          <h1 className="text-2xl font-bold text-red-600">User not found</h1>
          <p className="text-gray-500">
            The user you are looking for does not exist or has been deleted.
          </p>
          <a href="/feed" className="mt-4 text-blue-500 hover:underline">
            Go back to feed
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <ProfileHeader profileOf="other" initialUser={user} isLoading={!user} />
        <div className="mt-6 pl-5 pb-10">
          <ProfileTabs profileFor="other" user={user} />
        </div>
      </div>
      <div className="col-span-4">
        <ProfileSidebar />
      </div>
    </div>
  );
}
