"use client";

import React from "react";
import CollapsibleCard from "@/components/collapsible-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { authStore } from "@/stores/useAuthStore";
import $api from "@/lib/api/client";
import { Sparkles, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FALLBACK_DESCRIPTION =
  "Take this Qwirl to see how well you know me and find out what we have in common.";

const SidebarCoverPreviewCard = () => {
  const { user } = authStore();

  const qwirlCoverQuery = $api.useQuery(
    "get",
    "/qwirl/{qwirl_id}/cover",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    { enabled: !!user?.primary_qwirl_id }
  );

  const isLoading = qwirlCoverQuery.isLoading;
  const cover = qwirlCoverQuery.data;

  const title = cover?.name || cover?.title || "Untitled Qwirl";
  const description = cover?.description || FALLBACK_DESCRIPTION;
  const hasBackground = Boolean(cover?.background_image);
  const previewHref = user?.username ? `/qwirl/${user.username}` : undefined;

  return (
    <CollapsibleCard
      title={
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          Live cover preview
        </div>
      }
      defaultOpen
      isZeroPadding
      className="border shadow-sm"
    >
      <div className="space-y-4 p-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <>
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border",
                hasBackground
                  ? "bg-black text-white"
                  : "bg-gradient-to-br from-primary/10 via-background to-background"
              )}
            >
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0",
                  hasBackground && "opacity-70"
                )}
                style={
                  hasBackground
                    ? {
                        backgroundImage: `url(${cover?.background_image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="relative flex flex-col gap-3 p-5">
                <Badge
                  variant={hasBackground ? "secondary" : "outline"}
                  className={cn(
                    "w-fit rounded-full text-[11px]",
                    hasBackground && "bg-white/20 text-white"
                  )}
                >
                  {user?.name || user?.username}
                </Badge>
                <h3 className="text-base font-semibold leading-snug">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground text-balance">
                  {description}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Changes to your cover update instantly. Use this snapshot to
                gut-check tone and clarity as you edit.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {hasBackground ? "Custom artwork" : "Default gradient"}
                </Badge>
                {previewHref ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="xs"
                    className="ml-auto h-8 rounded-full text-[11px]"
                    icon={Eye}
                    iconPlacement="left"
                  >
                    <Link href={previewHref}>Open preview</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default SidebarCoverPreviewCard;
