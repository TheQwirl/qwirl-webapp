"use client";

import React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  UserCheck,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";
import { UserAvatar } from "./user-avatar";
import { Skeleton } from "./ui/skeleton";
import { redirect } from "next/navigation";

interface User {
  id: number;
  name: string | null;
  username: string | null;
  avatar?: string | null;
  is_following?: boolean | null;
  wavelength?: number;
  // mutualFriends?: number; // Uncomment if you want to show mutual friends
  // bio?: string; // Uncomment if you want to show user bio
  // location?: string; // Uncomment if you want to show user location
}

interface UserCardProps {
  user: User;
  variant?: "default" | "suggestion" | "compact" | "detailed";
  showActions?: boolean;
  onUserClick?: (user: User) => void;
}

const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(
  ({ user, variant = "default", showActions = true, onUserClick }, ref) => {
    const [isFollowing, setIsFollowing] = useState(user?.is_following || false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsFollowing(!isFollowing);
        setIsLoading(false);
      }, 500);
    };

    const handleMessage = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("Message user:", user.username);
    };

    const handleCardClick = () => {
      if (onUserClick) {
        onUserClick(user);
      } else {
        redirect(`/profile/${user.id}`);
      }
    };

    if (variant === "compact") {
      return (
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={handleCardClick}
        >
          <UserAvatar
            className=""
            image={user.avatar ?? undefined}
            loading={!user}
            name={user.name ?? undefined}
            ringed
            size={"md"}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">@{user.username}</p>
          </div>
          {showActions && (
            <Button
              size="sm"
              variant={isFollowing ? "outline" : "default"}
              onClick={handleFollow}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isFollowing ? (
                <UserCheck className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          )}
        </motion.div>
      );
    }

    if (variant === "suggestion") {
      return (
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.02 }}
          className="p-3 rounded-lg border hover:shadow-md cursor-pointer transition-all"
          onClick={handleCardClick}
        >
          <div className="flex items-start gap-2">
            <UserAvatar
              className=""
              image={user.avatar ?? undefined}
              loading={!user}
              name={user.name ?? undefined}
              ringed
              size={"sm"}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-600 truncate">@{user.username}</p>
              {/* {user.mutualFriends && user.mutualFriends > 0 && (
              <p className="text-xs text-gray-500 mt-1 whitespace-nowrap truncate">
                {user.mutualFriends} mutual friends
              </p>
            )} */}
            </div>
            <div className="flex gap-1 mt-2 justify-end">
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollow}
                disabled={isLoading}
                className="text-xs h-7"
              >
                {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </motion.div>
      );
    }

    // Default and detailed variants
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={handleCardClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <UserAvatar
                className=""
                image={user.avatar ?? undefined}
                loading={!user}
                name={user.name ?? undefined}
                ringed
                size={"md"}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base truncate">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 text-sm truncate">
                      @{user.username}
                    </p>

                    {/* {user.bio && variant === "detailed" && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {user.bio}
                    </p>
                  )} */}
                    {/* 
                  {user.location && variant === "detailed" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {user.location}
                    </p>
                  )} */}
                  </div>

                  {showActions && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {/* {user.mutualFriends && user.mutualFriends > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {user.mutualFriends} mutual
                  </Badge>
                )} */}

                  {/* {user?.wavelength && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      user.wavelength >= 70
                        ? "border-green-500 text-green-700"
                        : user.wavelength >= 40
                        ? "border-yellow-500 text-yellow-700"
                        : "border-gray-500 text-gray-700"
                    }`}
                  >
                    {user.wavelength}% wavelength
                  </Badge>
                )} */}
                </div>

                {showActions && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      icon={isFollowing ? UserCheck : UserPlus}
                      iconPlacement="left"
                      variant={isFollowing ? "outline" : "default"}
                      onClick={handleFollow}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : isFollowing ? (
                        <>Following</>
                      ) : (
                        <>Follow</>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      icon={MessageCircle}
                      iconPlacement="left"
                      onClick={handleMessage}
                      className="flex-1"
                    >
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);
UserCard.displayName = "UserCard";

interface UserCardLoadingProps {
  variant?: "default" | "suggestion" | "compact" | "detailed";
}

export const UserCardLoading = ({
  variant = "default",
}: UserCardLoadingProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    );
  }

  if (variant === "suggestion") {
    return (
      <div className="p-3 rounded-lg border">
        <div className="flex items-start gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserCard;
