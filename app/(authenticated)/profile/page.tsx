import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs from "@/components/profile/profile-tabs";
import { cookies } from "next/headers";
import Link from "next/link";
import ProfileStoreInitializer from "./_components/profile-store-initializer";
import { serverFetchClient } from "@/lib/api/server";
import { PageLayout } from "@/components/layout/page-layout";

const Profile = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  const userResponse = await serverFetchClient.GET("/api/v1/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const user = userResponse?.data;

  if (!user?.id) {
    return (
      <div className="h-full px-20 py-20 w-full flex items-center justify-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-red-600">User not found</h1>
          <p className="text-gray-500">
            You are not logged in or the user data is missing.
          </p>
          <Link
            href="/auth/login"
            className="mt-4 text-blue-500 hover:underline"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      rightSidebar={<ProfileSidebar />}
      backNavigation={{
        title: "My Profile",
      }}
    >
      <ProfileStoreInitializer profileFor="self" user={user} />

      <div className="">
        <ProfileHeader profileOf="self" initialUser={user} isLoading={false} />
      </div>

      <div className="mt-4 pb-10">
        <ProfileTabs />
      </div>
    </PageLayout>
  );
};

export default Profile;
