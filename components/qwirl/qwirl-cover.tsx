import React, { forwardRef, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { Send, Eye, EyeOff } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import clsx from "clsx";

interface QwirlCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  qwirlCoverData: {
    background_image?: string | null | undefined;
    title?: string | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    totalPolls?: number;
  };
  user: {
    name?: string | null;
    username: string;
    avatar?: string | null;
    categories?: string[];
  } | null;
  onButtonClick?: () => void;
  onNotifyMe?: () => void;
  onReview?: () => void;
  variant?: "guest" | "owner" | "visitor";
  isIncomplete?: boolean;
  answeredCount?: number;
  totalQwirlQuestions?: number;
  hasNewQuestions?: boolean;
  previewOrReview?: "preview" | "review";
  actions?: React.ReactNode;
  showCategories?: boolean;
  categoriesTagSize?: "sm" | "md";
  showTotalPolls?: boolean;
  showVisibility?: boolean;
  visibility?: boolean;
  answeringStatus?: "in_progress" | "completed" | undefined;
}

const QwirlCover = forwardRef<HTMLDivElement, QwirlCoverProps>(
  (
    {
      qwirlCoverData,
      user,
      onButtonClick,
      onNotifyMe,
      onReview,
      variant = "visitor",
      isIncomplete = false,
      answeredCount,
      totalQwirlQuestions,
      hasNewQuestions = false,
      previewOrReview = "preview",
      actions,
      showCategories = true,
      categoriesTagSize = "sm",
      showTotalPolls = false,
      showVisibility = false,
      visibility = false,
      answeringStatus,
      ...rest
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const description =
      qwirlCoverData?.description ||
      "Take this Qwirl to see how well you know me and find out what we have in common. Let's see if we're a match!";

    // Check if description exceeds approximately 3 lines (roughly 150 characters)
    const needsTruncation = description.length > 150;
    const displayDescription =
      needsTruncation && !isExpanded
        ? description.slice(0, 150) + "..."
        : description;

    return (
      <Card
        {...rest}
        ref={ref}
        className={cn(
          "bg-white shadow-lg rounded-lg text-center p-8 flex flex-col items-center max-w-2xl mx-auto h-full relative",
          isIncomplete && "opacity-90",
          rest.className
        )}
      >
        {/* Background Image */}
        <div
          className={cn(
            "relative w-full h-48 mb-6 rounded-lg overflow-hidden",
            isIncomplete && "border-4 border-dashed border-gray-400"
          )}
        >
          {qwirlCoverData?.background_image ? (
            <>
              <Image
                src={qwirlCoverData.background_image}
                alt="Qwirl Cover"
                fill
                className={cn(
                  "object-cover",
                  isIncomplete && "grayscale opacity-50"
                )}
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/20 to-primary/50",
                isIncomplete && "grayscale"
              )}
            />
          )}

          {/* Incomplete overlay text */}
          {isIncomplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500/60 tracking-wider uppercase">
                Incomplete
              </span>
            </div>
          )}
        </div>

        <div className={cn("-mt-16 mb-4 z-10 relative")}>
          <UserAvatar
            image={user?.avatar ?? ""}
            size="xl"
            className="w-full h-full"
            ringed
            name={user?.name || user?.username || "User"}
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          {qwirlCoverData?.name || qwirlCoverData?.title}
        </h2>

        <p className="text-gray-600 text-xs">By @{user?.username || "user"}</p>

        {variant === "owner" &&
          (showTotalPolls || showVisibility) &&
          !isIncomplete && (
            <div className="flex items-center gap-2 z-20 mt-2">
              {showTotalPolls && qwirlCoverData?.totalPolls !== undefined && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 flex items-center gap-1"
                >
                  {qwirlCoverData.totalPolls} polls
                </Badge>
              )}
              {showVisibility && (
                <div className="flex items-center gap-1.5 bg-secondary rounded-full text-secondary-foreground text-[10px] px-2 py-0.5">
                  {visibility ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  <span>{visibility ? "Visible" : "Hidden"}</span>
                </div>
              )}
            </div>
          )}

        <div className="flex-grow flex flex-col items-center">
          <div className="mt-4 max-w-md">
            <p className="text-gray-600">{displayDescription}</p>
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 text-sm font-medium mt-1 transition-colors"
              >
                {isExpanded ? "Show less" : "Read more..."}
              </button>
            )}
          </div>

          {showCategories && user?.categories && user.categories.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
              {user.categories.slice(0, 3).map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="font-normal text-xs px-3 py-1"
                >
                  {cat}
                </Badge>
              ))}
              {user.categories.length > 3 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge
                      variant="secondary"
                      className={clsx(
                        "font-normal cursor-pointer hover:bg-secondary/80",
                        {
                          "text-[10px] px-2 py-1": categoriesTagSize === "sm",
                          "text-xs px-3 py-1": categoriesTagSize === "md",
                        }
                      )}
                    >
                      +{user.categories.length - 3} more
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <div className="flex flex-wrap gap-2">
                      {user.categories.slice(3).map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="font-normal text-xs px-3 py-1"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-3 mt-auto pt-6">
          {actions ? (
            actions
          ) : (
            <>
              {/* Step 1: Qwirl is incomplete */}
              {isIncomplete && variant === "owner" && (
                <>
                  <p className="text-sm text-gray-500 font-medium">
                    Complete your Qwirl to start receiving responses
                  </p>
                  <Link href="/qwirls/primary/edit">
                    <Button
                      size="lg"
                      className="rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      Complete Qwirl
                    </Button>
                  </Link>
                </>
              )}

              {isIncomplete && variant === "visitor" && (
                <>
                  <p className="text-sm text-gray-500 font-medium">
                    This Qwirl is still in progress. Do you want to be notified
                    when it&apos;s complete?
                  </p>
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg hover:shadow-xl transition-all"
                    onClick={onNotifyMe}
                  >
                    Notify Me
                  </Button>
                </>
              )}

              {/* Step 2: Qwirl is complete and user is owner */}
              {!isIncomplete && variant === "owner" && (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {previewOrReview === "review" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                      onClick={onReview}
                    >
                      Review
                    </Button>
                  ) : (
                    <Link href={`/qwirl/${user?.username}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                      >
                        Preview
                      </Button>
                    </Link>
                  )}
                  <Link href="/qwirls/primary/insights">
                    <Button
                      size="sm"
                      className="rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      View Insights
                    </Button>
                  </Link>
                </div>
              )}

              {/* Step 3: Qwirl is complete, user is guest */}
              {!isIncomplete && variant === "guest" && (
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign In to Answer
                  </Button>
                </Link>
              )}

              {/* Step 4 & 5: Qwirl is complete, user is visitor (logged in) */}
              {!isIncomplete && variant === "visitor" && (
                <>
                  {/* Show progress info if user has started */}
                  {answeredCount !== undefined &&
                    totalQwirlQuestions !== undefined &&
                    answeredCount > 0 && (
                      <p className="text-sm text-gray-600 font-medium">
                        {hasNewQuestions ? (
                          <>
                            The Qwirl has been updated with new questions!
                            <br />
                            You&apos;ve answered {answeredCount} out of{" "}
                            {totalQwirlQuestions} questions
                          </>
                        ) : (
                          <>
                            You&apos;ve answered {answeredCount} out of{" "}
                            {totalQwirlQuestions} questions
                          </>
                        )}
                      </p>
                    )}

                  {
                    <Button
                      size="lg"
                      className="rounded-full shadow-lg hover:shadow-xl transition-all"
                      icon={Send}
                      iconPlacement="left"
                      onClick={onButtonClick}
                    >
                      {answeringStatus
                        ? answeringStatus === "completed"
                          ? "Review"
                          : "Continue Answering"
                        : "Start Answering"}
                    </Button>
                  }
                </>
              )}
            </>
          )}
        </div>
      </Card>
    );
  }
);

export const QwirlCoverSkeleton = ({ className }: { className?: string }) => (
  <Card className={cn(" overflow-hidden", className)}>
    <CardContent className="p-8 flex flex-col items-center text-center">
      {/* Background skeleton */}
      <Skeleton className="w-full h-48 rounded-lg mb-6" />

      {/* Avatar skeleton */}
      <Skeleton className="h-24 w-24 rounded-full -mt-16 mb-4" />

      {/* Title skeleton */}
      <Skeleton className="h-6 w-48 mb-2" />

      {/* Username skeleton */}
      <Skeleton className="h-3 w-32 mb-4" />

      {/* Description skeleton */}
      <div className="space-y-2 max-w-md w-full mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>

      {/* Categories skeleton */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-12 w-40 rounded-full" />
    </CardContent>
  </Card>
);

QwirlCover.displayName = "QwirlCover";

export default QwirlCover;
