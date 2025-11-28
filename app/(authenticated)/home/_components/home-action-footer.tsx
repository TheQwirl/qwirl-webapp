"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, Compass, Users, Share2 } from "lucide-react";
import {
  Button,
  type ButtonProps,
  type ButtonIconProps,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  isIncomplete: boolean;
  hasRecentActivity: boolean;
  hasMatches: boolean;
  onShare: () => void;
  shareDisabled: boolean;
  username?: string;
}

export default function HomeActionFooter({
  isIncomplete,
  hasRecentActivity,
  hasMatches,
  onShare,
  shareDisabled,
  username,
}: Props) {
  type ActionElement = React.ReactElement<ButtonProps & ButtonIconProps>;
  const actions: ActionElement[] = [];
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
          <Link href="/connections">Find matches</Link>
        </Button>
      );
    }
  }

  if (actions.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-muted/40 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
      <div className="space-y-1">
        <p className="text-sm font-semibold">Next best steps</p>
        <p className="text-xs text-muted-foreground">
          Quick suggestions tailored to your current momentum.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {actions.map((action, index) => (
          <div key={index} className="w-full sm:w-auto">
            {React.cloneElement(action, {
              className: cn("w-full justify-center", action.props.className),
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
