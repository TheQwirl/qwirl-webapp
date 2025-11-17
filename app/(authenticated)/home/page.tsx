"use client";

import React from "react";
import { motion } from "framer-motion";
import { authStore } from "@/stores/useAuthStore";
import $api from "@/lib/api/client";
import { PageLayout } from "@/components/layout/page-layout";
import { QwirlOverviewSection } from "./_components/qwirl-overview-section";
import { EmptyQwirlState } from "./_components/empty-qwirl-state";

const HomePage = () => {
  const { user } = authStore();

  // Fetch user's Qwirl cover and stats
  const { data: qwirlCover, isLoading: isLoadingCover } = $api.useQuery(
    "get",
    "/qwirl/me/cover",
    {},
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );

  const { data: qwirlStats, isLoading: isLoadingStats } = $api.useQuery(
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
      enabled: !!user?.primary_qwirl_id,
    }
  );

  const { data: recentActivity, isLoading: isLoadingActivity } = $api.useQuery(
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

  const hasQwirl = !!user?.primary_qwirl_id;

  const { data: topWavelengths, isLoading: isLoadingWavelengths } =
    $api.useQuery(
      "get",
      "/users/{user_id}/top-wavelengths-simple",
      {
        params: {
          path: {
            user_id: user?.id ?? 0,
          },
          query: {
            limit: 5,
          },
        },
      },
      {
        enabled: !!user?.id,
      }
    );

  return (
    <PageLayout
      backNavigation={{
        title: (
          <div className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2">
            Home
          </div>
        ),
        subtitle: `Welcome back, ${user?.name || user?.username}`,
        hideBackButton: true,
      }}
      parentDivClassName="!p-0"
    >
      <div className="space-y-4 sm:space-y-6 pb-4">
        {/* Main Content - Qwirl Overview or Empty State */}
        {hasQwirl ? (
          <QwirlOverviewSection
            qwirlCover={qwirlCover}
            qwirlStats={qwirlStats}
            user={user}
            isLoadingCover={isLoadingCover}
            isLoadingStats={isLoadingStats}
            recentActivities={recentActivity?.activities}
            isLoadingActivity={isLoadingActivity}
            topMatches={topWavelengths?.users}
            topMatchesCount={topWavelengths?.total_count ?? 0}
            isLoadingMatches={isLoadingWavelengths}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EmptyQwirlState />
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default HomePage;
