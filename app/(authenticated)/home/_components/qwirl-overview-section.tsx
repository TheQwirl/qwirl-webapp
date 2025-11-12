"use client";

import React from "react";
import { motion } from "framer-motion";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
import { QwirlHeader } from "./qwirl-header";
import { RecentActivityCard } from "./recent-activity-card";
import { TopMatchesCard } from "./top-matches-card";
import { QuickStatsCard } from "./quick-stats-card";
import { components } from "@/lib/api/v1-client-side";
import { MyUser } from "@/components/profile/types";
import { CONSTANTS } from "@/constants/qwirl-respond";

interface QwirlOverviewSectionProps {
  qwirlCover: components["schemas"]["QwirlCoverResponse"] | undefined;
  user: MyUser;
  isLoadingCover: boolean;
  totalPolls?: number;
  visibility?: boolean;
  recentActivities: components["schemas"]["ActivityResponse"][] | undefined;
  isLoadingActivity: boolean;
  topMatches: components["schemas"]["WavelengthUserResponse"][] | undefined;
  topMatchesCount: number;
  isLoadingMatches: boolean;
}

export function QwirlOverviewSection({
  qwirlCover,
  user,
  isLoadingCover,
  recentActivities,
  isLoadingActivity,
  topMatches,
  topMatchesCount,
  isLoadingMatches,
  totalPolls,
}: QwirlOverviewSectionProps) {
  const isIncomplete = (totalPolls ?? 0) < CONSTANTS.MIN_QWIRL_POLLS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Mobile/Tablet Layout - Stacked vertically */}
      <div className="flex flex-col lg:hidden space-y-4">
        {/* Qwirl Cover */}
        <div className="w-full">
          {isLoadingCover ? (
            <QwirlCoverSkeleton className="h-full" />
          ) : (
            <QwirlCover
              qwirlCoverData={{
                background_image: qwirlCover?.background_image,
                description: qwirlCover?.description,
                title: qwirlCover?.title ?? "Your Qwirl",
                totalPolls,
                name: qwirlCover?.name,
              }}
              user={{
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                categories: user.categories || [],
              }}
              variant="owner"
              isIncomplete={isIncomplete}
              className="h-full"
              showTotalPolls
              showVisibility
              showCategories={false}
            />
          )}
        </div>
        {/* Header with Actions */}
        <QwirlHeader username={user.username} />
        {/* Cards Stack */}
        <div className="space-y-4">
          <RecentActivityCard
            activities={recentActivities}
            isLoading={isLoadingActivity}
          />
          <TopMatchesCard
            users={topMatches}
            totalCount={topMatchesCount}
            isLoading={isLoadingMatches}
          />
          <QuickStatsCard />
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4">
        <div className="col-span-8 pr-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-full">
            <div className="xl:row-span-2 flex flex-col gap-4">
              <QwirlHeader username={user.username} />
              <RecentActivityCard
                activities={recentActivities}
                isLoading={isLoadingActivity}
              />
            </div>

            <div>
              <TopMatchesCard
                users={topMatches}
                totalCount={topMatchesCount}
                isLoading={isLoadingMatches}
              />
            </div>

            <div>
              <QuickStatsCard />
            </div>
          </div>
        </div>

        {/* Qwirl Cover */}
        <div className="flex-shrink-0 w-full col-span-4">
          {isLoadingCover ? (
            <QwirlCoverSkeleton className="h-full" />
          ) : (
            <QwirlCover
              qwirlCoverData={{
                background_image: qwirlCover?.background_image,
                description: qwirlCover?.description,
                title: qwirlCover?.title ?? "Your Qwirl",
                totalPolls,
                name: qwirlCover?.name,
              }}
              user={{
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                categories: user.categories || [],
              }}
              variant="owner"
              isIncomplete={isIncomplete}
              className="h-full"
              showTotalPolls
              showVisibility
              showCategories={false}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
