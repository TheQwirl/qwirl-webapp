"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <Skeleton className="w-full h-2 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
