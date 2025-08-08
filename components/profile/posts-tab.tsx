import React, { useCallback, useMemo, useRef } from "react";
import Empty from "../empty";
import $api, { fetchClient } from "@/lib/api/client";
import PostComponent, { PostComponentLoading } from "../posts/post-component";
import { toast } from "sonner";
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { components } from "@/lib/api/v1-client-side";
import { useProfileStore } from "@/stores/profile-store";

type Post = components["schemas"]["PostFetchByID"];

const PostsTab = () => {
  const { user } = useProfileStore();

  const queryKey = useMemo(() => ["posts", user?.id], [user?.id]);

  const getUserPosts = useCallback(
    (skip?: number) => {
      return fetchClient.GET("/post/user/{post_owner_id}", {
        params: {
          path: {
            post_owner_id: user?.id ?? 1,
          },
          query: {
            limit: 10,
            skip,
          },
        },
      });
    },
    [user?.id]
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery({
      initialPageParam: 0,
      queryKey: ["posts", user?.id],
      queryFn: ({ pageParam }) => getUserPosts(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage?.data?.length && lastPage?.data?.length < 10) {
          return undefined;
        }
        return allPages?.flat()?.map((page) => page.data)?.length ?? 0;
      },
    });

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

  const posts = data?.pages?.flatMap((page) => page?.data || []);
  const queryClient = useQueryClient();
  const updatePostCache = (postId: string, isLiked: boolean) => {
    queryClient.setQueryData<InfiniteData<{ data: Post[] }>>(
      queryKey,
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
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
            ),
          })),
        };
      }
    );
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
      queryClient.setQueryData<InfiniteData<{ data: Post[] }>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((post) => {
                if (post.id !== postId) return post;

                return {
                  ...post,
                  my_selected_option_index: variables.body.poll_option_id,
                  results: post.results?.map((result) => ({
                    ...result,
                    vote_count:
                      result.option_id === variables.body.poll_option_id
                        ? (result?.vote_count ?? 0) + 1
                        : result.vote_count ?? 0,
                  })),
                };
              }),
            })),
          };
        }
      );
      return { previousData };
    },
    onError: (err, variables, context) => {
      toast.error("An error occurred while voting the post");
      console.error("Vote error:", err);
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

  const handleVote = useCallback(
    (postId: string, optionId: number) => {
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
    },
    [voteMutation]
  );

  const handleLike = useCallback(
    (postId: string, isCurrentlyLiked: boolean) => {
      const mutationFn = isCurrentlyLiked ? deleteLikeMutation : likeMutation;
      mutationFn.mutate({
        params: {
          path: {
            post_id: postId,
          },
        },
      });
    },
    [likeMutation, deleteLikeMutation]
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

export const PostsTabLoading = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostComponentLoading key={index} />
      ))}
    </div>
  );
};

export default PostsTab;
