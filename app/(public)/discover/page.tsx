"use client";
import React, { useState, useRef, useCallback } from "react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import { Input } from "@/components/ui/input";
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
  const { user } = authStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Discover Qwirls</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore fascinating qwirls from people around the world. Find your
            wavelength with others.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search qwirls, creators, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <QwirlCoverSkeleton key={index} />
              ))}
            </div>
          ) : qwirls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {qwirls.map((qwirl, index) => {
                const isLast = index === qwirls.length - 1;
                return (
                  <motion.div
                    key={qwirl.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group flex"
                  >
                    <Link
                      href={`/qwirl/${qwirl.user?.username}`}
                      className="flex w-full"
                    >
                      <QwirlCover
                        ref={isLast ? lastQwirlElementRef : null}
                        qwirlCoverData={{
                          background_image: qwirl.background_image,
                          description: qwirl.description,
                          title: qwirl.title,
                          totalPolls: qwirl.item_count,
                        }}
                        user={{
                          name: qwirl.user?.name,
                          username: qwirl.user?.username ?? "",
                          avatar: qwirl.user?.avatar,
                          categories: qwirl.user?.categories || [],
                        }}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                        variant={
                          qwirl.user_id === user?.id ? "owner" : undefined
                        }
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
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <QwirlCoverSkeleton key={index} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage;
