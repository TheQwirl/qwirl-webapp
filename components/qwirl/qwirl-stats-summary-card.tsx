import React from "react";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Timer, RefreshCw } from "lucide-react";

function formatNumber(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return new Intl.NumberFormat().format(n);
}

function formatPercent(p: number | null | undefined) {
  if (p === null || p === undefined || Number.isNaN(p)) return "-";
  // Accept either 0-1 or 0-100 inputs
  const value = p <= 1 ? p * 100 : p;
  return `${value.toFixed(1)}%`;
}

type Orientation = "default" | "vertical";
type Variant = "simple" | "complex";

interface QwirlStatsSummaryCardProps {
  orientation?: Orientation;
  variant?: Variant;
  showTitle?: boolean;
  title?: string;
}

const QwirlStatsSummaryCard: React.FC<QwirlStatsSummaryCardProps> = ({
  orientation = "default",
  variant = "simple",
  showTitle = true,
  title = "Your Qwirl Activity",
}) => {
  const { user } = authStore();

  const hasPrimary = !!user?.primary_qwirl_id;

  const qwirlStatsQuery = $api.useQuery(
    "get",
    "/qwirl-responses/qwirls/{qwirl_id}/stats",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    {
      enabled: hasPrimary,
    }
  );

  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } =
    qwirlStatsQuery;

  if (!hasPrimary) {
    return (
      <div>
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Set a primary Qwirl to see your engagement and response insights here.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
        <p className="text-sm text-destructive">
          Failed to load summary. Please try again.
        </p>
      </div>
    );
  }

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null;

  const allTiles = [
    {
      key: "completed_sessions",
      label: "People Completed",
      value: data?.completed_sessions,
      icon: CheckCircle2,
      priority: "high" as const,
      isPercentage: false,
    },
    {
      key: "in_progress_sessions",
      label:
        data?.in_progress_sessions === 1
          ? "Person Answering"
          : "People Answering",
      value: data?.in_progress_sessions,
      icon: Timer,
      priority: "high" as const,
      isPercentage: false,
    },
  ] as const;

  const displayTiles =
    variant === "simple"
      ? allTiles.filter((tile) => tile.priority === "high")
      : allTiles;

  const renderStatTile = (tile: (typeof allTiles)[number]) => {
    const formattedValue = tile.isPercentage
      ? formatPercent(tile.value)
      : formatNumber(tile.value);

    if (orientation === "vertical") {
      return (
        <div
          key={tile.key}
          className="flex items-center gap-3 p-3 rounded-lg bg-card border"
        >
          <div className="rounded-md bg-muted p-2 flex-shrink-0">
            <tile.icon className="h-4 w-4 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">
              {formattedValue}
            </div>
            <div className="text-xs text-muted-foreground">{tile.label}</div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={tile.key}
        className="flex flex-col justify-center items-center gap-2 p-3 rounded-lg bg-card border"
      >
        <div className="rounded-md bg-muted p-2">
          <tile.icon className="h-4 w-4 text-foreground" />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold" aria-live="polite">
            {formattedValue}
          </div>
          <div className="text-xs text-muted-foreground">{tile.label}</div>
        </div>
      </div>
    );
  };

  const getGridClass = () => {
    if (orientation === "vertical") {
      return "space-y-3";
    }

    // With only 2 stats, use a simple 2-column layout
    return "grid grid-cols-2 gap-4";
  };

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated}
              </span>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Refresh"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      <div className={getGridClass()}>{displayTiles.map(renderStatTile)}</div>

      {!showTitle && (
        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated}
            </span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Refresh"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default QwirlStatsSummaryCard;
