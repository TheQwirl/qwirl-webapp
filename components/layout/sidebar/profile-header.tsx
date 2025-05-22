"use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarHeader } from "@/components/ui/sidebar";
import UserAvatar from "@/components/user-avatar";
import $api from "@/lib/api/client";

const ProfileHeader = () => {
  const userQuery = $api.useQuery("get", "/api/v1/users/me");
  const user = userQuery?.data;
  return (
    <SidebarHeader>
      <div className="flex items-center justify-center flex-col">
        <UserAvatar
          name={user?.name ?? "Name Unavailable"}
          image={user?.avatar ?? ""}
          className="h-20 w-20 object-cover text-xl border-2 border-white shadow-md"
        />
        <div className="font-bold text-lg mt-3">{user?.name}</div>
        <div className="text-muted-foreground text-xs">@{user?.username}</div>
      </div>
    </SidebarHeader>
  );
};

export default ProfileHeader;
