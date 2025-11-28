"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface ResponderLoadingSkeletonProps {
  index?: number;
}

export const ResponderLoadingSkeleton: React.FC<
  ResponderLoadingSkeletonProps
> = ({ index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="group relative w-full overflow-hidden border border-border/70 bg-card/95 shadow-sm">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        </div>
        <div className="relative flex flex-col gap-6 p-4 sm:p-5">
          <div className="flex gap-2 items-start justify-between">
            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-4 w-32 sm:h-5" />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="flex flex-col-reverse items-start gap-3 text-left sm:flex-col sm:items-end sm:text-right">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="sm:hidden absolute right-4 bottom-4 h-10 w-10 rounded-full" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
