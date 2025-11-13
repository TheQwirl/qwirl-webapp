"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Compass,
  Eye,
  EyeOff,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { components } from "@/lib/api/v1-client-side";
import { MyUser } from "@/components/profile/types";
import { CONSTANTS } from "@/constants/qwirl-respond";

type ActivityResponse = components["schemas"]["ActivityResponse"];
type WavelengthUserResponse = components["schemas"]["WavelengthUserResponse"];
type QwirlCoverResponse = components["schemas"]["QwirlCoverResponse"];
type QwirlResponseStats = components["schemas"]["QwirlResponseStats"];

interface QwirlOverviewSectionProps {
  user: MyUser;
  qwirlCover: QwirlCoverResponse | undefined;
  qwirlStats: QwirlResponseStats | undefined;
  isLoadingCover: boolean;
  isLoadingStats: boolean;
  recentActivities: ActivityResponse[] | undefined;
  isLoadingActivity: boolean;
  topMatches: WavelengthUserResponse[] | undefined;
  topMatchesCount: number;
  isLoadingMatches: boolean;
}

const numberFormatter = new Intl.NumberFormat();

export function QwirlOverviewSection({
  user,
  qwirlCover,
  qwirlStats,
  isLoadingCover,
  isLoadingStats,
  recentActivities,
  isLoadingActivity,
  topMatches,
  topMatchesCount,
  isLoadingMatches,
}: QwirlOverviewSectionProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.username) {
      setShareUrl(null);
      return;
    }
    setShareUrl(`${window.location.origin}/qwirl/${user.username}`);
  }, [user?.username]);

  const pollsCount = qwirlStats?.total_items ?? 0;
  const isIncomplete = pollsCount < CONSTANTS.MIN_QWIRL_POLLS;
  const totalResponses = qwirlStats?.total_responses ?? 0;
  const uniqueResponders = qwirlStats?.unique_responders ?? 0;
  const completionRate = qwirlStats?.average_completion_rate ?? 0;
  const visibility = qwirlCover?.visibility ?? false;

  const topMatch = useMemo(
    () => (topMatches && topMatches.length > 0 ? topMatches[0] : undefined),
    [topMatches]
  );

  const hasRecentActivity = (recentActivities?.length ?? 0) > 0;
  const hasMatches = topMatchesCount > 0;

  const handleShare = useCallback(async () => {
    if (!shareUrl) {
      toast.error("Share link not ready yet.");
      return;
    }

    if (typeof navigator === "undefined") {
      toast.error("Sharing isn't supported in this environment.");
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.name ?? user?.username}'s Qwirl`,
          url: shareUrl,
        });
        toast.success("Shared your Qwirl.");
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard.");
        return;
      }

      throw new Error("Share unsupported");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast.error("We couldn't share that just now.");
    }
  }, [shareUrl, user?.name, user?.username]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <HeroPulseCard
        user={user}
        cover={qwirlCover}
        isIncomplete={isIncomplete}
        isLoading={isLoadingCover || isLoadingStats}
        totalResponses={totalResponses}
        uniqueResponders={uniqueResponders}
        completionRate={completionRate}
        pollsCount={pollsCount}
        visibility={visibility}
        onShare={handleShare}
        shareDisabled={!shareUrl || isIncomplete}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentResponsesList
          activities={recentActivities}
          isLoading={isLoadingActivity}
        />
        <TopMatchSpotlight
          match={topMatch}
          totalCount={topMatchesCount}
          isLoading={isLoadingMatches}
        />
      </div>

      <HomeActionFooter
        isIncomplete={isIncomplete}
        hasRecentActivity={hasRecentActivity}
        hasMatches={hasMatches}
        onShare={handleShare}
        shareDisabled={!shareUrl}
        username={user?.username}
      />
    </motion.div>
  );
}

interface HeroPulseCardProps {
  user: MyUser;
  cover: QwirlCoverResponse | undefined;
  isIncomplete: boolean;
  isLoading: boolean;
  totalResponses: number;
  uniqueResponders: number;
  completionRate: number;
  pollsCount: number;
  visibility: boolean;
  onShare: () => void;
  shareDisabled: boolean;
}

function HeroPulseCard({
  user,
  cover,
  isIncomplete,
  isLoading,
  totalResponses,
  // uniqueResponders,
  // completionRate,
  pollsCount,
  visibility,
  onShare,
  shareDisabled,
}: HeroPulseCardProps) {
  const displayName = user?.name?.trim() || user?.username;
  const heroTitle = cover?.name || cover?.title || "Your Qwirl";
  const heroDescription = cover?.description?.trim()?.length
    ? cover.description
    : "Keep your Qwirl vibrant and invite more wavelength matches.";
  const trimmedDescription =
    heroDescription.length > 160
      ? `${heroDescription.slice(0, 157)}…`
      : heroDescription;

  const requiredPolls = Math.max(CONSTANTS.MIN_QWIRL_POLLS, 1);
  const progressValue = Math.min(
    100,
    Math.round((pollsCount / requiredPolls) * 100)
  );

  const hasBackground = Boolean(cover?.background_image);
  const statTone = hasBackground ? "dark" : "light";

  const statItems = [
    {
      label: "Responses",
      value: numberFormatter.format(totalResponses),
      icon: BarChart3,
    },
  ];

  const previewHref = user?.username ? `/qwirl/${user.username}` : "/";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/40 px-6 py-8 sm:px-10 sm:py-12",
        hasBackground
          ? "bg-black text-white"
          : "bg-gradient-to-br from-primary/10 via-background to-background"
      )}
    >
      {hasBackground && (
        <>
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `url(${cover?.background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/20" />
        </>
      )}

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/80 dark:text-muted-foreground/70">
          <span>Your Qwirl pulse</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">{heroTitle}</h1>
          <p
            className={cn(
              "text-sm sm:text-base",
              hasBackground ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {trimmedDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              hasBackground
                ? "bg-white/10 text-white border-white/20"
                : "bg-primary/10 text-primary"
            )}
          >
            Welcome back, {displayName}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-xs",
              hasBackground
                ? "border-white/20 text-white/80"
                : "border-border/40 text-muted-foreground"
            )}
          >
            {visibility ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
            {visibility ? "Public" : "Hidden"}
          </Badge>
        </div>

        {isLoading ? (
          <HeroPulseSkeleton hasBackground={hasBackground} />
        ) : isIncomplete ? (
          <div
            className={cn(
              "rounded-2xl border px-5 py-4 shadow-sm",
              hasBackground
                ? "border-white/15 bg-white/5"
                : "border-border/40 bg-background/80"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Finish setting up your Qwirl
                </p>
                <p
                  className={cn(
                    "text-xs",
                    hasBackground ? "text-white/70" : "text-muted-foreground"
                  )}
                >
                  {pollsCount} of {CONSTANTS.MIN_QWIRL_POLLS} polls added
                </p>
              </div>
              <span className="text-lg font-semibold">{progressValue}%</span>
            </div>
            <Progress
              value={progressValue}
              className={cn("mt-3", hasBackground ? "bg-white/20" : undefined)}
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {statItems.map((item) => (
              <StatPill
                key={item.label}
                label={item.label}
                value={item.value}
                icon={item.icon}
                tone={statTone}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {isIncomplete ? (
            <>
              <Button
                asChild
                icon={ArrowRight}
                iconPlacement="right"
                variant={hasBackground ? "secondary" : "default"}
              >
                <Link href="/qwirls/primary/edit">Complete Qwirl</Link>
              </Button>
              <Button asChild variant={hasBackground ? "ghost" : "outline"}>
                <Link href={previewHref}>Preview</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onShare}
                icon={Share2}
                iconPlacement="left"
                variant={hasBackground ? "secondary" : "default"}
                disabled={shareDisabled}
              >
                Share your Qwirl
              </Button>
              <Button
                asChild
                variant={hasBackground ? "ghost" : "outline"}
                icon={BarChart3}
                iconPlacement="left"
              >
                <Link href="/qwirls/primary/insights">View insights</Link>
              </Button>
              <Button asChild variant={hasBackground ? "ghost" : "outline"}>
                <Link href={previewHref}>Preview</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroPulseSkeleton({ hasBackground }: { hasBackground: boolean }) {
  return (
    <div className="space-y-3">
      <Skeleton
        className={cn(
          "h-20 w-full rounded-2xl",
          hasBackground ? "bg-white/10" : undefined
        )}
      />
      <Skeleton
        className={cn(
          "h-12 w-2/3 rounded-2xl",
          hasBackground ? "bg-white/10" : undefined
        )}
      />
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  tone: "light" | "dark";
}

function StatPill({ label, value, icon: Icon, tone }: StatPillProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm",
        tone === "dark"
          ? "border-white/15 bg-white/5 text-white"
          : "border-border/40 bg-background/70"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 flex-shrink-0",
            tone === "dark" ? "text-white/80" : "text-muted-foreground"
          )}
        />
      )}
      <div className="min-w-0">
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-wide",
            tone === "dark" ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <p className="text-base font-semibold leading-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

interface RecentResponsesListProps {
  activities: ActivityResponse[] | undefined;
  isLoading: boolean;
}

function RecentResponsesList({
  activities,
  isLoading,
}: RecentResponsesListProps) {
  const items = activities?.slice(0, 3) ?? [];

  return (
    <section className="space-y-4 rounded-3xl border border-border/40 bg-background/70 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Latest responses</h2>
          <p className="text-xs text-muted-foreground">
            Stay in sync with what&apos;s happening.
          </p>
        </div>
        <Link
          href="/qwirls/primary/insights"
          className="text-xs font-medium text-primary hover:text-primary/80"
        >
          See all
        </Link>
      </div>

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
        <EmptyState
          icon={Users}
          title="No activity yet"
          description="Share your Qwirl to invite your first responses."
        />
      )}
    </section>
  );
}

type ActivityBadgeTone = "positive" | "attention" | "muted";

interface ActivityRowProps {
  activity: ActivityResponse;
}

type SessionMetadata = {
  session_status?: "completed" | "in_progress" | "abandoned";
  wavelength?: number;
  session_id?: number;
};

const badgeToneClassMap: Record<ActivityBadgeTone, string> = {
  positive:
    "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  attention:
    "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  muted: "border border-border/40 text-muted-foreground",
};

function ActivityRow({ activity }: ActivityRowProps) {
  const actor = activity.actor;
  const sessionMeta = (activity.extra_data ?? undefined) as
    | SessionMetadata
    | undefined;
  const actorDisplay = actor?.name?.trim() || actor?.username;

  let headline = `${actorDisplay} interacted with your Qwirl`;
  let subline = actor?.username ? `@${actor.username}` : undefined;
  let statusLabel: string | undefined;
  let tone: ActivityBadgeTone = "muted";
  let wavelength =
    typeof sessionMeta?.wavelength === "number"
      ? sessionMeta?.wavelength
      : undefined;
  let href = "/qwirls/primary/insights";

  if (activity.type === "user_answered_my_qwirl") {
    const sessionStatus = sessionMeta?.session_status;
    if (sessionStatus === "completed") {
      headline = `${actorDisplay} completed your Qwirl`;
      statusLabel = "Completed";
      tone = "positive";
    } else if (sessionStatus === "in_progress") {
      headline = `${actorDisplay} is answering your Qwirl`;
      statusLabel = "In progress";
      tone = "attention";
    } else {
      headline = `${actorDisplay} started your Qwirl`;
      statusLabel = "Started";
      tone = "muted";
    }

    if (sessionMeta?.session_id) {
      href = `/qwirls/primary/insights?responder=${sessionMeta.session_id}`;
    }
  } else if (activity.type === "qwirl_answered") {
    headline = `You answered ${activity.subject?.title ?? "a Qwirl"}`;
    subline = activity.subject?.title;
    statusLabel = "Your activity";
    tone = "muted";
    wavelength = undefined;
    if (activity.subject?.title) {
      href = `/qwirl/${activity.subject.title}`;
    }
  }

  let timestamp = "";
  if (activity.created_at) {
    const createdAt = new Date(activity.created_at);
    if (!Number.isNaN(createdAt.getTime())) {
      try {
        timestamp = formatDistanceToNowStrict(createdAt, { addSuffix: true });
      } catch {
        timestamp = "";
      }
    }
  }

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border/40 bg-background/80 p-3 transition-all hover:-translate-y-px hover:border-primary/50 hover:shadow-sm sm:p-4"
    >
      <div className="flex items-start gap-3">
        <UserAvatar
          name={actorDisplay || "Responder"}
          image={actor?.avatar ?? undefined}
          size="sm"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium leading-tight">
              {headline}
            </p>
            {timestamp && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                {timestamp}
              </span>
            )}
          </div>
          {subline && (
            <p className="truncate text-xs text-muted-foreground">{subline}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {statusLabel && (
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-medium",
                  badgeToneClassMap[tone]
                )}
              >
                {statusLabel}
              </Badge>
            )}
            {typeof wavelength === "number" && (
              <WavelengthIndicator
                variant="badge"
                wavelength={wavelength}
                userName={actor?.username ?? "user"}
              />
            )}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
    </Link>
  );
}

interface TopMatchSpotlightProps {
  match: WavelengthUserResponse | undefined;
  totalCount: number;
  isLoading: boolean;
}

function TopMatchSpotlight({
  match,
  totalCount,
  isLoading,
}: TopMatchSpotlightProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-border/40 bg-background/70 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Top match</h2>
          <p className="text-xs text-muted-foreground">
            Your strongest wavelength right now.
          </p>
        </div>
        {totalCount > 1 && (
          <Badge variant="outline" className="rounded-full text-[10px]">
            {totalCount} matches
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      ) : match ? (
        <div className="space-y-4">
          <Link
            href={`/qwirl/${match.username}`}
            className="block rounded-2xl border border-border/40 bg-primary/5 p-4 transition-all hover:border-primary/50 hover:bg-primary/10"
          >
            <div className="flex items-start gap-3">
              <UserAvatar
                name={match.name ?? match.username}
                image={match.avatar ?? undefined}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {match.name ?? match.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{match.username}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Wavelength score</span>
              <WavelengthIndicator
                variant="badge"
                wavelength={match.wavelength_score}
                userName={match.username}
              />
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
    </section>
  );
}

interface HomeActionFooterProps {
  isIncomplete: boolean;
  hasRecentActivity: boolean;
  hasMatches: boolean;
  onShare: () => void;
  shareDisabled: boolean;
  username?: string;
}

function HomeActionFooter({
  isIncomplete,
  hasRecentActivity,
  hasMatches,
  onShare,
  shareDisabled,
  username,
}: HomeActionFooterProps) {
  const actions: React.ReactNode[] = [];
  const previewHref = username ? `/qwirl/${username}` : "/";

  if (isIncomplete) {
    actions.push(
      <Button key="complete" asChild icon={BarChart3} iconPlacement="left">
        <Link href="/qwirls/primary/edit">Add polls</Link>
      </Button>
    );
    actions.push(
      <Button key="preview" asChild variant="ghost">
        <Link href={previewHref}>Preview</Link>
      </Button>
    );
  } else {
    if (!hasRecentActivity) {
      actions.push(
        <Button
          key="share"
          onClick={onShare}
          icon={Share2}
          iconPlacement="left"
          disabled={shareDisabled}
        >
          Share
        </Button>
      );
      actions.push(
        <Button
          key="explore"
          asChild
          variant="outline"
          icon={Compass}
          iconPlacement="left"
        >
          <Link href="/feed">Explore feed</Link>
        </Button>
      );
    }

    if (!hasMatches) {
      actions.push(
        <Button
          key="matches"
          asChild
          variant="ghost"
          icon={Users}
          iconPlacement="left"
        >
          <Link href="/wavelengths">Find matches</Link>
        </Button>
      );
    }
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-muted/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Next best steps</p>
        <p className="text-xs text-muted-foreground">
          Quick suggestions tailored to your current momentum.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </div>
    </section>
  );
}

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-dashed border-border/60 px-6 py-8 text-center">
      <Icon className="mx-auto h-6 w-6 text-muted-foreground/60" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
