"use client";
import PageHeader from "@/components/layout/page-header";
import PostCreator from "@/components/posts/post-creator/post-creator";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import { FiClock, FiTrendingUp } from "react-icons/fi";

import React, { useCallback, useRef } from "react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import Loader from "@/components/loader";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PostComponent from "@/components/posts/post-component";
import ProfileSidebar from "@/components/profile/profile-sidebar";

type Post = components["schemas"]["FeedBase"];

const Feed = () => {
  const isMobile = useIsMobile();
  const [tab, setTab] = React.useState<"recent" | "explore">("recent");
  const queryKey = ["get", "/feed/feed", { params: { query: { limit: 10 } } }];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = $api.useInfiniteQuery(
    "get",
    "/feed/feed",
    {
      params: {
        query: {
          limit: 10,
        },
      },
    },
    {
      initialPageParam: null,
      getNextPageParam: (lastPage: Post[]) => {
        if (!lastPage || lastPage.length < 10) {
          return undefined;
        }
        return lastPage[lastPage.length - 1]?.id;
      },
      // queryFn: ({ pageParam }: { pageParam?: string }) => {
      //   const params = {
      //     query: {
      //       limit: 10,
      //       ...(pageParam !== null &&
      //         pageParam !== undefined && { cursor: pageParam }),
      //     },
      //   };

      //   // return $api.query("get", "/feed/feed", { params });
      // },
    }
  );

  const posts = data?.pages?.flatMap((page) => page?.flat()) ?? [];

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
      toast.error("An error occurred while liking the post", {
        id: "like-post-error",
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
        toast.error("An error occurred while unliking the post", {
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

  const handleTabChange = (tab: "recent" | "explore") => {
    setTab(tab);
  };

  return (
    <div className="grid grid-cols-12  sm:mt-0 gap-6">
      <div
        className={clsx(
          "col-span-full lg:col-span-8 flex flex-col h-full",
          isMobile ? "col-span-full " : ""
        )}
      >
        <PageHeader
          pageTitle="Feed"
          pageSubTitle="Check out the latest questions"
          extraContent={
            <div className="flex sm:flex-row flex-col items-center gap-y-1 gap-x-4">
              <button
                onClick={() => handleTabChange("recent")}
                className={clsx(
                  "text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 py-1 rounded",
                  tab === "recent" && "bg-gray-300 text-black"
                )}
              >
                <FiClock size={16} />
                <span className="hidden sm:inline">Recent</span>
              </button>

              <button
                onClick={() => handleTabChange("explore")}
                className={clsx(
                  "text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 py-1 rounded",
                  tab === "explore" && "bg-gray-300 text-black"
                )}
              >
                <FiTrendingUp size={16} />
                <span className="hidden sm:inline">Popular</span>
              </button>
            </div>
          }
        />
        <div className="pt-8">
          <PostCreator />
        </div>
        {isError && (
          <div className="min-h-[200px] flex flex-col justify-center items-center">
            <p className="text-red-500">
              An error occurred while loading the feed.
            </p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="min-h-[200px] flex flex-col justify-center">
            <Loader description="Loading feed..." />
          </div>
        ) : (
          <div className="pt-4 pb-6 space-y-4">
            {posts.map((post, index) => (
              <PostComponent
                key={post.id}
                ref={
                  index === posts.length - 1
                    ? lastQuestionElementRef
                    : undefined
                }
                user={post?.userdata}
                post={post}
                onLike={handleLike}
                onOptionSelect={handleVote}
              />
            ))}
            {isFetchingNextPage && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-xs text-muted-foreground mt-2">
                  Loading more...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="col-span-4">
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default Feed;
