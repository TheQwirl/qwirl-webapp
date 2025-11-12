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
      <Card className="w-full">
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            {/* Left section */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
                  <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <Skeleton className="h-3 sm:h-4 w-28 sm:w-32" />
                  <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              <div className="flex flex-col items-center">
                <Skeleton className="h-8 sm:h-9 w-12 sm:w-16" />
                <Skeleton className="h-2 sm:h-3 w-16 sm:w-20 mt-1" />
              </div>
              <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
