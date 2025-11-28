"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityResponse } from "./types";
import ActivityRow from "./activity-row";
import EmptyState from "./empty-state";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  activities: ActivityResponse[] | undefined;
  isLoading: boolean;
  className?: string;
};

export default function RecentActivitiesList({
  activities,
  isLoading,
  className,
}: Props) {
  const items = activities?.slice(0, 3) ?? [];

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
        <Link
          href="/qwirls/primary/responses"
          className="text-xs font-medium text-primary hover:text-primary/80 self-start sm:self-auto"
        >
          See all
        </Link>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-3">
            {items.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/40 p-6 text-center">
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
