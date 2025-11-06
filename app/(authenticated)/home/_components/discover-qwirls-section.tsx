"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { components } from "@/lib/api/v1-client-side";

interface DiscoverQwirlsSectionProps {
  qwirls: components["schemas"]["QwirlCommunityResponse"]["qwirls"] | undefined;
  isLoading: boolean;
}

export function DiscoverQwirlsSection({
  qwirls,
  isLoading,
}: DiscoverQwirlsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg md:text-xl font-bold">
              Discover Qwirls
            </h3>
          </div>
          <Button
            icon={ArrowRight}
            iconPlacement="right"
            asChild
            variant="outline"
            size="sm"
            className="gap-2 w-full sm:w-auto"
          >
            <Link href="/discover">Explore</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <QwirlCoverSkeleton key={i} />
            ))}
          </div>
        ) : qwirls && qwirls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {qwirls.slice(0, 3).map((qwirl, index) => (
              <motion.div
                key={qwirl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/qwirl/${qwirl.user?.username}`} className="block">
                  <QwirlCover
                    showCategories={false}
                    qwirlCoverData={qwirl?.cover}
                    user={{
                      name: qwirl.user?.name,
                      username: qwirl.user?.username ?? "",
                      avatar: qwirl.user?.avatar,
                      categories: qwirl.user?.categories || [],
                    }}
                    className="h-full"
                    answeringStatus={
                      qwirl?.session?.status === "in_progress"
                        ? "in_progress"
                        : qwirl?.session?.status === "completed"
                        ? "completed"
                        : undefined
                    }
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No Qwirls available</EmptyTitle>
              <EmptyDescription>
                Check back soon for new Qwirls to discover!
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </motion.div>
  );
}
