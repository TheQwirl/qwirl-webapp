"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn, shareOrCopy } from "@/lib/utils";
import type { MyUser } from "@/components/profile/types";
import type {
  WavelengthUserResponse,
  QwirlCoverResponse,
  QwirlResponseStats,
} from "./types";
import { CONSTANTS } from "@/constants/qwirl-respond";
// import HeroPulseCard from "./hero-pulse-card";
import RecentActivitiesList from "./recent-activities-list";
import HomeActionFooter from "./home-action-footer";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
// import TopMatchSpotlight from "./top-match-spotlight";
import Link from "next/link";
import $api from "@/lib/api/client";

interface QwirlOverviewSectionProps {
  user: MyUser;
  qwirlCover: QwirlCoverResponse | undefined;
  qwirlStats: QwirlResponseStats | undefined;
  isLoadingCover: boolean;
  isLoadingStats: boolean;
  topMatches: WavelengthUserResponse[] | undefined;
  topMatchesCount: number;
  isLoadingMatches: boolean;
}

export function QwirlOverviewSection({
  user,
  qwirlCover,
  qwirlStats,
  isLoadingCover,
  isLoadingStats,
  // topMatches,
  topMatchesCount,
}: // isLoadingMatches,
// ,
QwirlOverviewSectionProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const { data: recentActivity } = $api.useQuery(
    "get",
    "/activities/me/recent-activity",
    {
      params: {
        query: {
          limit: 10,
          type: "all",
        },
      },
    },
    {
      enabled: !!user?.id,
    }
  );

  useEffect(() => {
    if (typeof window === "undefined" || !user?.username) {
      setShareUrl(null);
      return;
    }
    setShareUrl(`${window.location.origin}/qwirl/${user.username}`);
  }, [user?.username]);

  const pollsCount = qwirlStats?.total_items ?? 0;
  const isIncomplete = pollsCount < CONSTANTS.MIN_QWIRL_POLLS;
  const totalResponses = qwirlStats?.unique_responders ?? 0;

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  const StatCardSkeleton = useCallback(
    () => (
      <div className="group relative overflow-hidden rounded-xl border p-3 bg-card">
        <div className="relative flex justify-between gap-2">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-muted/40 animate-pulse" />
            <div className="h-10 w-24 rounded-lg bg-muted/30 animate-pulse" />
          </div>
          <div className="h-3 w-12 rounded-full bg-muted/40 animate-pulse self-start" />
        </div>
      </div>
    ),
    []
  );

  // const topMatch = useMemo(
  //   () => (topMatches && topMatches.length > 0 ? topMatches[0] : undefined),
  //   [topMatches]
  // );

  const hasRecentActivity = (recentActivity?.activities?.length ?? 0) > 0;
  const hasMatches = topMatchesCount > 0;

  const handleShare = useCallback(async () => {
    if (!shareUrl) {
      toast.error("Share link not ready yet.");
      return;
    }

    const result = await shareOrCopy(
      shareUrl,
      `${user?.name ?? user?.username}'s Qwirl`
    );

    if (result === "copied") {
      toast.success("Link copied to clipboard.");
      return;
    }

    if (result === "unsupported") {
      toast.error("Sharing isn't supported in this environment.");
      return;
    }

    if (typeof result === "object" && result !== null && "error" in result) {
      const err = String(result.error ?? "");
      if (
        err.toLowerCase().includes("abort") ||
        err.toLowerCase().includes("aborterror")
      ) {
        return;
      }
      toast.error("We couldn't share that just now.");
      return;
    }
  }, [shareUrl, user?.name, user?.username]);

  return (
    <section
      className={cn(
        "relative overflow-hidden px-4 py-6 sm:px-2 sm:py-8"
        // "bg-gradient-to-br from-primary/10 via-background to-background"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="px-2 sm:px-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-stretch">
            <div className="flex h-full flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {isLoadingStats ? (
                  <>
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                  </>
                ) : (
                  <>
                    <div className="group relative overflow-hidden rounded-xl border p-3 bg-card">
                      <div className="relative flex justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Total Polls
                          </p>
                          <p className="text-4xl font-semibold text-foreground">
                            {numberFormatter.format(pollsCount)}
                          </p>
                        </div>
                        <Link
                          href="/qwirls/primary/edit"
                          className="text-xs font-medium text-primary hover:text-primary/80 self-start sm:self-auto"
                        >
                          Edit Qwirl
                        </Link>
                      </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl border p-3 bg-card">
                      <div className="relative flex justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Total Responses
                          </p>
                          <p className="text-4xl font-semibold text-foreground">
                            {numberFormatter.format(totalResponses)}
                          </p>
                        </div>
                        <Link
                          href="/qwirls/primary/responses"
                          className="text-xs font-medium text-primary hover:text-primary/80 self-start sm:self-auto"
                        >
                          See all
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 min-h-0">
                <RecentActivitiesList className="flex h-full flex-col" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                {isLoadingCover ? (
                  <QwirlCoverSkeleton />
                ) : (
                  <QwirlCover
                    qwirlCoverData={{
                      background_image: qwirlCover?.background_image || null,
                      description: qwirlCover?.description || null,
                      title: qwirlCover?.title || null,
                      name: qwirlCover?.name || null,
                      totalPolls: pollsCount,
                    }}
                    user={user}
                    isProfile
                    showCategories={true}
                    variant="owner"
                    isIncomplete={isIncomplete}
                    showTotalPolls
                  />
                )}
              </div>

              {/* <TopMatchSpotlight
                match={topMatch}
                totalCount={topMatchesCount}
                isLoading={isLoadingMatches}
              /> */}
            </div>
          </div>

          {
            <HomeActionFooter
              isIncomplete={isIncomplete}
              hasRecentActivity={hasRecentActivity}
              hasMatches={hasMatches}
              onShare={handleShare}
              shareDisabled={!shareUrl}
              username={user?.username}
            />
          }
        </div>
      </motion.div>
    </section>
  );
}
