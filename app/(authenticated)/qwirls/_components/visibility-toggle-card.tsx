"use client";
import React, { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, EyeOff, MessageCircleQuestion } from "lucide-react";
import CollapsibleCard from "@/components/collapsible-card";
import { authStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { CONSTANTS } from "@/constants/qwirl-respond";
import { Progress } from "@/components/ui/progress";

const VisibilityToggleCard: React.FC = () => {
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

  // Calculate poll count and completion status
  const currentPollCount = qwirlData?.items?.length ?? 0;
  const isQwirlComplete = currentPollCount >= CONSTANTS.MIN_QWIRL_POLLS;
  const progressPercentage = Math.min(
    (currentPollCount / CONSTANTS.MIN_QWIRL_POLLS) * 100,
    100
  );

  // Visibility is independent of completion
  const isQwirlVisible = Boolean(qwirlCoverData?.visibility);

  const handleVisibilityToggle = useCallback(
    async (checked: boolean) => {
      if (!user?.primary_qwirl_id) return;

      await qwirlCoverMutation.mutateAsync({
        body: {
          visibility: checked,
        },
        params: {
          path: { qwirl_id: user.primary_qwirl_id },
        },
      });
    },
    [user?.primary_qwirl_id, qwirlCoverMutation]
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <CollapsibleCard
        title="Qwirl Status"
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
      title={isQwirlComplete ? "Qwirl Status" : "Qwirl Progress"}
      icon={
        isQwirlComplete ? (
          isQwirlVisible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )
        ) : (
          <MessageCircleQuestion className="h-5 w-5" />
        )
      }
    >
      <div className="space-y-4">
        {/* Show progress if Qwirl is not complete */}
        {!isQwirlComplete && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {currentPollCount} of {CONSTANTS.MIN_QWIRL_POLLS} questions
              </span>
              <span className="text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Add {CONSTANTS.MIN_QWIRL_POLLS - currentPollCount} more{" "}
              {CONSTANTS.MIN_QWIRL_POLLS - currentPollCount === 1
                ? "question"
                : "questions"}{" "}
              to complete your Qwirl
            </p>
          </div>
        )}

        {/* Show question count and visibility controls if Qwirl is complete */}
        {isQwirlComplete && (
          <div className="space-y-4">
            <div className="text-sm">
              <p className="font-medium text-muted-foreground">
                Question Count
              </p>
              <p className="text-2xl font-semibold">{currentPollCount}</p>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Visibility</p>
                <p className="text-xs text-muted-foreground">
                  {isQwirlVisible
                    ? "Discoverable in community & accessible via link"
                    : "Hidden from community, visitors see privacy notice"}
                </p>
              </div>
              <Switch
                checked={isQwirlVisible}
                onCheckedChange={handleVisibilityToggle}
                disabled={isUpdating}
              />
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default VisibilityToggleCard;
