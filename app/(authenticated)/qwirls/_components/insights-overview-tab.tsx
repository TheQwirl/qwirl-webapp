"use client";
import React, { useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { XCircle, Users } from "lucide-react";
import { ResponderLoadingSkeleton } from "./responder-loading-skeleton";
import { ResponderCard } from "./responder-card";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";

type ResponderData = {
  id: number;
  name: string | null;
  username: string;
  avatar: string | null;
  session_id: number;
  status: string;
  started_at: string;
  completed_at?: string | null | undefined;
  response_count: number;
  wavelength: number;
};

type SortByOption = "wavelength" | "started_at";

interface InsightsOverviewTabProps {
  responders: ResponderData[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refetch: () => void;
  fetchNextPage: () => void;
  onResponderClick: (responderId: number) => void;
  sortBy: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

export const InsightsOverviewTab: React.FC<InsightsOverviewTabProps> = ({
  responders,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  refetch,
  fetchNextPage,
  onResponderClick,
  sortBy,
  onSortChange,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { user } = authStore();
  const lastResponderElementRef = useCallback(
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

  const totalQwirlPollsQuery = $api.useQuery(
    "get",
    "/qwirl/{qwirl_id}/items/count",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center flex-1 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Label
              htmlFor="sort-select"
              className="text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Sort by:
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger id="sort-select" className="w-full sm:w-[230px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wavelength">Highest Wavelength</SelectItem>
                <SelectItem value="started_at">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
            <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
              Failed to Load Responses
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              An error occurred while loading responder data.
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ResponderLoadingSkeleton key={index} index={index} />
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {responders && responders.length > 0 ? (
            <>
              {responders.map((responder, index) => {
                const isLastElement = responders.length === index + 1;
                return (
                  <div
                    key={responder.id}
                    ref={isLastElement ? lastResponderElementRef : null}
                  >
                    <ResponderCard
                      responder={responder}
                      index={index}
                      total_qwirl_polls={
                        totalQwirlPollsQuery?.data?.total_items || 0
                      }
                      onClick={() => onResponderClick(responder.id)}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <Empty className="border-dashed border-2">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users />
                </EmptyMedia>
                <EmptyTitle>No responders yet</EmptyTitle>
                <EmptyDescription>
                  No one has answered your Qwirl yet. Share your Qwirl to invite
                  answers.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      )}

      {/* Loading More State */}
      {isFetchingNextPage && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ResponderLoadingSkeleton key={i} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};
