"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, AlertCircle } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CONSTANTS } from "@/constants/qwirl-respond";
import { Progress } from "@/components/ui/progress";

interface QwirlStatusCardProps {
  pollCount: number;
  isLoading: boolean;
  qwirlUrl?: string;
}

const QwirlStatusCard: React.FC<QwirlStatusCardProps> = ({
  pollCount,
  isLoading,
  qwirlUrl,
}) => {
  const { user } = authStore();
  const [copied, setCopied] = useState(false);

  const isMinimumMet = pollCount >= CONSTANTS.MIN_QWIRL_POLLS;

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

  const isVisible = qwirlCoverQuery.data?.visibility ?? false;

  const progressPercentage = Math.min(
    (pollCount / CONSTANTS.MIN_QWIRL_POLLS) * 100,
    100
  );

  const handleVisibilityToggle = async (checked: boolean) => {
    if (!user?.primary_qwirl_id) return;

    await qwirlCoverMutation.mutateAsync({
      params: {
        path: {
          qwirl_id: user.primary_qwirl_id,
        },
      },
      body: {
        visibility: checked,
      },
    });
  };

  const handleCopy = () => {
    if (qwirlUrl) {
      navigator.clipboard.writeText(qwirlUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6 space-y-4">
        {/* Loading State */}
        {isLoading ? (
          <>
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
          </>
        ) : (
          <>
            {/* Qwirl Incomplete - Show Progress */}
            {!isMinimumMet && (
              <>
                {/* Header */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Qwirl Progress</h3>
                  <p className="text-xs text-muted-foreground">
                    Add {CONSTANTS.MIN_QWIRL_POLLS} questions to complete your
                    Qwirl
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Questions added
                    </span>
                    <span className="font-semibold">
                      {pollCount} / {CONSTANTS.MIN_QWIRL_POLLS}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Status Message */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-900">
                      {CONSTANTS.MIN_QWIRL_POLLS - pollCount} more question
                      {CONSTANTS.MIN_QWIRL_POLLS - pollCount !== 1
                        ? "s"
                        : ""}{" "}
                      needed
                    </p>
                    <p className="text-xs text-amber-700">
                      Complete your Qwirl to enable sharing and visibility
                      controls
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Qwirl Complete - Show Question Count & Visibility */}
            {isMinimumMet && (
              <>
                {/* Header */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Qwirl Settings</h3>
                </div>

                {/* Question Count */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <span className="text-sm text-muted-foreground">
                    Question count
                  </span>
                  <Badge variant="secondary" className="font-semibold">
                    {pollCount}
                  </Badge>
                </div>

                {/* Visibility Controls */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Public Visibility
                  </label>
                  {qwirlCoverQuery.isLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-2">
                        <Eye
                          className={`h-4 w-4 ${
                            isVisible
                              ? "text-green-600"
                              : "text-muted-foreground opacity-50"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {isVisible ? "Public" : "Private"}
                        </span>
                      </div>
                      <Switch
                        checked={isVisible}
                        onCheckedChange={handleVisibilityToggle}
                        disabled={qwirlCoverMutation.isPending}
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {isVisible
                      ? "Your Qwirl is visible to others and can be shared"
                      : "Your Qwirl is private and only visible to you"}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!qwirlUrl}
                        icon={Copy}
                        iconPlacement="left"
                        className={`flex-1 ${
                          copied ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {copied ? "Copied!" : "Copy Link"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {copied ? "Copied!" : "Copy Qwirl link"}
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={qwirlUrl || "#"} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!qwirlUrl}
                          icon={Eye}
                          iconPlacement="left"
                          className="w-full"
                        >
                          Preview
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Preview your Qwirl</TooltipContent>
                  </Tooltip>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QwirlStatusCard;
