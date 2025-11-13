"use client";
import React, { useState, useRef, useCallback } from "react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import QwirlCover, { QwirlCoverSkeleton } from "@/components/qwirl/qwirl-cover";
import Link from "next/link";
import { authStore } from "@/stores/useAuthStore";
import { AdaptiveLayout } from "@/components/layout/adaptive-layout";
import clsx from "clsx";

type QwirlCommunityResponse = components["schemas"]["QwirlCommunityResponse"];

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("recent");
  const [selectedType, setSelectedType] = useState("all");

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/qwirl/community",
      {
        params: {
          query: {
            search: searchQuery || undefined,
            sort_by: selectedSort,
            qwirl_type: selectedType === "all" ? undefined : selectedType,
            limit: 12,
            page: 1,
            preview_items: 2,
          },
        },
      },
      {
        initialPageParam: 1,
        pageParamName: "page",
        getNextPageParam: (lastPage: QwirlCommunityResponse) => {
          return lastPage.has_more ? lastPage.page + 1 : undefined;
        },
      }
    );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastQwirlElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const qwirls = data?.pages.flatMap((page) => page.qwirls) ?? [];
  const { isAuthenticated } = authStore();

  return (
    <AdaptiveLayout>
      <div
        className={clsx("px-4 sm:px-6 lg:px-8 pb-8  ", {
          "pt-16 sm:pt-32": !isAuthenticated,
        })}
      >
        {!isAuthenticated && (
          <header className="text-center mb-8 relative">
            <h1 className="text-4xl md:text-5xl font-permanentMarker text-primary">
              Discover Qwirls
            </h1>
            <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
              Explore fascinating qwirls from people around the world. Find your
              wavelength with others.
            </p>
          </header>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <InputGroup className="flex-1 bg-input">
              <InputGroupAddon>
                <Search className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search qwirls, creators, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <div className="flex gap-2">
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PROFILE">Profile</SelectItem>
                  <SelectItem value="CUSTOM_PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                isAuthenticated ? "lg:grid-cols-3" : "lg:grid-cols-3"
              } gap-6 auto-rows-fr`}
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <QwirlCoverSkeleton key={index} />
              ))}
            </div>
          ) : qwirls.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                isAuthenticated ? "lg:grid-cols-3" : "lg:grid-cols-3"
              } gap-6 auto-rows-fr`}
            >
              {qwirls.map((qwirl, index) => {
                const isLast = index === qwirls.length - 1;
                return (
                  <motion.div
                    key={qwirl.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group flex h-full"
                  >
                    <Link
                      href={`/qwirl/${qwirl.user?.username}`}
                      className="flex w-full h-full"
                    >
                      <QwirlCover
                        ref={isLast ? lastQwirlElementRef : null}
                        qwirlCoverData={{
                          ...qwirl?.cover,
                          totalPolls: qwirl.item_count,
                        }}
                        showTotalPolls
                        user={{
                          name: qwirl.user?.name,
                          username: qwirl.user?.username ?? "",
                          avatar: qwirl.user?.avatar,
                          categories: qwirl.user?.categories || [],
                        }}
                        answeringStatus={
                          qwirl?.session?.status === "in_progress"
                            ? "in_progress"
                            : qwirl?.session?.status === "completed"
                            ? "completed"
                            : undefined
                        }
                        className="h-full"
                        variant={"visitor"}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No qwirls found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to discover more qwirls.
              </p>
            </motion.div>
          )}

          {/* Loading indicator for infinite scroll */}
          {isFetchingNextPage && (
            <div
              className={`mt-8 grid grid-cols-1 sm:grid-cols-2 ${
                isAuthenticated ? "lg:grid-cols-2" : "lg:grid-cols-3"
              } gap-6`}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <QwirlCoverSkeleton key={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AdaptiveLayout>
  );
};

export default CommunityPage;
