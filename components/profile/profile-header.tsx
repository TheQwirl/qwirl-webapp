"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authStore } from "@/stores/useAuthStore";
import { EditableUserAvatar } from "../editable-user-avatar";
import { UserAvatar } from "../user-avatar";
import WavelengthIndicator, {
  WavelengthIndicatorLoading,
} from "../wavelength-indicator"; // WavelengthIndicatorLoading,
import { getUnimplementedMessage } from "@/lib/utils";
import $api, { fetchClient } from "@/lib/api/client";

import { DialogUpdateUser } from "./dialog-update-user";
import { MyUser, OtherUser } from "./types";
import clsx from "clsx";
import { Skeleton } from "../ui/skeleton";

interface ProfileHeaderBaseProps {
  isLoading: boolean;
  profileOf: "self" | "other";
}

interface ProfileHeaderSelfProps extends ProfileHeaderBaseProps {
  initialUser: MyUser | undefined;
  profileOf: "self";
}

interface ProfileHeaderOtherProps extends ProfileHeaderBaseProps {
  initialUser: OtherUser | undefined;
  profileOf: "other";
}

type ProfileHeaderProps = ProfileHeaderSelfProps | ProfileHeaderOtherProps;

const ProfileHeader = ({
  initialUser,
  isLoading,
  profileOf,
}: ProfileHeaderProps) => {
  const { user: currentUser } = authStore();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const queryClient = useQueryClient();

  const isOwnProfile = currentUser?.id === initialUser?.id;
  const queryKey = useMemo(
    () => [
      "get",
      "/users/{user_id}",
      {
        params: { path: { user_id: initialUser?.id ?? 0 } },
        // initialData: initialUser,
      },
    ],
    [initialUser?.id]
  );

  const { data: user, isLoading: isQueryLoading } = $api.useQuery(
    "get",
    "/users/{user_id}",
    {
      params: { path: { user_id: initialUser?.id ?? 0 } },
    },
    {
      initialData: initialUser
        ? {
            ...initialUser,
            relationship: (initialUser as OtherUser)?.relationship ?? {
              is_following: false,
              is_followed_by: false,
              is_friend: false,
              wavelength: 0,
            },
          }
        : undefined,
      enabled: !!initialUser?.id,
    }
  );
  const isDataLoading = isLoading || (isQueryLoading && !user);

  const wavelength =
    profileOf === "other" ? user?.relationship?.wavelength : null;
  const shouldShowWavelength = !!wavelength && wavelength > 0;

  const { mutate: toggleFollow } = useMutation({
    mutationFn: async (isFollowing: boolean) => {
      const endpoint = isFollowing
        ? "/user_follows/unfollow/{user_id}"
        : "/user_follows/follow/{user_id}";

      return fetchClient.POST(endpoint, {
        params: { path: { user_id: user!.id } },
      });
    },
    onMutate: async (isFollowing) => {
      await queryClient.cancelQueries({ queryKey });

      const prev = queryClient.getQueryData<OtherUser>(queryKey);
      if (!prev) return { previousUser: undefined };

      const updated: OtherUser = {
        ...prev,
        relationship: {
          ...prev.relationship!,
          is_following: !isFollowing,
        },
        followers_count: isFollowing
          ? prev.followers_count - 1
          : prev.followers_count + 1,
      };

      queryClient.setQueryData(queryKey, updated);
      return { previousUser: prev };
    },
    onError: (_, __, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKey, context.previousUser);
        toast.error("An error occurred. Please try again.");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleFollow = () => {
    if (user && profileOf === "other") {
      toggleFollow(user.relationship?.is_following ?? false);
    }
  };

  const renderUserAvatar = () =>
    isOwnProfile ? (
      <EditableUserAvatar
        name={user?.name ?? "Name Unavailable"}
        image={user?.avatar ?? ""}
        size="2xl"
        loading={isLoading}
        ringed
      />
    ) : (
      <UserAvatar
        name={user?.name ?? "Name Unavailable"}
        image={user?.avatar ?? ""}
        size="2xl"
        ringed
        loading={isLoading}
        className="object-cover text-xl"
      />
    );

  const renderCategories = () => {
    if (!user?.categories?.length) return null;

    const visible = user?.categories.slice(0, 3);
    const extra = user?.categories.length - 3;

    return (
      <div className="flex justify-center flex-wrap gap-3 mt-4">
        {visible?.map((category) => (
          <Badge key={category} variant="outline" className="text-xs">
            {category}
          </Badge>
        ))}
        {extra > 0 && (
          <Badge variant="outline" className="text-xs">
            +{extra} more
          </Badge>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="overflow-hidden p-4">
        <div className="p-4">
          <div className="">
            <div className="flex items-center gap-4 flex-col md:flex-row">
              <div className="flex-shrink-0">{renderUserAvatar()}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-col md:flex-row gap-y-4">
                  <div>
                    <h1 className="text-2xl font-semibold whitespace-nowrap">
                      {user?.name}
                    </h1>
                    <div className="text-muted-foreground text-xs">
                      @{user?.username}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {isOwnProfile ? (
                      <Button
                        icon={Settings}
                        iconPlacement="left"
                        onClick={() => setOpenUpdateDialog(true)}
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleFollow}
                          icon={Users}
                          iconPlacement="left"
                          className={clsx(
                            "gap-2 rounded-full shadow-none bg-opacity-50"
                          )}
                          variant={
                            user?.relationship?.is_friend ||
                            user?.relationship?.is_following
                              ? "destructive"
                              : "default"
                          }
                        >
                          {user?.relationship?.is_friend ||
                          user?.relationship?.is_following
                            ? "Unfollow"
                            : "Follow"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            toast.info(getUnimplementedMessage("Messaging"))
                          }
                          className="shadow-none rounded-full"
                          icon={MessageCircle}
                          iconPlacement="left"
                        >
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            {renderCategories()}

            <div
              className={clsx(
                " mt-5 grid grid-cols-3 gap-1 col-span-full md:col-span-1 border p-2 rounded-2xl divide-x",
                {
                  "!col-span-full": !shouldShowWavelength,
                }
              )}
            >
              {[
                { label: "Followers", count: user?.followers_count },
                { label: "Following", count: user?.following_count },
                { label: "Friends", count: user?.friends_count },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-between"
                >
                  <span className="text-[10px] tracking-widest uppercase text-gray-400">
                    {item.label}
                  </span>
                  <span className="text-3xl font-black leading-tight tracking-tight">
                    {item.count ?? "--"}
                  </span>
                </div>
              ))}
            </div>
            {shouldShowWavelength && (
              <div className="w-full flex justify-center mt-5">
                {isDataLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <WavelengthIndicator
                    wavelength={wavelength}
                    userName={user?.name ?? ""}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {isOwnProfile && (
        <DialogUpdateUser
          open={openUpdateDialog}
          onOpenChange={setOpenUpdateDialog}
        />
      )}
    </>
  );
};

export const ProfileHeaderLoading = ({
  showWavelength,
}: {
  showWavelength?: boolean;
}) => {
  return (
    <Card className="overflow-hidden p-4">
      <div className="p-4">
        <div className="">
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <div className="flex-shrink-0">
              <UserAvatar loading size="xl" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-col md:flex-row gap-y-4">
                <div>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Skeleton className="h-10 w-32 rounded-full" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex justify-center flex-wrap gap-3 mt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-24 rounded " />
              // <Badge key={index} variant="secondary" className="text-xs">
              // </Badge>
            ))}
          </div>

          <div
            className={clsx(
              " mt-5 grid grid-cols-3 gap-1 col-span-full md:col-span-1 border p-2 rounded-2xl divide-x"
            )}
          >
            {["Followers", "Following", "Friends"].map((name, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between"
              >
                <span className="text-[10px] tracking-widest uppercase text-gray-400">
                  {name}
                </span>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
          {showWavelength && (
            <div className="w-full flex justify-center mt-5">
              <WavelengthIndicatorLoading />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
