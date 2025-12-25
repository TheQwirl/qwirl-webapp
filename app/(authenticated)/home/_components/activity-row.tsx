"use client";

import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  RefreshCcw,
  Activity,
  UserCheck2,
  Infinity,
} from "lucide-react";

import WavelengthIndicator from "@/components/wavelength-indicator";
import { UserAvatar } from "@/components/user-avatar";
import type { ActivityResponse } from "./types";
import { authStore } from "@/stores/useAuthStore";

type SessionMetadata = {
  session_id?: number;
  wavelength?: number;
};

type Props = {
  activity: ActivityResponse;
};

type TypeVariant = {
  tag: string;
  border: string;
  background: string;
  accent: string;
  chip: string;
  iconBg: string;
  icon: LucideIcon;
};

type ActionVariant = "primary" | "secondary" | "ghost";

type ActionButtonConfig = {
  id: string;
  label: string;
  href?: string;
  variant: ActionVariant;
  ariaLabel?: string;
  dataResponderId?: number;
  withIcon?: boolean;
};

const COMPLETION_TYPES: ActivityResponse["type"][] = [
  "QWIRL_COMPLETED_BY_OTHER",
  "QWIRL_COMPLETED_BY_ME",
  "QWIRL_MUTUAL_COMPLETION",
];

const DEFAULT_VARIANT: TypeVariant = {
  tag: "Qwirl Activity",
  border: "border-border/40",
  background: "bg-background/80",
  accent: "text-foreground",
  chip: "border-border/40 bg-muted/30 text-muted-foreground",
  iconBg: "bg-muted text-muted-foreground",
  icon: Activity,
};

const TYPE_VARIANTS: Record<ActivityResponse["type"], TypeVariant> = {
  QWIRL_COMPLETED_BY_OTHER: {
    tag: "They Reached Out",
    border: "border-primary/40",
    background: "bg-primary/10",
    accent: "text-primary",
    chip: "border-primary/30 bg-primary/20 text-primary",
    iconBg: "bg-primary/15 text-primary",
    icon: Activity,
  },
  QWIRL_COMPLETED_BY_ME: {
    tag: "You reached out",
    border: "border-secondary/40",
    background: "bg-secondary/15",
    accent: "text-secondary-foreground",
    chip: "border-secondary/40 bg-secondary/25 text-secondary-foreground",
    iconBg: "bg-secondary/20 text-secondary-foreground",
    icon: UserCheck2,
  },
  QWIRL_UPDATED_BY_OTHER: {
    tag: "Updated",
    border: "border-accent/40",
    background: "bg-accent/20",
    accent: "text-accent-foreground",
    chip: "border-accent/40 bg-accent/30 text-accent-foreground",
    iconBg: "bg-accent/30 text-accent-foreground",
    icon: RefreshCcw,
  },
  QWIRL_MUTUAL_COMPLETION: {
    tag: "In Sync",
    border: "border-sidebar-primary/40",
    background: "bg-sidebar-primary/10",
    accent: "text-sidebar-primary",
    chip: "border-sidebar-primary/40 bg-sidebar-primary/15 text-sidebar-primary",
    iconBg: "bg-sidebar-primary/20 text-sidebar-primary",
    icon: Infinity,
  },
};

const ACTION_VARIANT_STYLES: Record<ActionVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm border border-transparent hover:bg-primary/90",
  secondary:
    "border border-border/50 bg-background text-foreground hover:border-foreground/40",
  ghost:
    "border border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/60",
};

const ActionLinkButton = ({ config }: { config: ActionButtonConfig }) => {
  if (!config.href) {
    return null;
  }

  return (
    <Link
      prefetch={false}
      href={config.href}
      aria-label={config.ariaLabel ?? config.label}
      data-responder-id={config.dataResponderId}
      className={clsx(
        "inline-flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto",
        ACTION_VARIANT_STYLES[config.variant]
      )}
    >
      <span>{config.label}</span>
      {config.withIcon !== false && <ArrowRight className="h-3.5 w-3.5" />}
    </Link>
  );
};

const buildActionButtons = (
  activity: ActivityResponse,
  actor: ActivityResponse["actor"],
  sessionMeta?: SessionMetadata
): ActionButtonConfig[] => {
  const buttons: ActionButtonConfig[] = [];
  const qwirlHref = actor?.username ? `/${actor.username}` : undefined;
  const responderAnswersHref = actor?.id
    ? `/qwirls/primary/responses?responder=${actor.id}`
    : undefined;

  switch (activity.type) {
    case "QWIRL_COMPLETED_BY_OTHER":
      buttons.push(
        {
          id: "answer-qwirl",
          label: "Answer their Qwirl",
          href: qwirlHref,
          variant: "primary",
        },
        {
          id: "view-responses",
          label: "View responder's answers",
          href: responderAnswersHref,
          variant: "secondary",
          dataResponderId: sessionMeta?.session_id ?? actor?.id,
        }
      );
      break;
    case "QWIRL_COMPLETED_BY_ME":
      buttons.push({
        id: "view-your-answers",
        label: "View your answers",
        href: qwirlHref,
        variant: "primary",
      });
      break;
    case "QWIRL_UPDATED_BY_OTHER":
      buttons.push({
        id: "answer-update",
        label: "Answer updated Qwirl",
        href: qwirlHref,
        variant: "primary",
      });
      break;
    case "QWIRL_MUTUAL_COMPLETION":
      buttons.push(
        {
          id: "compare-answers",
          label: "View answers",
          href: responderAnswersHref,
          variant: "primary",
          dataResponderId: sessionMeta?.session_id ?? actor?.id,
        },
        {
          id: "visit-qwirl",
          label: "Visit their Qwirl",
          href: qwirlHref,
          variant: "secondary",
        }
      );
      break;
    default:
      break;
  }

  return buttons.filter((btn) => Boolean(btn.href));
};

export default function ActivityRow({ activity }: Props) {
  const { user } = authStore();
  const actor = activity.actor;
  const sessionMeta = (activity.extra_data ?? undefined) as
    | SessionMetadata
    | undefined;
  const actorDisplay = activity.actor?.name?.split(" ")?.[0] || actor?.username;

  let headline = `${actorDisplay} interacted with your Qwirl`;
  let subline = actor?.username ? `@${actor.username}` : undefined;

  if (activity.type === "QWIRL_COMPLETED_BY_OTHER") {
    headline = `${actorDisplay} completed your Qwirl`;
    subline = `Tap to see how in-sync you are`;
  } else if (activity.type === "QWIRL_COMPLETED_BY_ME") {
    headline = `You answered ${actor?.name?.split(" ")?.[0] ?? "user"}'s Qwirl`;
    subline = actor?.username ? `@${actor.username}` : subline;
  } else if (activity.type === "QWIRL_UPDATED_BY_OTHER") {
    headline = `${actorDisplay} refreshed their Qwirl`;
    subline = activity.subject?.title
      ? `“${activity.subject.title}” was updated`
      : `Answer to see what's new`;
  } else if (activity.type === "QWIRL_MUTUAL_COMPLETION") {
    headline = "Wavelengths in sync";
    subline = `${actorDisplay} and you completed each other's Qwirls`;
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
  const variant = TYPE_VARIANTS[activity.type] ?? DEFAULT_VARIANT;
  const VariantIcon = variant.icon;
  const showWavelength = COMPLETION_TYPES.includes(activity.type);
  const completionWavelength =
    sessionMeta?.wavelength ?? actor?.wavelength ?? undefined;
  const hasWavelength =
    showWavelength && typeof completionWavelength === "number";

  const actionButtons = buildActionButtons(activity, actor, sessionMeta);

  const renderAvatar = () => {
    if (activity.type === "QWIRL_UPDATED_BY_OTHER") {
      return (
        <UserAvatar
          name={actor?.name || "Responder"}
          image={actor?.avatar ?? undefined}
          size="sm"
          linkTo={actor?.username ? `/${actor.username}` : undefined}
        />
      );
    }

    const primaryIsUser = activity.type === "QWIRL_COMPLETED_BY_ME";

    return (
      <div className="flex min-w-[56px] items-center justify-center">
        <div
          className={clsx("relative rounded-full", {
            "order-1 z-20": !primaryIsUser,
            "order-2 -ml-3 z-10": primaryIsUser,
          })}
        >
          <UserAvatar
            name={actor?.name || "Responder"}
            image={actor?.avatar ?? undefined}
            size="sm"
            ringed
            className={clsx(!primaryIsUser ? "border-white" : "border-border")}
            linkTo={actor?.username ? `/${actor.username}` : undefined}
          />
        </div>
        <div
          className={clsx("relative -ml-3 rounded-full", {
            "order-1 z-20": primaryIsUser,
            "order-2 z-10": !primaryIsUser,
          })}
        >
          <UserAvatar
            name={user?.name || "You"}
            image={user?.avatar ?? undefined}
            size="sm"
            ringed
            className={clsx(primaryIsUser ? "border-white" : "border-border")}
            linkTo={user?.username ? `/${user.username}` : undefined}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      role="article"
      className={clsx(
        "group rounded-2xl border shadow-sm transition-colors relative",
        variant.border,
        variant.background
      )}
    >
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span
              className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
                variant.chip
              )}
            >
              <VariantIcon className="h-3.5 w-3.5" />
              {variant.tag}
            </span>
            {timestamp && activity.created_at && (
              <time className=" block sm:hidden" dateTime={activity.created_at}>
                {timestamp}
              </time>
            )}
          </div>
          {hasWavelength && completionWavelength !== undefined && (
            <div className="pt-1">
              <WavelengthIndicator
                wavelength={completionWavelength}
                variant="badge"
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex flex-1 items-start gap-3">
            {renderAvatar()}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight text-foreground">
                {headline}
              </p>
              {subline && (
                <p className="text-xs text-muted-foreground">{subline}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {actionButtons.length > 0 && (
        <div className="border-t rounded-b-2xl bg-card text-card-foreground py-2 px-4 sm:px-6">
          <div className="sm:flex items-center justify-between">
            {timestamp && activity.created_at && (
              <time
                className="text-xs hidden sm:block"
                dateTime={activity.created_at}
              >
                {timestamp}
              </time>
            )}
            <div className=" flex items-center justify-center flex-wrap sm:justify-end gap-2">
              {actionButtons.map((button) => (
                <ActionLinkButton key={button.id} config={button} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
