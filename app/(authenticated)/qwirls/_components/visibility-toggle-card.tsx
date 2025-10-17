"use client";
import React, { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import CollapsibleCard from "@/components/collapsible-card";
import { authStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import $api from "@/lib/api/client";

interface VisibilityToggleCardProps {
  minPollsRequired?: number;
}

const VisibilityToggleCard: React.FC<VisibilityToggleCardProps> = ({
  minPollsRequired = 15,
}) => {
  const { user } = authStore();

  // Fetch qwirl cover data for visibility settings
  const qwirlCoverQuery = $api.useQuery(
    "get",
    "/qwirl/{qwirl_id}/cover",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    { enabled: !!user?.primary_qwirl_id }
  );

  // Fetch qwirl data to get poll count
  const qwirlQuery = $api.useQuery("get", "/qwirl/me", {
    enabled: !!user?.primary_qwirl_id,
  });

  const qwirlCoverMutation = $api.useMutation(
    "patch",
    "/qwirl/{qwirl_id}/cover",
    {
      onSuccess: () => {
        toast.success("Visibility updated successfully!");
        qwirlCoverQuery.refetch();
      },
      onError: (error) => {
        toast.error("Failed to update visibility. Please try again.");
        console.error("Error updating visibility:", error);
      },
    }
  );

  const qwirlCoverData = qwirlCoverQuery.data;
  const qwirlData = qwirlQuery.data;
  const isLoading = qwirlCoverQuery.isLoading || qwirlQuery.isLoading;
  const isUpdating = qwirlCoverMutation.isPending;

  // Calculate poll count and minimum requirement
  const currentPollCount = qwirlData?.items?.length ?? 0;
  const isMinimumMet = currentPollCount >= minPollsRequired;

  // Determine visibility state - force false if minimum not met
  const isQwirlVisible = isMinimumMet && Boolean(qwirlCoverData?.visibility);

  const handleVisibilityToggle = useCallback(
    async (checked: boolean) => {
      if (!user?.primary_qwirl_id || !isMinimumMet) return;

      await qwirlCoverMutation.mutateAsync({
        body: {
          visibility: checked,
        },
        params: {
          path: { qwirl_id: user.primary_qwirl_id },
        },
      });
    },
    [user?.primary_qwirl_id, isMinimumMet, qwirlCoverMutation]
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <CollapsibleCard
        title="Qwirl Visibility"
        icon={<Skeleton className="h-5 w-5 rounded" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </CollapsibleCard>
    );
  }

  return (
    <CollapsibleCard
      title="Qwirl Visibility"
      icon={
        isQwirlVisible ? (
          <Eye className="h-5 w-5" />
        ) : (
          <EyeOff className="h-5 w-5" />
        )
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isQwirlVisible ? "Visible" : "Hidden"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isQwirlVisible
                ? "Discoverable in community & accessible via link"
                : "Hidden from community, visitors see privacy notice"}
            </p>
          </div>
          <Switch
            checked={isQwirlVisible}
            onCheckedChange={handleVisibilityToggle}
            disabled={isUpdating || !isMinimumMet}
          />
        </div>

        {!isMinimumMet && (
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700">
              Need {minPollsRequired} polls to control visibility
            </span>
          </div>
        )}

        {isMinimumMet && (
          <div className="text-xs text-muted-foreground">
            {currentPollCount} polls completed • All visibility options
            available
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default VisibilityToggleCard;
