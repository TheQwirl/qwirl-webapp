"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { XCircle, Users, TrendingUp } from "lucide-react";
import { ResponderLoadingSkeleton } from "./responder-loading-skeleton";
import { ResponderCard } from "./responder-card";
import pluralize from "pluralize";

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
};

interface InsightsOverviewTabProps {
  data?: {
    responders: ResponderData[];
    total_count: number;
  };
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onResponderClick: (responderId: number) => void;
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
  data,
  isLoading,
  isError,
  refetch,
  onResponderClick,
}) => {
  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {isLoading
                ? "Loading..."
                : `${data?.total_count || 0} ${pluralize(
                    "response",
                    data?.total_count || 0
                  )}`}
            </span>
          </div>
          {!isLoading && data?.responders && data?.responders.length > 0 && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>
                {
                  data?.responders.filter((r) => r.status === "completed")
                    .length
                }{" "}
                completed
              </span>
            </div>
          )}
        </motion.div>
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
          {data?.responders && data?.responders.length > 0 ? (
            data?.responders.map((responder, index) => (
              <ResponderCard
                key={responder.id}
                responder={responder}
                index={index}
                onClick={() => onResponderClick(responder.id)}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
};
