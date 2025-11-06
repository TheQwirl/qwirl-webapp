"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { components } from "@/lib/api/v1-client-side";

interface TopMatchesCardProps {
  users: components["schemas"]["WavelengthUserResponse"][] | undefined;
  totalCount: number;
  isLoading: boolean;
}

export function TopMatchesCard({
  users,
  totalCount,
  isLoading,
}: TopMatchesCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-base font-semibold">Top Matches</h3>
          <p className="text-sm text-muted-foreground">
            Users with the highest wavelength with you
          </p>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </>
          ) : users && totalCount > 0 ? (
            <>
              {users.slice(0, 3).map((wavelengthUser) => (
                <Link
                  key={wavelengthUser.id}
                  href={`/qwirl/${wavelengthUser.username}`}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center bg-accent text-accent-foreground border gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <UserAvatar
                      name={wavelengthUser.name ?? wavelengthUser.username}
                      image={wavelengthUser.avatar ?? undefined}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">
                        {wavelengthUser.name || wavelengthUser.username}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        @{wavelengthUser.username}
                      </p>
                    </div>
                    <WavelengthIndicator
                      wavelength={wavelengthUser.wavelength_score}
                      userName={wavelengthUser.username}
                      variant="badge"
                    />
                  </motion.div>
                </Link>
              ))}
              {totalCount > 3 && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                >
                  <Link href="/wavelengths">View All Matches</Link>
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <Zap className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No matches yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
