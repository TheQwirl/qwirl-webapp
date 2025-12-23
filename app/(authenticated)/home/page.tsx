"use client";

import React, { useCallback, useMemo } from "react";
import { authStore } from "@/stores/useAuthStore";
import $api from "@/lib/api/client";
import { PageLayout } from "@/components/layout/page-layout";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CONSTANTS } from "@/constants/qwirl-respond";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
import RecentActivitiesList from "./_components/recent-activities-list";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  const { user } = authStore();
  const isUserReady = !!user?.id;

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

  // Fetch user's Qwirl cover and stats
  const { data: qwirlCover, isLoading: isLoadingCover } = $api.useQuery(
    "get",
    "/qwirl/me/cover",
    {},
    {
      enabled: isUserReady && !!user?.primary_qwirl_id,
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
      enabled: isUserReady && !!user?.primary_qwirl_id,
    }
  );

  const resolvedIsLoadingCover = isUserReady ? isLoadingCover : true;
  const resolvedIsLoadingStats = isUserReady ? isLoadingStats : true;

  const pollsCount = qwirlStats?.total_items ?? 0;
  const isIncomplete = pollsCount < CONSTANTS.MIN_QWIRL_POLLS;
  const totalResponses = qwirlStats?.unique_responders ?? 0;

  return (
    <PageLayout
      backNavigation={{
        title: (
          <div className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2">
            Home
          </div>
        ),
        subtitle: isUserReady
          ? `Welcome back, ${user?.name || user?.username}`
          : "Loading…",
        hideBackButton: true,
      }}
      parentDivClassName="!p-0"
    >
      <div className="flex flex-col min-h-full">
        <section
          className={cn(
            " flex-1 relative overflow-hidden px-4 py-6 sm:px-2 sm:py-8 min-h-full"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="px-2 sm:px-4 space-y-4">
              {isIncomplete ? (
                <div className="relative">
                  {/* Ambient background: a wide, tall, softly-blurred gradient that
                      intentionally extends beyond the viewport to avoid looking
                      like a cut-off rectangle. Centered and pointer-events-none. */}
                  <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[120vh] max-w-[90vw] rounded-[80px] bg-gradient-to-r from-primary/15 via-fuchsia-500/10 to-primary/15 blur-3xl opacity-70" />

                  <div className="mx-auto grid max-w-5xl gap-8 items-center text-center lg:grid-cols-2 lg:text-left">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        {resolvedIsLoadingStats ? (
                          <div className="space-y-3">
                            <Skeleton className="h-3 w-36 rounded-full" />
                            <Skeleton className="h-7 w-64 rounded-md" />
                            <Skeleton className="h-4 w-[80%] rounded-md" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Your Qwirl isn’t live yet
                            </p>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
                              Add{" "}
                              {Math.max(
                                CONSTANTS.MIN_QWIRL_POLLS - pollsCount,
                                0
                              )}{" "}
                              more question
                              {Math.max(
                                CONSTANTS.MIN_QWIRL_POLLS - pollsCount,
                                0
                              ) === 1
                                ? ""
                                : "s"}
                            </h2>
                            <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base lg:mx-0">
                              Once you hit {CONSTANTS.MIN_QWIRL_POLLS}, you can
                              share your Qwirl and start collecting responses.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 flex-row lg:justify-start">
                        {resolvedIsLoadingStats ? (
                          <div className="flex gap-3">
                            <Skeleton className="h-10 w-36 rounded-full" />
                            <Skeleton className="h-10 w-36 rounded-full" />
                          </div>
                        ) : (
                          <>
                            <Link
                              href="/qwirls/primary/edit/questions"
                              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                            >
                              Add questions
                            </Link>
                            <Link
                              href="/qwirls/primary/edit/cover"
                              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-sm transition hover:border-foreground/40"
                            >
                              Edit cover
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                      {/* Cover spotlight */}
                      <div className="pointer-events-none absolute -inset-8 rounded-[48px] bg-gradient-to-br from-primary/25 via-fuchsia-500/10 to-transparent blur-3xl opacity-80" />
                      <div className="pointer-events-none absolute -inset-12 rounded-[56px] bg-gradient-to-tr from-primary/10 via-transparent to-primary/15 blur-3xl" />

                      <div className="relative">
                        {resolvedIsLoadingCover ? (
                          <QwirlCoverSkeleton />
                        ) : (
                          <QwirlCover
                            qwirlCoverData={{
                              background_image:
                                qwirlCover?.background_image || null,
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
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-stretch">
                  <div className="flex h-full flex-col gap-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {resolvedIsLoadingStats ? (
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
                      {resolvedIsLoadingCover ? (
                        <QwirlCoverSkeleton />
                      ) : (
                        <QwirlCover
                          qwirlCoverData={{
                            background_image:
                              qwirlCover?.background_image || null,
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
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </div>
    </PageLayout>
  );
};

export default HomePage;
