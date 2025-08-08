import React, { useCallback, useRef, useState } from "react";
import UserCard, { UserCardLoading } from "../user-card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import $api from "@/lib/api/client";
import Empty from "../empty";
import Image from "next/image";
import { components } from "@/lib/api/v1";
import { MyUser, OtherUser } from "./types";
import { useProfileStore } from "@/stores/profile-store";
import { authStore } from "@/stores/useAuthStore";

type User = {
  id: number;
  username: string;
  name: string | null;
  avatar: string | null;
  wavelength: number;
  is_following: boolean;
};

type Users = components["schemas"]["UserFollowerResponse"][];

export default function PeoplesTab() {
  const [activeTab, setActiveTab] = useState("friends");

  const { user } = useProfileStore();

  return (
    <div className="">
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {activeTab === "friends" && (
        <UserList endpointKey="friends" user={user} />
      )}
      {activeTab === "following" && (
        <UserList endpointKey="following" user={user} />
      )}
      {activeTab === "followers" && (
        <UserList endpointKey="followers" user={user} />
      )}
    </div>
  );
}

const tabToEndpoints = {
  friends: "/user_follows/{user_id}/friends",
  following: "/user_follows/{user_id}/following",
  followers: "/user_follows/{user_id}/followers",
} as const;

const LIMIT = 10;
export const UserList = ({
  endpointKey,
  user,
}: {
  endpointKey: keyof typeof tabToEndpoints;
  user: MyUser | OtherUser | undefined;
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const endpoint = tabToEndpoints[endpointKey];
  const { user: loggedInUser } = authStore();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      endpoint,
      {
        params: {
          path: { user_id: user?.id ?? 1 },
          query: { limit: LIMIT, skip: 0 },
        },
      },
      {
        initialPageParam: 0,
        pageParamName: "skip",
        getNextPageParam: (lastPage: Users, allPages: { data: Users }[]) => {
          if (lastPage?.length < 10) {
            return undefined;
          }
          return allPages.flat().length;
        },
      }
    );

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const users: User[] = data?.pages.flatMap((page) => page || []) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <UserCardLoading key={index} variant="detailed" />
        ))}
      </div>
    );
  }

  if (users?.length === 0 && !isLoading) {
    return (
      <Empty
        title="No Users Found"
        containerClassName="min-h-[300px]"
        imageClassName="w-32 h-32"
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {users.map((u, index) => {
        return (
          <UserCard
            ref={index === users.length - 1 ? lastElementRef : null}
            key={`${u.id}-${index}`}
            user={u}
            variant="detailed"
            showActions={u?.id !== loggedInUser?.id}
          />
        );
      })}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Image
            src="/assets/loader.svg"
            alt="Loading"
            width={20}
            height={20}
          />
        </div>
      )}
    </div>
  );
};
