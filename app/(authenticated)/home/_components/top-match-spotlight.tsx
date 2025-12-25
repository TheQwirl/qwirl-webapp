"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/user-avatar";
import WavelengthIndicator from "@/components/wavelength-indicator";
import EmptyState from "./empty-state";
import type { WavelengthUserResponse } from "./types";

type Props = {
  match: WavelengthUserResponse | undefined;
  totalCount: number;
  isLoading: boolean;
};

export default function TopMatchSpotlight({
  match,
  totalCount,
  isLoading,
}: Props) {
  return (
    <Card className="rounded-3xl backdrop-blur-sm">
      <CardHeader className="flex flex-col gap-2 space-y-0 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <CardTitle className="text-sm font-semibold">Top match</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Your strongest wavelength right now.
          </CardDescription>
        </div>
        {totalCount > 1 && (
          <Badge variant="outline" className="rounded-full text-[10px]">
            {totalCount} matches
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        ) : match ? (
          <div className="space-y-4">
            <Link
              href={`/${match.username}`}
              className="relative block rounded-2xl border border-border/40 bg-primary/5 p-4 transition-all hover:border-primary/50 hover:bg-primary/10"
            >
              <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-primary" />
              <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-center sm:gap-4 sm:pr-0">
                <UserAvatar
                  name={match.name ?? match.username}
                  image={match.avatar ?? undefined}
                  size="sm"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold">
                    {match.name ?? match.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{match.username}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Wavelength score
                </span>
                <WavelengthIndicator wavelength={match.wavelength_score} />
              </div>
            </Link>
            <Link
              href="/wavelengths"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
            >
              View all matches
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No matches yet"
            description="Share your Qwirl to discover your wavelength crew."
          />
        )}
      </CardContent>
    </Card>
  );
}
