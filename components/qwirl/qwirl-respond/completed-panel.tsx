import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Qwirl } from "../types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSocialsDisplay from "../user-socials-display";

interface QwirlCompletionCardProps {
  data: Qwirl | undefined;
  newCount: number;
  wavelength: number;
  userName: string | null;
  userAvatar: string | null;
  username: string;
  userId: number;
  categories: string[];
  backgroundImage: string | null | undefined;
  onStartReview: () => void;
  onStartAnsweringNew: () => void;
}

const QwirlCompletionCard = ({
  data,
  newCount,
  wavelength,
  userName,
  userAvatar,
  username,
  userId,
  // categories,
  backgroundImage,
  onStartReview,
  onStartAnsweringNew,
}: QwirlCompletionCardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const answeredPolls =
    data?.items?.filter((item) => item.user_response?.selected_answer) ?? [];

  return (
    <Card
      className={cn(
        "bg-white shadow-lg rounded-lg text-center flex flex-col items-center max-w-2xl mx-auto h-full max-h-[90vh] overflow-hidden relative"
      )}
    >
      {/* Background Image */}
      <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
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

      <div className="-mt-12 mb-1 z-10 relative">
        <UserAvatar
          image={userAvatar ?? ""}
          size="xl"
          className="w-full h-full"
          ringed
          name={userName || username || "User"}
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900 px-8">
        {userName || username}
      </h2>

      <p className="text-gray-600  text-xs px-8">@{username}</p>

      {/* Categories
      {categories && categories.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2 mt-2">
          {categories.slice(0, 3).map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="font-normal text-xs px-3 py-1"
            >
              {cat}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="secondary"
                  className="font-normal text-xs px-3 py-1 cursor-pointer hover:bg-secondary/80"
                >
                  +{categories.length - 3} more
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="flex flex-wrap gap-2">
                  {categories.slice(3).map((cat) => (
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
      )} */}
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="mx-8 mt-4">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="answers" className="flex-1">
            All Answers
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent
          value="overview"
          className="flex-1 overflow-y-auto no-scrollbar px-8 pb-4 mt-4"
        >
          <div className="space-y-4">
            <UserSocialsDisplay userId={userId} variant="inline" />
            {/* Wavelength Section */}
            <WavelengthIndicator
              wavelength={wavelength}
              userName={userName ?? ""}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Answered</div>
                <div className="font-semibold text-lg">
                  {data?.answered_count ?? 0}
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Skipped</div>
                <div className="font-semibold text-lg">
                  {data?.skipped_count ?? 0}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* All Answers Tab */}
        <TabsContent
          value="answers"
          className="flex-1 overflow-y-auto px-8 pb-4 mt-4"
        >
          {answeredPolls.length > 0 ? (
            <div className="space-y-3">
              {answeredPolls.map((poll, index) => (
                <div
                  key={poll.id}
                  className="border rounded-lg p-3 bg-muted/20 space-y-2 text-left"
                >
                  {/* Question */}
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      Q{index + 1}
                    </Badge>
                    <h4 className="font-semibold text-xs line-clamp-2">
                      {poll.question_text}
                    </h4>
                  </div>

                  {/* Options with comparison */}
                  <div className="space-y-1.5">
                    {poll.options.map((option, optIndex) => {
                      const isUserAnswer =
                        poll.user_response?.selected_answer === option;
                      const isOwnerAnswer = poll.owner_answer === option;
                      const showBothBadge = isUserAnswer && isOwnerAnswer;

                      return (
                        <div
                          key={optIndex}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md border text-xs transition-colors",
                            showBothBadge &&
                              "bg-primary/10 border-primary/40 font-medium",
                            isUserAnswer &&
                              !isOwnerAnswer &&
                              "bg-blue-50 border-blue-200",
                            isOwnerAnswer &&
                              !isUserAnswer &&
                              "bg-amber-50 border-amber-200"
                          )}
                        >
                          <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                            {optIndex + 1}
                          </div>
                          <span className="flex-1 text-xs truncate">
                            {option}
                          </span>
                          <div className="flex gap-1">
                            {showBothBadge ? (
                              <Badge
                                variant="default"
                                className="text-[10px] px-1.5 py-0 h-4"
                              >
                                🎯
                              </Badge>
                            ) : (
                              <>
                                {isUserAnswer && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 h-4"
                                  >
                                    You
                                  </Badge>
                                )}
                                {isOwnerAnswer && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4"
                                  >
                                    Them
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Comment if exists */}
                  {poll.user_response?.comment && (
                    <div className="bg-background/50 p-2 rounded-md border">
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Your comment:
                      </p>
                      <p className="text-xs italic line-clamp-2">
                        &quot;{poll.user_response.comment}&quot;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No answers yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 p-6 pt-4 border-t w-full">
        {newCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-xs text-amber-800 mb-2">
            <strong>{newCount}</strong> new question{newCount > 1 ? "s" : ""}{" "}
            added!
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onStartReview}
            variant="outline"
            size="sm"
            icon={Eye}
            iconPlacement="left"
            className="flex-1 rounded-full shadow-sm"
          >
            Review
          </Button>
          {newCount > 0 && (
            <Button
              onClick={onStartAnsweringNew}
              size="sm"
              className="flex-1 rounded-full shadow-sm"
            >
              Answer New
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QwirlCompletionCard;
