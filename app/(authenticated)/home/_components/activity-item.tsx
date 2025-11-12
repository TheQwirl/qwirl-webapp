"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { components } from "@/lib/api/v1-client-side";

interface ActivityItemProps {
  activity: components["schemas"]["ActivityResponse"];
}

// Type for metadata with session info
interface SessionMetadata {
  session_status?: "completed" | "in_progress" | "abandoned";
  wavelength?: number;
  session_id?: number;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const { type, actor, subject, extra_data } = activity;

  // Handle "user_answered_my_qwirl" - Someone answered my Qwirl
  if (type === "user_answered_my_qwirl") {
    const sessionMeta = (extra_data ?? {}) as SessionMetadata;
    const sessionStatus = sessionMeta.session_status;
    const wavelength = sessionMeta.wavelength;
    const sessionId = sessionMeta.session_id;

    const isCompleted = sessionStatus === "completed";
    const isInProgress = sessionStatus === "in_progress";

    return (
      <motion.div
        className={cn(
          "flex flex-col gap-3 p-3 rounded-lg transition-all overflow-hidden relative",
          "border bg-accent text-accent-foreground"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href={`/qwirls/primary/insights${
            sessionId ? `?responder=${sessionId}` : ""
          }`}
          className="absolute top-2 right-2 text-xs text-primary hover:underline whitespace-nowrap"
        >
          View Insights →
        </Link>

        {/* User Info Row */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center">
            <UserAvatar
              name={actor.name ?? actor.username}
              image={actor.avatar ?? undefined}
              size="md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-sm">{actor.name}</p>
              <p className="text-[10px] text-muted-foreground">
                @{actor.username}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isCompleted ? (
                <Badge variant="secondary" className="text-[10px]">
                  Answered your Qwirl
                </Badge>
              ) : isInProgress ? (
                <Badge variant="secondary" className="text-[10px]">
                  Is Answering your Qwirl
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Started your Qwirl
                </Badge>
              )}
              {isCompleted && wavelength !== undefined && (
                <WavelengthIndicator
                  wavelength={wavelength}
                  userName={actor.username}
                  variant="badge"
                />
              )}
            </div>
          </div>
        </div>

        {/* Action Button - Full Width */}
        {isCompleted && (
          <Link href={`/qwirl/${actor.username}`}>
            <Button
              size="sm"
              variant="outline"
              icon={ArrowRight}
              iconPlacement="right"
              className="w-full"
            >
              Answer their Qwirl
            </Button>
          </Link>
        )}
      </motion.div>
    );
  }

  // Handle "qwirl_answered" - I answered someone's Qwirl
  if (type === "qwirl_answered" && subject) {
    return (
      <motion.div
        className="flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden border bg-accent text-accent-foreground relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <UserAvatar name={subject.title} image={undefined} size="md" />
        <Link
          href={`/qwirl/${subject.title}`}
          className="absolute top-2 right-2 text-xs text-primary hover:underline whitespace-nowrap"
        >
          View Answers →
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{subject.title}</p>
          <Badge className="text-[10px]" variant="secondary">
            You Answered
          </Badge>
        </div>
      </motion.div>
    );
  }

  // Fallback for unknown activity types
  return null;
}
