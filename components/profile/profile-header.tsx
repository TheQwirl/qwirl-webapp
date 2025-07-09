"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authStore } from "@/stores/useAuthStore";
import { EditableUserAvatar } from "../editable-user-avatar";
import { UserAvatar } from "../user-avatar";
import WavelengthIndicator from "../wavelength-indicator";
import { getUnimplementedMessage } from "@/lib/utils";
import $api, { fetchClient } from "@/lib/api/client";

import { DialogUpdateUser } from "./dialog-update-user";
import { MyUser, OtherUser } from "./types";

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
  const queryKey = [
    "get",
    "/users/{user_id}",
    {
      params: { path: { user_id: initialUser?.id ?? 0 } },
      initialData: initialUser,
    },
  ];

  const { data: user } = $api.useQuery(
    "get",
    "/users/{user_id}",
    {
      params: { path: { user_id: initialUser?.id ?? 0 } },
      initialData: initialUser,
    },
    { enabled: !!initialUser?.id }
  );

  const wavelength =
    profileOf === "other" ? user?.relationship?.wavelength : null;

  console.log(wavelength);

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
        size="lg"
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
          <Badge key={category} variant="secondary" className="text-xs">
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
      <Card className="overflow-hidden">
        <div className="relative">
          <div
            className="h-36 bg-accent"
            style={{
              backgroundImage: user?.header_img
                ? `url(${user.header_img})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {isOwnProfile && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute z-10 top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-0"
                onClick={() =>
                  toast.info(getUnimplementedMessage("Header Image Editing"))
                }
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="p-4">
            <div className="">
              <div className="flex items-center gap-4 ">
                <div className="flex-shrink-0">{renderUserAvatar()}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user?.name}
                      </h1>
                      <div className="text-gray-600">@{user?.username}</div>
                    </div>
                    <div className="flex gap-2">
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
                            className="gap-2"
                          >
                            {user?.relationship?.is_friend ||
                            user?.relationship?.is_following
                              ? "Unfollow"
                              : "Follow"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              toast.info(getUnimplementedMessage("Messaging"))
                            }
                            className="gap-2"
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

              <div className="grid grid-cols-3 gap-6 my-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.followers_count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Followers
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.following_count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Following
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.friends_count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Friends
                  </div>
                </div>
              </div>

              {!!wavelength && wavelength > 0 && (
                <div className="my-4 px-6">
                  <WavelengthIndicator
                    wavelength={wavelength}
                    userName={user?.name ?? ""}
                  />
                </div>
              )}
            </div>
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

export default ProfileHeader;
