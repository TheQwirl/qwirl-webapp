import React, { useCallback, useRef, useState } from "react";
import UserCard, { UserCardLoading } from "../user-card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import $api from "@/lib/api/client";
import Empty from "../empty";
import Image from "next/image";
import { components } from "@/lib/api/v1";

type User = {
  id: number;
  username: string;
  name: string | null;
  avatar: string | null;
  wavelength: number;
  is_following: boolean;
};

interface PeoplesTabProps {
  user:
    | components["schemas"]["UserResponse"]
    | components["schemas"]["UserWithRelationshipResponse"];
}

export default function PeoplesTab({ user }: PeoplesTabProps) {
  const [activeTab, setActiveTab] = useState("friends");
  console.log(user);

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
      {/* {activeTab === "followers" && <UserList endpointKey="followers" />} */}
    </div>
  );
}

const tabToEndpoints = {
  friends: "/user_follows/{user_id}/friends",
  following: "/user_follows/{user_id}/following",
  // followers: "/users/{user_id}/followers",
} as const;
export const UserList = ({
  endpointKey,
  user,
}: {
  endpointKey: keyof typeof tabToEndpoints;
  user:
    | components["schemas"]["UserResponse"]
    | components["schemas"]["UserWithRelationshipResponse"];
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const limit = 10;
  const endpoint = tabToEndpoints[endpointKey];
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      endpoint,
      {
        params: { path: { user_id: user?.id ?? 1 }, query: { limit } },
      },
      {
        initialPageParam: 0,
        getNextPageParam: (
          lastPage: {
            data: User[];
            nextPage?: number;
          }
          // allPages: {
          //   data: User[];
          //   nextPage?: number;
          // }[]
        ) => lastPage.nextPage,
        enabled: !!user?.id,
      }
    );
  console.log(data);

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

  if (users.length === 0 && !isLoading) {
    return (
      <Empty
        title="No Users Found"
        containerClassName="min-h-[300px]"
        imageClassName="w-32 h-32"
      />
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <UserCard
          ref={index === users.length - 1 ? lastElementRef : null}
          key={`${user.id}-${index}`}
          user={user}
          variant="detailed"
        />
      ))}
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
// const UserFollowers = () => {
//   const { user } = authStore();
//   const userFollowersQuery = $api.useQuery(
//     "get",
//     "/user_follows/{user_id}/following",
//     {
//       params: {
//         path: {
//           user_id: user?.id ?? 1,
//         },
//         query: {
//           limit: 10,
//           skip: 0,
//         },
//       },
//     },
//     {
//       enabled: !!user?.id,
//     }
//   );

//   if (userFollowersQuery?.isLoading) {
//     return (
//       <div className="space-y-4">
//         {[1, 2, 3].map((index) => (
//           <UserCardLoading key={index} variant="detailed" />
//         ))}
//       </div>
//     );
//   }

//   if (!userFollowersQuery?.data?.length) {
//     return (
//       <Empty
//         title="No Users Found"
//         containerClassName="min-h-[300px]"
//         imageClassName="w-32 h-32"
//       />
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {userFollowersQuery?.data?.map((user, index) => (
//         <UserCard key={index} user={user} variant="detailed" />
//       ))}
//     </div>
//   );
// };

// const UserFriends = () => {
//   const { user } = authStore();
//   const userFriendsQuery = $api.useQuery(
//     "get",
//     "/user_follows/{user_id}/friends",
//     {
//       params: {
//         path: {
//           user_id: user?.id ?? 1,
//         },
//         query: {
//           limit: 10,
//           skip: 0,
//         },
//       },
//     },
//     {
//       enabled: !!user?.id,
//     }
//   );

//   if (userFriendsQuery?.isLoading) {
//     return (
//       <div className="space-y-4">
//         {[1, 2, 3].map((index) => (
//           <UserCardLoading key={index} variant="detailed" />
//         ))}
//       </div>
//     );
//   }
//   if (!userFriendsQuery?.data?.length) {
//     return (
//       <Empty
//         title="No Users Found"
//         containerClassName="min-h-[300px]"
//         imageClassName="w-32 h-32"
//       />
//     );
//   }
//   return (
//     <div className="space-y-4">
//       {userFriendsQuery?.data?.map((user, index) => (
//         <UserCard key={index} user={user} variant="detailed" />
//       ))}
//     </div>
//   );
// };

// const UserFollowing = () => {
//   return (
//     <Empty
//       title="No Users Found"
//       containerClassName="min-h-[300px]"
//       imageClassName="w-32 h-32"
//     />
//   );
//   // const { user } = authStore();
//   // const userFollowingQuery = $api.useQuery(
//   //   "get",
//   //   "/users/{user_id}/following",
//   //   {
//   //     params: {
//   //       path: {
//   //         user_id: user?.id ?? 1,
//   //       },
//   //       query: {
//   //         limit: 10,
//   //         skip: 0,
//   //       },
//   //     },
//   //   },
//   //   {
//   //     enabled: !!user?.id,
//   //   }
//   // );

//   // if (userFollowingQuery?.isLoading) {
//   //   return (
//   //     <div className="space-y-4">
//   //       {[1, 2, 3].map((index) => (
//   //         <UserCardLoading key={index} variant="detailed" />
//   //       ))}
//   //     </div>
//   //   );
//   // }

//   // if (!userFollowingQuery?.data?.length) {
//   //   return (
//   //     <Empty
//   //       title="No Users Found"
//   //       containerClassName="min-h-[300px]"
//   //       imageClassName="w-32 h-32"
//   //     />
//   //   );
//   // }
//   // return (
//   //   <div className="space-y-4">
//   //     {userFollowingQuery?.data?.map((user, index) => (
//   //       <UserCard key={index} user={user} variant="detailed" />
//   //     ))}
//   //   </div>
//   // );
// };
