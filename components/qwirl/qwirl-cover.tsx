import React, { forwardRef } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";
import { Send } from "lucide-react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface QwirlCoverProps extends React.HTMLAttributes<HTMLDivElement> {
  qwirlCoverData: {
    background_image: string | null | undefined;
    title: string | null | undefined;
    description: string | null | undefined;
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
  hasExistingSession?: boolean;
  variant?: "guest" | "owner" | "visitor";
  isIncomplete?: boolean;
}

const QwirlCover = forwardRef<HTMLDivElement, QwirlCoverProps>(
  (
    {
      qwirlCoverData,
      user,
      onButtonClick,
      onNotifyMe,
      hasExistingSession = false,
      variant = "visitor",
      isIncomplete = false,
      ...rest
    },
    ref
  ) => {
    return (
      <Card
        {...rest}
        ref={ref}
        className={cn(
          "bg-white shadow-lg rounded-lg text-center p-8 flex flex-col items-center max-w-2xl mx-auto",
          rest.className
        )}
      >
        {/* Background Image */}
        <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
          {qwirlCoverData?.background_image ? (
            <>
              <Image
                src={qwirlCoverData.background_image}
                alt="Qwirl Cover"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/20 to-primary/50" />
          )}
        </div>

        {/* Avatar overlapping the background */}
        <div className="-mt-16 mb-4 z-10 relative">
          <UserAvatar
            image={user?.avatar ?? ""}
            size="xl"
            className="w-full h-full"
            ringed
            name={user?.name || user?.username || "User"}
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">
          {qwirlCoverData?.title || user?.username || ""}
        </h2>

        {/* Username */}
        <p className="text-gray-600 mt-2 text-xs">
          By @{user?.username || "user"}
        </p>

        {/* Description */}
        <p className="text-gray-600 mt-4 max-w-md">
          {isIncomplete
            ? `This Qwirl is still being created. Only ${
                qwirlCoverData?.totalPolls ?? 0
              } of 15 questions are ready. You'll be notified when it's complete!`
            : qwirlCoverData?.description ||
              "Take this Qwirl to see how well you know me and find out what we have in common. Let's see if we're a match!"}
        </p>

        {/* Categories */}
        {user?.categories && user.categories.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
            {user.categories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="font-normal text-xs px-3 py-1"
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-3 mt-6">
          {isIncomplete ? (
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={onNotifyMe}
            >
              Notify Me
            </Button>
          ) : variant === "guest" ? (
            <Link href="/auth">
              <Button
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Sign In
              </Button>
            </Link>
          ) : variant === "owner" ? (
            <Link href="/qwirls/primary/analytics">
              <Button
                size="lg"
                className="rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                See Results
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl transition-all"
              icon={Send}
              iconPlacement="left"
              onClick={onButtonClick}
            >
              {hasExistingSession ? "Continue" : "Answer"}
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

export const QwirlCoverSkeleton = () => (
  <Card className="max-w-2xl mx-auto overflow-hidden">
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
