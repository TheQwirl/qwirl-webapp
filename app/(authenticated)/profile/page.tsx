import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs from "@/components/profile/profile-tabs";
import { cookies } from "next/headers";
import Link from "next/link";
import { User } from "@/types/common";

const Profile = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user: User = userCookie ? JSON.parse(userCookie) : null;

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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <ProfileHeader for="self" user={user!} isLoading={false} />
        <div className="mt-6 pl-5 pb-10">
          <ProfileTabs user={user!} />
        </div>
      </div>
      <div className="col-span-4">
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default Profile;
