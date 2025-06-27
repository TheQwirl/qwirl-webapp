import React from "react";
import Empty from "../empty";
import { components } from "@/lib/api/v1";

interface PostTabProps {
  user:
    | components["schemas"]["UserResponse"]
    | components["schemas"]["UserWithRelationshipResponse"];
}

const PostsTab = ({ user }: PostTabProps) => {
  console.log("user", user);
  // const userPostsQuery = $api.useQuery(
  //   "get",
  //   "/user_posts/{user_id}/posts",
  //   {
  //     params: {
  //       path: {
  //         user_id: user?.id ?? 1,
  //       },
  //       query: {
  //         limit: 10,
  //         skip: 0,
  //       },
  //     },
  //   },
  //   {
  //     enabled: !!user?.id,
  //   }
  // );

  return (
    <Empty
      title="No posts yet"
      description="Share your thoughts and experiences with the world. Start posting now!"
      containerClassName="min-h-[300px]"
    />
  );
};

export default PostsTab;
