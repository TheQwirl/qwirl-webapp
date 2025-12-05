"use client";

import React, { useRef, useCallback } from "react";
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
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { components } from "@/lib/api/v1-client-side";

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
  const lastActivityElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const activities = data?.pages.flatMap((page) => page.activities) ?? [];

  return (
    <Card className={cn("rounded-3xl backdrop-blur-sm", className)}>
      <CardHeader className="shrink-0 flex flex-col gap-2 space-y-0 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <CardTitle className="text-sm font-semibold">
            Latest Activity
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Your most recent responses and interactions.
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
        ) : activities.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const isLast = index === activities.length - 1;
                return (
                  <div
                    key={activity.id}
                    ref={isLast ? lastActivityElementRef : null}
                  >
                    <ActivityRow activity={activity} />
                  </div>
                );
              })}
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
