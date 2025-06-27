"use client";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { authStore } from "@/stores/useAuthStore";

const ProfileHeader = () => {
  const { user } = authStore();
  return (
    <SidebarHeader>
      <div className="flex items-center justify-center flex-col">
        {user ? (
          <>
            <UserAvatar
              name={user?.name ?? "Name Unavailable"}
              image={user?.avatar ?? ""}
              size={"lg"}
              className="object-cover text-xl"
            />
            <div className="font-bold text-lg mt-3">{user?.name}</div>
            <div className="text-muted-foreground text-xs">
              @{user?.username}
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-48 rounded-full mt-3" />
            <Skeleton className="h-2 w-28 mt-2 rounded-full" />
          </>
        )}
      </div>
    </SidebarHeader>
  );
};

export default ProfileHeader;
