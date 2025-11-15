"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  RefreshCcw,
  Users as UsersIcon,
  Compass,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { PageLayout } from "@/components/layout/page-layout";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { components } from "@/lib/api/v1-client-side";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { cn } from "@/lib/utils";

type WavelengthUserResponse = components["schemas"]["WavelengthUserResponse"];

const WavelengthsPage = () => {
  const { user } = authStore();

  const wavelengthsQuery = $api.useQuery(
    "get",
    "/users/{user_id}/top-wavelengths-simple",
    {
      params: {
        path: {
          user_id: user?.id ?? 0,
        },
        query: {
          limit: 20,
        },
      },
    },
    {
      enabled: !!user?.id,
      refetchOnWindowFocus: false,
    }
  );

  const connections = wavelengthsQuery.data?.users ?? [];
  const totalCount = wavelengthsQuery.data?.total_count ?? 0;
  const topConnection = connections[0];

  const isLoadingInitial = wavelengthsQuery.isLoading || !user?.id;
  const isRefreshing =
    wavelengthsQuery.isFetching && !wavelengthsQuery.isLoading;
  const hasConnections = connections.length > 0;
  const headingBadge =
    totalCount > 0
      ? `${totalCount} ${totalCount === 1 ? "person" : "people"}`
      : null;

  return (
    <PageLayout
      rightSidebar={null}
      backNavigation={{
        title: "Wavelengths",
        subtitle:
          "See who’s on your frequency across every Qwirl you’ve shared",
        hideBackButton: true,
        rightContent: headingBadge ? (
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-xs font-medium"
          >
            {headingBadge}
          </Badge>
        ) : null,
      }}
    >
      <div className="px-3 pb-16 pt-2 sm:px-6 space-y-8">
        <WavelengthHero
          userDisplayName={user?.name ?? user?.username ?? "you"}
          totalCount={totalCount}
          topConnection={topConnection}
          isLoading={isLoadingInitial}
        />

        {isLoadingInitial ? (
          <WavelengthListSkeleton />
        ) : wavelengthsQuery.isError ? (
          <WavelengthErrorState
            onRetry={() => wavelengthsQuery.refetch()}
            message={
              wavelengthsQuery.error instanceof Error
                ? wavelengthsQuery.error.message
                : "We couldn’t load wavelengths right now."
            }
          />
        ) : hasConnections ? (
          <WavelengthConnections
            connections={connections}
            isRefreshing={isRefreshing}
          />
        ) : (
          <WavelengthEmptyState />
        )}

        <GrowthPlaybook />
      </div>
    </PageLayout>
  );
};

interface WavelengthHeroProps {
  userDisplayName: string;
  totalCount: number;
  topConnection?: WavelengthUserResponse;
  isLoading: boolean;
}

const WavelengthHero = ({
  userDisplayName,
  totalCount,
  topConnection,
  isLoading,
}: WavelengthHeroProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-8 sm:px-9 sm:py-10"
    >
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-6 bottom-6 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6">
        <Badge
          variant="secondary"
          className="w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary"
        >
          Your wavelength network
        </Badge>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Stay in sync with the people who get{" "}
            {userDisplayName.split(" ")[0] ?? "you"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Every time you and someone else answer each other’s Qwirls, your
            shared wavelength sharpens. Keep conversations humming by inviting
            more people to your Qwirl or discovering new ones to respond to.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-background/70 p-5 shadow-sm backdrop-blur">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-2/3 rounded-xl" />
          </div>
        ) : topConnection ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-background/80 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={topConnection.name ?? topConnection.username}
                image={topConnection.avatar ?? undefined}
                size="md"
                linkTo={`/qwirl/${topConnection.username}`}
              />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Strongest current wavelength
                </p>
                <p className="text-lg font-semibold">
                  {topConnection.name?.trim()?.length
                    ? topConnection.name
                    : `@${topConnection.username}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  You’ve both answered each other’s primary Qwirls and any
                  overlapping secondary Qwirls.
                </p>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <WavelengthIndicator
                wavelength={topConnection.wavelength_score}
                variant="compact-horizontal"
                userName={topConnection.username}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border/50 bg-background/70 p-5 text-sm shadow-sm">
            <p className="font-semibold text-foreground">
              No wavelengths yet—but that can change fast.
            </p>
            <p className="text-muted-foreground">
              Answer a friend’s Qwirl or invite someone to yours. As soon as
              you’ve both shared answers, we’ll highlight your shared wavelength
              here.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            icon={ArrowRight}
            iconPlacement="right"
            className="rounded-full px-5"
          >
            <Link href="/discover">Discover new Qwirls</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/qwirls/primary/edit">Tune your Qwirl</Link>
          </Button>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <HeroHighlightStat label="Total wavelengths" value={totalCount} />
          <HeroHighlightStat
            label="Fresh this week"
            value={Math.min(
              totalCount,
              Math.max(0, Math.floor(totalCount / 3))
            )}
            hint="People you’ve synced with over the last few days"
          />
          <HeroHighlightStat
            label="Next milestone"
            value={
              totalCount >= 9
                ? "You’re on a roll"
                : `+${Math.max(0, 9 - totalCount)}`
            }
            hint="Reach 9 wavelengths to unlock a shareable highlight reel"
          />
        </div>
      </div>
    </motion.section>
  );
};

interface HeroHighlightStatProps {
  label: string;
  value: number | string;
  hint?: string;
}

const HeroHighlightStat = ({ label, value, hint }: HeroHighlightStatProps) => {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/70 p-4 text-sm shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
};

interface WavelengthConnectionsProps {
  connections: WavelengthUserResponse[];
  isRefreshing: boolean;
}

const WavelengthConnections = ({
  connections,
  isRefreshing,
}: WavelengthConnectionsProps) => {
  const fillerCount = Math.max(0, 3 - connections.length);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">All wavelengths</h2>
          <p className="text-sm text-muted-foreground">
            Sorted by how closely you align. We update scores whenever either of
            you answers a new Qwirl.
          </p>
        </div>
        {isRefreshing ? (
          <Badge
            variant="outline"
            className="inline-flex items-center gap-1 rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <RefreshCcw className="h-3 w-3 animate-spin" /> Syncing
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection, index) => (
          <WavelengthConnectionCard
            key={connection.id}
            connection={connection}
            emphasize={index === 0}
          />
        ))}
        {Array.from({ length: fillerCount }).map((_, index) => (
          <PotentialConnectionCard key={`placeholder-${index}`} index={index} />
        ))}
      </div>
    </section>
  );
};

interface WavelengthConnectionCardProps {
  connection: WavelengthUserResponse;
  emphasize?: boolean;
}

const WavelengthConnectionCard = ({
  connection,
  emphasize = false,
}: WavelengthConnectionCardProps) => {
  const displayName = connection.name?.trim()?.length
    ? connection.name
    : `@${connection.username}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full border border-border/50 bg-background/95 text-foreground shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
          emphasize && "border-primary/50 shadow-primary/20"
        )}
      >
        <CardContent className="flex h-full flex-col gap-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={displayName}
                image={connection.avatar ?? undefined}
                size="sm"
                linkTo={`/qwirl/${connection.username}`}
                ringed={false}
              />
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{connection.username}
                </p>
              </div>
            </div>
            {emphasize ? (
              <Badge
                variant="secondary"
                className="rounded-full bg-primary/10 text-xs font-medium text-primary"
              >
                Closest match
              </Badge>
            ) : null}
          </div>

          <WavelengthIndicator
            wavelength={connection.wavelength_score}
            variant="compact-horizontal"
            userName={connection.username}
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Signals from primary Qwirls</span>
            <Link
              href={`/qwirl/${connection.username}`}
              className="inline-flex items-center gap-1 font-medium text-primary transition hover:text-primary/80"
            >
              View Qwirl
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
};

const PotentialConnectionCard = ({ index }: { index: number }) => {
  const prompts = [
    "Invite a friend to answer your Qwirl",
    "Respond to someone new from Discover",
    "Drop your link in a group chat",
  ];

  return (
    <Card className="h-full border border-dashed border-border/50 bg-muted/20">
      <CardContent className="flex h-full flex-col items-start gap-3 p-5">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <ArrowUpRight className="h-4 w-4" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          Your next wavelength
        </p>
        <p className="text-sm text-muted-foreground">
          {prompts[index % prompts.length]}. Keep the momentum going to make
          this card disappear.
        </p>
        <Button
          asChild
          size="sm"
          className="mt-auto rounded-full px-4 py-1 text-xs"
        >
          <Link href="/discover">Find someone new</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const WavelengthListSkeleton = () => {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="border border-border/50 bg-background/80"
          >
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-full" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

interface WavelengthErrorStateProps {
  onRetry: () => void;
  message?: string;
}

const WavelengthErrorState = ({
  onRetry,
  message,
}: WavelengthErrorStateProps) => {
  return (
    <Card className="border border-destructive/40 bg-destructive/10">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="text-base font-semibold text-destructive">
          Something disrupted the signal
        </CardTitle>
        <p className="text-sm text-destructive/80">{message}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onRetry}
            icon={RefreshCcw}
            iconPlacement="left"
          >
            Try again
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

const WavelengthEmptyState = () => {
  return (
    <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-muted/30 via-background to-background">
      <CardContent className="flex flex-col gap-5 p-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            You haven’t synced with anyone yet
          </h2>
          <p>
            Answer a friend’s Qwirl or share yours. Once both of you trade
            answers, we’ll start tracking your wavelength automatically and
            surface it here.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              size="sm"
              className="rounded-full px-4 py-1"
              icon={UsersIcon}
              iconPlacement="left"
            >
              <Link href="/discover">Browse people</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-full px-4 py-1"
              icon={Sparkles}
              iconPlacement="left"
            >
              <Link href="/qwirls/primary/edit">Polish my Qwirl</Link>
            </Button>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-2xl border border-dashed border-border/40 bg-background/70 p-6 sm:block">
          <div className="absolute -right-6 top-6 h-16 w-16 rounded-full bg-primary/20 blur-2xl" />
          <p className="relative z-10 text-sm text-muted-foreground">
            Tip: Secondary Qwirls add more color to your wavelength. Answer new
            Qwirls together to push scores higher.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const GrowthPlaybook = () => {
  const items = [
    {
      title: "Answer community Qwirls",
      description:
        "Jump into Discover and respond to Qwirls from people you don’t know yet. If they reply to yours, you both get a wavelength boost.",
      icon: Compass,
    },
    {
      title: "Create a secondary Qwirl",
      description:
        "Spin up themed Qwirls for hobbies, trips, or group chats. Shared answers there stack onto the primary wavelength.",
      icon: Sparkles,
    },
    {
      title: "Share your link often",
      description:
        "Drop your Qwirl link in bios, chats, or meeting follow-ups. Every new response is a chance to sync with someone else.",
      icon: UsersIcon,
    },
  ];

  return (
    <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Keep growing your wavelength map
          </h3>
          <p className="text-sm text-muted-foreground">
            Secondary Qwirls, shared prompts, and quick invites all help your
            wavelength stay active. Try a couple of these moves this week.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <Card
            key={item.title}
            className="border border-border/40 bg-muted/20"
          >
            <CardContent className="flex h-full flex-col gap-3 p-5">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground flex-1">
                {item.description}
              </p>
              <span className="text-xs font-medium text-primary/70">
                Play {index + 1}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default WavelengthsPage;
