import React from "react";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

function formatNumber(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return new Intl.NumberFormat().format(n);
}

interface QwirlStatsSummaryCardProps {
  showTitle?: boolean;
  title?: string;
}

const QwirlStatsSummaryCard: React.FC<QwirlStatsSummaryCardProps> = () => {
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

  const { data, isLoading, isError, refetch, isFetching } = qwirlStatsQuery;

  if (!hasPrimary) {
    return (
      <div className="text-xs sm:text-sm text-muted-foreground bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50">
        Set a primary Qwirl to see your engagement insights here.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-between bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md flex-shrink-0" />
          <div className="space-y-1 min-w-0">
            <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
            <Skeleton className="h-2 sm:h-3 w-20 sm:w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-between bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50 gap-2">
        <p className="text-xs sm:text-sm text-destructive min-w-0 flex-1">
          Failed to load summary
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          className="h-8 w-8 flex-shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const totalResponders =
    (data?.completed_sessions ?? 0) + (data?.in_progress_sessions ?? 0);

  const totalQuestions = data?.total_items ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="text-xl sm:text-2xl font-bold text-foreground flex-shrink-0">
            {formatNumber(totalResponders)}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground min-w-0">
            {totalResponders === 1 ? "Total Responder" : "Total Responders"}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Refresh"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-8 w-8 flex-shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
      <div className="flex items-center justify-between bg-muted/30 p-3 sm:p-4 rounded-lg border border-border/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="text-xl sm:text-2xl font-bold text-foreground flex-shrink-0">
            {formatNumber(totalQuestions)}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground min-w-0">
            {totalResponders === 1 ? "Question in Qwirl" : "Questions in Qwirl"}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Refresh"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-8 w-8 flex-shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default QwirlStatsSummaryCard;
