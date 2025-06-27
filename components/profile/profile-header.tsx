"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, MessageCircle, Settings } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { EditableUserAvatar } from "../editable-user-avatar";
import { UserAvatar } from "../user-avatar";
import WavelengthIndicator from "../wavelength-indicator";
import { components } from "@/lib/api/v1";
import { cn } from "@/lib/utils";
import { DialogUpdateUser } from "./dialog-update-user";
import $api from "@/lib/api/client";
import { toast } from "sonner";

interface ProfileHeaderBaseProps {
  isLoading: boolean;
  for: "self" | "other";
}

interface ProfileHeaderSelfProps extends ProfileHeaderBaseProps {
  user: components["schemas"]["UserResponse"];
  for: "self";
}

interface ProfileHeaderOtherProps extends ProfileHeaderBaseProps {
  user: components["schemas"]["UserWithRelationshipResponse"];
  for: "other";
}

type ProfileHeaderProps = ProfileHeaderSelfProps | ProfileHeaderOtherProps;

const ProfileHeader = ({ user, isLoading }: ProfileHeaderProps) => {
  const { user: currentUser } = authStore();
  const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState<
    "following" | "followed_by" | "friends" | "none"
  >();
  const followMutation = $api.useMutation(
    "post",
    "/user_follows/follow/{user_id}"
  );

  const unfollowMutation = $api.useMutation(
    "post",
    "/user_follows/unfollow/{user_id}"
  );

  const isOwnProfile = currentUser?.id === user?.id;

  // Mock wavelength - replace with actual API call
  const wavelength = isOwnProfile ? null : Math.floor(Math.random() * 100) + 1;
  const isShowingWavelength = !isOwnProfile && wavelength;

  const handleFollow = () => {
    if (relationshipStatus === "following") {
      unfollowMutation.mutate(
        {
          params: {
            path: { user_id: user?.id },
          },
        },
        {
          onSuccess: () => {
            setRelationshipStatus("followed_by");
          },
          onError: () => {
            toast.error("An error occurred while unfollowing the user");
            console.error("Error unfollowing user:", unfollowMutation.error);
          },
        }
      );
    } else {
      followMutation.mutate(
        {
          params: {
            path: { user_id: user?.id },
          },
        },
        {
          onSuccess: () => {
            setRelationshipStatus("following");
          },
          onError: () => {
            toast.error("An error occurred while following the user");
            console.error("Error following user:", unfollowMutation.error);
          },
        }
      );
    }
  };

  const handleMessage = () => {
    // Implement message logic
    console.log("Message user");
  };

  const handleEditHeaderImage = () => {
    // Will be implemented later
    console.log("Edit header image");
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Header Image */}
          <div
            className="h-48 bg-accent relative"
            style={{
              backgroundImage: user?.header_img
                ? `url(${user?.header_img})`
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
                onClick={handleEditHeaderImage}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {/* <div className="absolute inset-0 bg-black/20" /> */}
          </div>

          {/* Profile Content */}
          <div className="relative pt-0 px-4">
            <div className="flex flex-row items-center gap-4 -mt-[95px] relative z-10">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {isOwnProfile ? (
                  <EditableUserAvatar
                    name={user?.name ?? "Name Unavailable"}
                    image={user?.avatar ?? ""}
                    className=""
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
                    className=" object-cover text-xl"
                  />
                )}
              </div>
              <div className="flex-shrink-0 flex-1 ">
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.name}
                    </h1>
                    <div className="text-gray-600">@{user?.username}</div>
                  </div>
                  <div className="flex flex-row sm:items-center sm:justify-end gap-4">
                    {/* Action Buttons */}
                    <div className={cn("flex  gap-2")}>
                      {isOwnProfile ? (
                        <Button
                          icon={Settings}
                          iconPlacement="left"
                          onClick={() => setOpenUpdateUserDialog(true)}
                          variant="secondary"
                          size={"sm"}
                          className="gap-2 z-10"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            icon={Users}
                            iconPlacement="left"
                            onClick={handleFollow}
                            className="gap-2 "
                          >
                            {relationshipStatus === "friends"
                              ? "Friends"
                              : relationshipStatus === "following"
                              ? "Following"
                              : "Follow"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleMessage}
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
          </div>
          <div className="px-4 pb-2">
            {/* Categories */}
            {user?.categories && user?.categories?.length > 0 && (
              <div className="flex justify-center flex-wrap gap-3 mt-4">
                {user?.categories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {user?.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user?.categories.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            <div className="">
              {/* <div className="flex-1 min-w-0 mt-4 sm:mt-0 ">Stats</div> */}
              <div className="grid grid-cols-3 gap-6  my-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.followers_count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.following_count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Following
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user?.friends_count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Friends
                  </div>
                </div>
              </div>
              <div className="px-6">
                {/* Wavelength Indicator */}
                {isShowingWavelength && (
                  <div className="">
                    <WavelengthIndicator
                      wavelength={wavelength ?? 1}
                      userName={user?.name ?? ""}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
      <DialogUpdateUser
        open={openUpdateUserDialog}
        onOpenChange={(open: boolean) => setOpenUpdateUserDialog(open)}
      />
    </>
  );
};

export default ProfileHeader;
