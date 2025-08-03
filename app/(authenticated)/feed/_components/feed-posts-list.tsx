"use client";
import React, { useCallback, useRef } from "react";
import { FeedTab } from "./type";
import $api, { fetchClient } from "@/lib/api/client";
import {
  InfiniteData,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { components } from "@/lib/api/v1-client-side";
import { toast } from "sonner";
import PostComponent, {
  PostComponentLoading,
} from "@/components/posts/post-component";
import Empty from "@/components/empty";

interface FeedPostsListProps {
  tab: FeedTab;
}

type Post = components["schemas"]["FeedBase"];

const FeedPostsList = ({}: FeedPostsListProps) => {
  const queryClient = useQueryClient();

  const getFeed = useCallback((cursor?: string | null) => {
    const params = {
      query: {
        limit: 10,
        ...(cursor && { cursor }),
      },
    };
    return fetchClient.GET("/feed/feed", { params });
  }, []);

  const queryKey = React.useMemo(() => ["feed"], []);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => getFeed(pageParam),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.data || lastPage.data.length < 10) {
          return undefined;
        }
        return lastPage.data[lastPage.data.length - 1]?.id;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    });

  const posts = data?.pages?.flatMap((page) => page?.data || []) ?? [];

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        },
        { rootMargin: "100px" } // Load next page 100px before reaching the end
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const updatePostInCache = useCallback(
    (postId: string, updater: (post: Post) => Post) => {
      queryClient.setQueryData<InfiniteData<{ data: Post[] }>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data?.map((post) =>
                post.id === postId ? updater(post) : post
              ),
            })),
          };
        }
      );
    },
    [queryClient, queryKey]
  );
  const likeMutation = $api.useMutation("post", "/post/{post_id}/like", {
    onMutate: async (variables) => {
      const postId = variables.params.path.post_id;
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      updatePostInCache(postId, (post) => ({
        ...post,
        is_liked: true,
        likes_count: post.likes_count + (post.is_liked ? 0 : 1),
      }));

      return { previousData, postId };
    },
    onError: (err, variables, context) => {
      if ((context as { previousData: unknown })?.previousData) {
        queryClient.setQueryData(
          queryKey,
          (context as { previousData: unknown }).previousData
        );
      }
      toast.error("Failed to like post. Please try again.", {
        id: "like-post-error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const unlikeMutation = $api.useMutation("delete", "/post/{post_id}/like", {
    onMutate: async (variables) => {
      const postId = variables.params.path.post_id;
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      updatePostInCache(postId, (post) => ({
        ...post,
        is_liked: false,
        likes_count: post.likes_count - (post.is_liked ? 1 : 0),
      }));

      return { previousData, postId };
    },
    onError: (err, variables, context) => {
      toast.error("Failed to unlike post. Please try again.", {
        id: "unlike-post-error",
      });
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

  // Vote mutation with optimistic updates
  const voteMutation = $api.useMutation("post", "/post/{post_id}/vote", {
    onMutate: async (variables) => {
      const postId = variables.params.path.post_id;
      const selectedOptionId = variables.body.poll_option_id;

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      updatePostInCache(postId, (post) => ({
        ...post,
        my_selected_option_index: post?.options?.findIndex(
          (element) => element.option_id === selectedOptionId
        ),
        results: post.results?.map((result) => ({
          ...result,
          vote_count:
            result.option_id === selectedOptionId
              ? (result?.vote_count ?? 0) + 1
              : result.vote_count ?? 0,
        })),
      }));

      return { previousData, postId };
    },
    onError: (err, variables, context) => {
      if ((context as { previousData: unknown })?.previousData) {
        queryClient.setQueryData(
          queryKey,
          (context as { previousData: unknown }).previousData
        );
        toast.error("Failed to submit vote. Please try again.", {
          id: `vote-error-${variables.params.path.post_id}`,
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Event handlers
  const handleLike = useCallback(
    (postId: string, isCurrentlyLiked: boolean) => {
      if (isCurrentlyLiked) {
        unlikeMutation.mutate({
          params: { path: { post_id: postId } },
        });
      } else {
        likeMutation.mutate({
          params: { path: { post_id: postId } },
        });
      }
    },
    [likeMutation, unlikeMutation]
  );

  const handleVote = useCallback(
    (postId: string, optionId: number) => {
      voteMutation.mutate({
        params: { path: { post_id: postId } },
        body: { poll_option_id: optionId },
      });
    },
    [voteMutation]
  );

  if (posts?.length === 0) {
    return (
      <Empty
        title="Nothing to show in the feed yet."
        description="Try following some users or creating your own posts."
        containerClassName="min-h-[300px]"
      />
    );
  }

  return (
    <div className="pt-4 pb-6 space-y-4">
      {posts.map((post, index) => {
        if (!post) return null;

        return (
          <PostComponent
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : undefined}
            user={post.userdata}
            post={post}
            onLike={handleLike}
            onOptionSelect={handleVote}
          />
        );
      })}

      {isFetchingNextPage && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">
            Loading more posts...
          </p>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            You have way too much time on your hands! No more posts to show.
          </p>
        </div>
      )}
    </div>
  );
};

export const FeedPostsLoading = () => {
  return (
    <div className="pt-4 pb-6 space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostComponentLoading key={index} />
      ))}
    </div>
  );
};

export default FeedPostsList;
