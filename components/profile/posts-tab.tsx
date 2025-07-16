import React, { useCallback, useRef } from "react";
import Empty from "../empty";
import $api from "@/lib/api/client";
import Loader from "../loader";
import PostComponent from "../posts/post-component";
import { toast } from "sonner";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { TabItemProp } from "./types";
import { components } from "@/lib/api/v1-client-side";

type Post = components["schemas"]["PostFetchByID"];

const PostsTab = ({ user }: TabItemProp) => {
  const queryKey = [
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
  ];

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

  const posts = data?.pages?.flatMap((page) => page?.flat()) ?? [];
  const queryClient = useQueryClient();
  const updatePostCache = (postId: string, isLiked: boolean) => {
    queryClient.setQueryData<InfiniteData<Post[]>>(queryKey, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  is_liked: isLiked,
                  likes_count:
                    post.likes_count +
                    (isLiked && !post.is_liked ? 1 : 0) -
                    (!isLiked && post.is_liked ? 1 : 0),
                }
              : post
          )
        ),
      };
    });
  };

  const likeMutation = $api.useMutation("post", "/post/{post_id}/like", {
    onMutate: async (variables) => {
      const postId = variables.params.path.post_id;
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      updatePostCache(postId, true);
      return { previousData };
    },
    onError: (err, variables, context) => {
      toast.error("An error occurred while liking the post");
      if ((context as { previousData: unknown })?.previousData) {
        queryClient.setQueryData(
          queryKey,
          (context as { previousData: unknown }).previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteLikeMutation = $api.useMutation(
    "delete",
    "/post/{post_id}/like",
    {
      onMutate: async (variables) => {
        const postId = variables.params.path.post_id;
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData(queryKey);
        updatePostCache(postId, false);
        return { previousData };
      },
      onError: (err, variables, context) => {
        toast.error("An error occurred while unliking the post");
        if ((context as { previousData: unknown })?.previousData) {
          queryClient.setQueryData(
            queryKey,
            (context as { previousData: unknown }).previousData
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }
  );

  const voteMutation = $api.useMutation("post", "/post/{post_id}/vote", {
    onMutate: async (variables) => {
      const postId = variables.params.path.post_id;
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<InfiniteData<Post[]>>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    my_selected_option_index: post?.options?.findIndex(
                      (element) =>
                        element.option_id === variables.body.poll_option_id
                    ),
                    results: post.results?.map((result) => ({
                      ...result,
                      vote_count:
                        result.option_id === variables.body.poll_option_id
                          ? (result?.vote_count ?? 0) + 1
                          : result.vote_count ?? 0,
                    })),
                  }
                : post
            )
          ),
        };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      toast.error("An error occurred while voting the post");
      if ((context as { previousData: unknown })?.previousData) {
        queryClient.setQueryData(
          queryKey,
          (context as { previousData: unknown }).previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleVote = (postId: string, optionId: number) => {
    voteMutation.mutate({
      params: {
        path: {
          post_id: postId,
        },
      },
      body: {
        poll_option_id: optionId,
      },
    });
  };
  const handleLike = (postId: string, isCurrentlyLiked: boolean) => {
    if (isCurrentlyLiked) {
      deleteLikeMutation.mutate({
        params: {
          path: {
            post_id: postId,
          },
        },
      });
    } else {
      likeMutation.mutate({
        params: {
          path: {
            post_id: postId,
          },
        },
      });
    }
  };

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
          ref={index === posts.length - 1 ? lastQuestionElementRef : undefined}
          user={user}
          post={post}
          onLike={handleLike}
          onOptionSelect={handleVote}
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
