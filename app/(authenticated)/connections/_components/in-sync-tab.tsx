import React, { useCallback, useEffect, useRef } from "react";
import { Compass, RefreshCw, Share2 } from "lucide-react";
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
import { shareOrCopy } from "@/lib/utils";
import { authStore } from "@/stores/useAuthStore";
import { components } from "@/lib/api/v1-client-side";
import { Skeleton } from "@/components/ui/skeleton";

const MIN_GRID_ITEMS = 2;
const GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const PAGE_SIZE = 10;

const InSyncTab = () => {
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
    "/user_follows/friends",
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
            Unable to load synced connections
          </h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while fetching your synced wavelength list."}
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
            <EmptyTitle>No Synced Wavelengths yet.</EmptyTitle>
            <EmptyDescription>
              Wavelengths are synced when both you and another user have
              answered each other&apos;s qwirls. Share your qwirl to start
              syncing wavelengths with others.
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
            These are all your connections that have <b>synced wavelengths</b>:
            both you and the other user have answered each other&apos;s qwirls.
          </p>
          <div className={GRID_CLASS}>
            {connections.map((connection, index) => {
              const isLast = connections.length === index + 1;
              return (
                <div
                  key={connection.id}
                  ref={isLast ? lastConnectionRef : undefined}
                >
                  <ConnectionCard variant="in-sync" connection={connection} />
                </div>
              );
            })}
          </div>
          {isFetchingNextPage && (
            <div className={GRID_CLASS}>
              {Array.from({ length: MIN_GRID_ITEMS }).map((_, index) => (
                <ConnectionCardSkeleton key={`sync-fetch-${index}`} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default InSyncTab;
