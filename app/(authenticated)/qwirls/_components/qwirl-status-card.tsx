"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import $api from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface QwirlStatusCardProps {
  pollCount: number;
  minPollsRequired?: number;
  qwirlUrl?: string;
}

const QwirlStatusCard: React.FC<QwirlStatusCardProps> = ({
  pollCount,
  minPollsRequired = 15,
  qwirlUrl,
}) => {
  const { user } = authStore();
  const [copied, setCopied] = useState(false);

  const isMinimumMet = pollCount >= minPollsRequired;

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
  const isLoading = qwirlCoverQuery.isLoading;

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
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Qwirl Status</h3>
        </div>

        {/* Poll Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Questions Complete
          </span>
          <Badge
            variant={isMinimumMet ? "default" : "secondary"}
            className="font-semibold"
          >
            {pollCount} / {minPollsRequired}
          </Badge>
        </div>

        {/* Status Message */}
        <div className="flex items-start gap-2 text-xs">
          {isMinimumMet ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-green-700 font-medium">
                Ready to share publicly
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-amber-700">
                Add {minPollsRequired - pollCount} more question
                {minPollsRequired - pollCount !== 1 ? "s" : ""} to share
              </span>
            </>
          )}
        </div>

        {/* Visibility Toggle */}
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2">
              {isVisible ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground opacity-50" />
              )}
              <span className="text-sm font-medium">
                {isVisible ? "Visible to everyone" : "Private"}
              </span>
            </div>
            <Switch
              checked={isVisible}
              onCheckedChange={handleVisibilityToggle}
              disabled={!isMinimumMet || qwirlCoverMutation.isPending}
            />
          </div>
        )}

        {!isMinimumMet && (
          <p className="text-xs text-muted-foreground">
            Complete all {minPollsRequired} questions to enable visibility
            toggle
          </p>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!qwirlUrl}
                  className={`transition-colors ${
                    copied ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy link"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={qwirlUrl || "#"}>
                  <Button variant="outline" size="icon" disabled={!qwirlUrl}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Preview Qwirl</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default QwirlStatusCard;
