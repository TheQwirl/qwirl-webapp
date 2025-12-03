import React, { forwardRef, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { cn, shareOrCopy } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import {
  Send,
  Eye,
  EyeOff,
  MessageCircleHeart,
  SquareArrowOutUpRight,
  ArrowRight,
  Telescope,
  Share2,
} from "lucide-react";
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
  noActions?: boolean;
  showCategories?: boolean;
  categoriesTagSize?: "sm" | "md";
  showTotalPolls?: boolean;
  showVisibility?: boolean;
  visibility?: boolean;
  answeringStatus?: "in_progress" | "completed" | undefined;
  isProfile?: boolean;
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
      noActions = false,
      showCategories = true,
      categoriesTagSize = "sm",
      showTotalPolls = false,
      showVisibility = false,
      visibility = false,
      answeringStatus,
      isProfile = false,
      ...rest
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const description = qwirlCoverData?.description || "";

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
          "bg-white shadow-lg rounded-lg text-center p-6 flex flex-col items-center max-w-2xl mx-auto h-full relative",
          isIncomplete && "opacity-90",
          rest.className
        )}
      >
        {/* Background Image */}
        <div
          className={cn(
            "relative w-full h-48 mb-6 mt-2 rounded-lg overflow-hidden",
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

          {(showTotalPolls && qwirlCoverData?.totalPolls !== undefined) ||
          (variant === "owner" && !isIncomplete) ? (
            <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3 text-gray-700 text-xs font-semibold">
              {showTotalPolls && qwirlCoverData?.totalPolls !== undefined && (
                <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex text-gray-500 items-center gap-1 border border-white/30 shadow-lg shadow-black/10">
                  <span className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-emerald-500/50" />
                  {qwirlCoverData.totalPolls} questions
                </div>
              )}
              {variant === "owner" && !isIncomplete && (
                <button
                  type="button"
                  onClick={() => {
                    shareOrCopy(
                      `${window.location.origin}/qwirl/${user?.username}`
                    );
                  }}
                  className="ml-auto bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/30 shadow-lg shadow-black/10 text-gray-500 hover:text-white hover:bg-white/30 transition-all"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              )}
            </div>
          ) : null}

          {/* Incomplete overlay text */}
          {isIncomplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500/60 tracking-wider uppercase">
                Incomplete
              </span>
            </div>
          )}
        </div>

        <div className={cn("-mt-16  z-10 relative")}>
          <UserAvatar
            image={user?.avatar ?? ""}
            size="xl"
            className="w-full h-full"
            ringed
            name={user?.name || user?.username || "User"}
          />
        </div>

        {isProfile ? (
          <h2 className="text-xl font-bold text-gray-900">
            {user?.name || user?.username}
          </h2>
        ) : (
          <h2 className="text-xl font-bold text-gray-900">
            {qwirlCoverData?.name || qwirlCoverData?.title}
          </h2>
        )}

        <p className="text-gray-600 text-xs">
          {!isProfile && "By"} @{user?.username || "user"}
        </p>

        {variant === "owner" && showVisibility && !isIncomplete && (
          <div className="flex items-center gap-2 z-20 mt-2">
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
          {displayDescription && (
            <div className="mt-2 max-w-md">
              <p className="text-gray-600 text-sm italic">
                {displayDescription}
              </p>
              {needsTruncation && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary hover:text-primary/80 text-sm font-medium mt-1 transition-colors"
                >
                  {isExpanded ? "Show less" : "Read more..."}
                </button>
              )}
            </div>
          )}

          {showCategories && user?.categories && user.categories.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
              {user.categories.slice(0, 3).map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="font-normal text-[10px] px-3 py-1 bg-gray-100"
                >
                  {cat}
                </Badge>
              ))}
              {user.categories.length > 3 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge
                      variant="outline"
                      className={clsx(
                        "font-normal cursor-pointer bg-gray-100 hover:bg-gray-200",
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
                          variant="outline"
                          className="font-normal text-[10px] px-3 py-1 bg-gray-100"
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
        {!noActions && (
          <div className="flex flex-col w-full items-center gap-3 mt-auto pt-6">
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
                        asChild
                        icon={ArrowRight}
                        iconPlacement="right"
                        className=""
                      >
                        Complete Qwirl
                      </Button>
                    </Link>
                  </>
                )}

                {isIncomplete && variant === "visitor" && (
                  <>
                    <p className="text-sm text-gray-500 font-medium">
                      This Qwirl is still in progress. Do you want to be
                      notified when it&apos;s complete?
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
                  <div className="flex flex-col gap-3 w-full">
                    <Link href="/qwirls/primary/responses">
                      <Button
                        // size="sm"
                        icon={MessageCircleHeart}
                        iconPlacement="left"
                        className="w-full"
                      >
                        Responses
                      </Button>
                    </Link>
                    {previewOrReview === "review" ? (
                      <Button
                        // size="sm"
                        variant="outline"
                        icon={Telescope}
                        iconPlacement="left"
                        className="w-full"
                        onClick={onReview}
                      >
                        Review Qwirl
                      </Button>
                    ) : (
                      <Link href={`/qwirl/${user?.username}`}>
                        <Button
                          icon={SquareArrowOutUpRight}
                          iconPlacement="left"
                          // size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Step 3: Qwirl is complete, user is guest */}
                {!isIncomplete && variant === "guest" && (
                  <Link href="/auth">
                    <Button className=" w-full">Sign In to Answer</Button>
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
                        className="w-full"
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
        )}
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
      <Skeleton className="h-12 w-full" />
    </CardContent>
  </Card>
);

QwirlCover.displayName = "QwirlCover";

export default QwirlCover;
