import React, { useCallback, useRef } from "react";
import Empty from "../empty";
import { components } from "@/lib/api/v1";
import $api from "@/lib/api/client";
import Loader from "../loader";
import PostComponent from "../posts/post-component";

interface PostTabProps {
  user:
    | components["schemas"]["UserResponse"]
    | components["schemas"]["UserWithRelationshipResponse"];
}

type ReturnedPost = components["schemas"]["PostFetchByID"];
type Post = {
  results?: Record<string, never>[] | null;
} & ReturnedPost;

const PostsTab = ({ user }: PostTabProps) => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/post/user/{post_owner_id}",
      {
        params: {
          path: {
            post_owner_id: user?.id ?? 1,
          },
          query: {
            limit: 10,
            skip: 0,
          },
        },
      },
      {
        initialPageParam: 0,
        pageParamName: "skip",
        getNextPageParam: (lastPage: Post[], allPages: { data: Post[] }[]) => {
          if (lastPage?.length < 10) {
            return undefined;
          }
          return allPages.flat().length;
        },
      }
    );

  const observer = useRef<IntersectionObserver>(null);
  const lastQuestionElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries?.[0]?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const posts = data?.pages.flatMap((page) => page?.flat()) ?? [];

  if (isLoading)
    return (
      <div className="min-h-[200px] flex flex-col justify-center">
        <Loader description="Loading your posts..." />
      </div>
    );

  if (!posts?.length)
    return (
      <Empty
        title="No posts yet"
        description="Share your thoughts and experiences with the world. Start posting now!"
        containerClassName="min-h-[300px]"
      />
    );
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostComponent
          key={post.id}
          ref={index === posts.length - 1 ? lastQuestionElementRef : null}
          user={user}
          post={post}
        />
      ))}
      {isFetchingNextPage && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-xs text-muted-foreground mt-2">Loading more...</p>
        </div>
      )}
    </div>
  );
};

export default PostsTab;
