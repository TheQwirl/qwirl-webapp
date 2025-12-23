"use client";

import React, { useEffect, useMemo, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityRow from "./activity-row";
import EmptyState from "./empty-state";
import { ChevronDown, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { components } from "@/lib/api/v1-client-side";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
};

export default function RecentActivitiesList({ className }: Props) {
  const { user } = authStore();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/activities/me/recent-activity",
      {
        params: {
          query: {
            limit: 10,
            type: "all",
            skip: 0,
          },
        },
      },
      {
        enabled: !!user?.id,
        initialPageParam: 0,
        pageParamName: "skip",
        getNextPageParam: (
          lastPage: components["schemas"]["ActivityListResponse"],
          allPages: components["schemas"]["ActivityListResponse"][]
        ) => {
          const currentCount = allPages.reduce(
            (sum, page) => sum + (page.activities?.length || 0),
            0
          );
          if (currentCount >= (lastPage.total_count || 0)) return undefined;
          return currentCount;
        },
      }
    );

  const observer = useRef<IntersectionObserver | null>(null);
  const canAutoPage = !isLoading && hasNextPage && !isFetchingNextPage;

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries?.[0]?.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
            fetchNextPage();
          }
        },
        {
          // Slightly prefetch before the user hits the bottom.
          rootMargin: "160px 0px 240px 0px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  const activities = data?.pages.flatMap((page) => page.activities) ?? [];
  const totalCount = data?.pages?.[0]?.total_count ?? 0;
  const loadedCount = activities.length;
  const hasItems = loadedCount > 0;

  const subtitle = useMemo(() => {
    if (isLoading) return "Loading your feed…";
    if (!hasItems) return "Your most recent responses and interactions.";
    if (totalCount > 0)
      return `${Math.min(loadedCount, totalCount)} of ${totalCount}`;
    return `${loadedCount} loaded`;
  }, [isLoading, hasItems, loadedCount, totalCount]);

  return (
    <Card className={cn("rounded-3xl backdrop-blur-sm", className)}>
      <CardHeader className="sticky top-0 z-10 shrink-0 border-b border-border/40  flex flex-col gap-2 space-y-0 p-4 sm:flex-row sm:items-center sm:justify-between ">
        <div>
          <CardTitle className="text-sm font-semibold">
            Latest Activity
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-4 pt-0 sm:p-6 sm:pt-0">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : hasItems ? (
          <ScrollArea className="h-[420px] no-scrollbar">
            <div className="space-y-3 px-1 py-2 pt-4">
              {activities.map((activity) => (
                <div key={activity.id}>
                  <ActivityRow activity={activity} />
                </div>
              ))}
              {/* Scroll hint + auto paging sentinel */}
              {hasNextPage ? (
                <div className="pt-2">
                  <div
                    ref={sentinelRef}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border/50 bg-background/60 px-4 py-3 text-xs text-muted-foreground"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more activity…
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Scroll for more
                      </>
                    )}
                  </div>

                  {/* Manual fallback in case IntersectionObserver is blocked (rare but real). */}
                  {!isFetchingNextPage ? (
                    <div className="mt-3 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canAutoPage}
                        onClick={() => fetchNextPage()}
                      >
                        Load more
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="pt-2 text-center text-xs text-muted-foreground">
                  You’re all caught up.
                </div>
              )}

              {isFetchingNextPage && (
                <div className="space-y-3 mt-3">
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/40 p-6 text-center min-h-[200px]">
            <EmptyState
              icon={Users}
              title="No activity yet"
              description="Share your Qwirl to invite your first responses."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
