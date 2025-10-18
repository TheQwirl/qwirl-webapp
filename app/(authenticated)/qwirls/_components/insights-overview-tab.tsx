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
import { Switch } from "@/components/ui/switch";
import { XCircle, Users } from "lucide-react";
import { ResponderLoadingSkeleton } from "./responder-loading-skeleton";
import { ResponderCard } from "./responder-card";

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

interface InsightsOverviewTabProps {
  responders: ResponderData[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  refetch: () => void;
  fetchNextPage: () => void;
  onResponderClick: (responderId: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showInProgress: boolean;
  onShowInProgressChange: (show: boolean) => void;
}

const EmptyState = () => (
  <div className="w-full">
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No responses yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          When people start responding to your Qwirl, you&apos;ll see their
          cards here. Share your Qwirl to get started!
        </p>
      </CardContent>
    </Card>
  </div>
);

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
  showInProgress,
  onShowInProgressChange,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
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

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/30 p-4 rounded-lg border border-border/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="flex items-center gap-3">
            <Label
              htmlFor="sort-select"
              className="text-sm font-medium whitespace-nowrap"
            >
              Sort by:
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger id="sort-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wavelength">Highest Wavelength</SelectItem>
                <SelectItem value="started_at">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="show-in-progress"
              checked={showInProgress}
              onCheckedChange={onShowInProgressChange}
            />
            <Label
              htmlFor="show-in-progress"
              className="text-sm font-medium cursor-pointer"
            >
              Show in-progress responses
            </Label>
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Failed to Load Responses
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              An error occurred while loading responder data.
            </p>
            <Button onClick={() => refetch()} variant="outline">
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
                      onClick={() => onResponderClick(responder.id)}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <EmptyState />
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
