"use client";
import React, { useCallback, useRef, useState } from "react";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { UserAvatar } from "../user-avatar";
import { MessageCircle, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface QwirlCommentsProps {
  item_id: number;
  qwirl_id: number;
}

type Comment = components["schemas"]["QwirlItemCommentBase"];
type CommentsResponsePage = components["schemas"]["QwirlItemCommentsResponse"];

// Loading skeleton for comments
const CommentSkeleton = () => (
  <div className="flex space-x-3 p-4">
    <Skeleton className="h-9 w-9 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

// Individual comment display
const CommentItem = ({ comment }: { comment: Comment }) => {
  const responder = comment.responder;

  const formatTimeAgo = (dateString: string | null | undefined) => {
    if (!dateString) return "a moment ago";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "a moment ago";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex space-x-3 p-4"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <UserAvatar
              image={responder?.avatar ?? ""}
              name={responder?.name ?? responder?.username ?? "User"}
              size="sm"
              className="flex-shrink-0 h-9 w-9"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{responder?.name ?? responder?.username ?? "User"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline space-x-2 mb-1">
          <span className="font-semibold text-sm text-foreground truncate">
            {responder?.name ?? responder?.username ?? "Anonymous"}
          </span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed break-words">
          {comment.comment}
        </p>
      </div>
    </motion.div>
  );
};

// Empty state when no comments
const EmptyCommentsState = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
    <MessageCircle className="h-12 w-12 text-muted-foreground/20 mb-4" />
    <p className="text-md font-semibold text-muted-foreground mb-1">
      The Sound of Silence
    </p>
    <p className="text-xs text-muted-foreground/80">
      Looks like you&apos;ve left them speechless. For now...
    </p>
  </div>
);

const QwirlComments: React.FC<QwirlCommentsProps> = ({ item_id, qwirl_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    $api.useInfiniteQuery(
      "get",
      "/qwirl-responses/qwirls/{qwirl_id}/items/{item_id}/comments",
      {
        params: {
          query: {
            limit: 10,
            skip: 0,
          },
          path: {
            item_id,
            qwirl_id,
          },
        },
      },
      {
        initialPageParam: 0,
        pageParamName: "skip",
        getNextPageParam: (
          lastPage: CommentsResponsePage,
          allPages: CommentsResponsePage[]
        ) => {
          if (!lastPage?.comments || lastPage.comments.length < 10)
            return undefined;
          const totalLoaded = allPages.reduce(
            (acc, page) => acc + (page.comments?.length || 0),
            0
          );
          return totalLoaded;
        },
      }
    );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCommentElementRef = useCallback(
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

  const comments = data?.pages.flatMap((page) => page.comments || []) ?? [];
  const totalComments = data?.pages[0]?.total_count ?? 0;

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl border px-4 py-3 bg-background/60 hover:bg-background transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-semibold">Comments</span>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {totalComments} {totalComments === 1 ? "comment" : "comments"}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-2 rounded-xl border">
          <ScrollArea className="max-h-64">
            {/* Loading state when content is expanded */}
            {isLoading ? (
              <div className="divide-y">
                <CommentSkeleton />
                <CommentSkeleton />
              </div>
            ) : comments.length === 0 ? (
              <EmptyCommentsState />
            ) : (
              <div className="divide-y">
                {comments.map((comment, index) => {
                  const isLast = index === comments.length - 1;
                  return (
                    <div
                      key={`${comment.id}-${index}`}
                      ref={isLast ? lastCommentElementRef : null}
                    >
                      <CommentItem comment={comment} />
                    </div>
                  );
                })}
                {isFetchingNextPage && <CommentSkeleton />}
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </section>
  );
};

export default QwirlComments;
