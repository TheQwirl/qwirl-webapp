import React, { useCallback, useEffect, useRef } from "react";
import { Compass, Handshake, RefreshCw, Share2 } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import $api from "@/lib/api/client";

import ConnectionCard, { ConnectionCardSkeleton } from "./connection-card";
import ConnectionCtaCard from "./connection-cta-card";
import { shareOrCopy } from "@/lib/utils";
import { authStore } from "@/stores/useAuthStore";
import { components } from "@/lib/api/v1-client-side";
import { Skeleton } from "@/components/ui/skeleton";

const MIN_GRID_ITEMS = 2;
const GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const PAGE_SIZE = 10;

const TheyReachedOutTab = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = $api.useInfiniteQuery(
    "get",
    "/user_follows/followers",
    {
      params: {
        query: {
          limit: PAGE_SIZE,
          skip: 0,
        },
      },
    },
    {
      initialPageParam: 0,
      pageParamName: "skip",
      getNextPageParam: (
        lastPage: components["schemas"]["UserFollowerResponse"][],
        allPages: { data: components["schemas"]["UserFollowerResponse"][] }[]
      ) => {
        if (!lastPage || lastPage.length < PAGE_SIZE) {
          return undefined;
        }
        return allPages.flat().length;
      },
    }
  );

  const { user } = authStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const connections = data?.pages.flatMap((page) => page ?? []) ?? [];
  const fillerCount = Math.max(0, MIN_GRID_ITEMS - connections.length);

  const lastConnectionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="space-y-6 h-full">
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-full" />
          <div className={GRID_CLASS}>
            {Array.from({ length: MIN_GRID_ITEMS }).map((_, index) => (
              <ConnectionCardSkeleton key={`sync-skeleton-${index}`} />
            ))}
          </div>
        </>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center space-y-3">
          <h3 className="text-lg font-semibold text-destructive">
            Couldn&apos;t fetch reach-outs
          </h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while checking who reached out."}
          </p>
          <Button
            variant="outline"
            onClick={() => refetch?.()}
            iconPlacement="left"
            icon={RefreshCw}
            className=""
          >
            Retry
          </Button>
        </div>
      ) : !connections.length ? (
        <Empty className="border border-dashed bg-muted/20 h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Compass className="h-5 w-5" />
            </EmptyMedia>
            <EmptyTitle>You haven&apos;t had anyone reach out yet.</EmptyTitle>
            <EmptyDescription>
              Share your qwirl to have others reach out to you.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex w-full flex-wrap justify-center gap-3">
              <Button
                onClick={() =>
                  shareOrCopy(
                    `${window.location.origin}/qwirl/${user?.username}`
                  )
                }
                icon={Share2}
                iconPlacement="left"
                className=" min-w-[140px] w-fit"
              >
                Share Qwirl
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <p className="text-sm">
            These are all your connections that have <b>reached out</b>: they
            have have answered your qwirl and are waiting for your response.
          </p>
          <div className={GRID_CLASS}>
            {connections.map((connection, index) => {
              const isLast = connections.length === index + 1;
              return (
                <div
                  key={connection.id}
                  ref={isLast ? lastConnectionRef : undefined}
                >
                  <ConnectionCard
                    variant="they-reached-out"
                    connection={connection}
                  />
                </div>
              );
            })}
            {Array.from({ length: fillerCount }).map((_, index) => (
              <ConnectionCtaCard
                key={`reached-cta-${index}`}
                title="Reply to invitations"
                description="Give pending qwirls a thoughtful answer to complete the sync."
                actionLabel="Review pending qwirls"
                actionHref="/home"
                icon={Handshake}
                badgeText="Finish the sync"
              />
            ))}
          </div>
          {isFetchingNextPage && (
            <div className={GRID_CLASS}>
              {Array.from({ length: MIN_GRID_ITEMS }).map((_, index) => (
                <ConnectionCardSkeleton key={`reached-fetch-${index}`} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default TheyReachedOutTab;
