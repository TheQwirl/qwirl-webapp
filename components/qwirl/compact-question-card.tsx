import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Repeat, Plus } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import { Card, CardContent } from "../ui/card";
import clsx from "clsx";

interface CompactQuestionCardProps {
  question: string;
  answers: string[];
  usageCount?: number;
  upvotes?: number;
  creator?: {
    username: string;
    avatarUrl?: string;
  };
  className?: string;
  customActions?: React.ReactNode;
}

export const CompactQuestionCard = React.forwardRef<
  HTMLDivElement,
  CompactQuestionCardProps
>(
  (
    {
      question,
      answers,
      usageCount,
      upvotes,
      creator,
      className,
      customActions,
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={clsx(
          "border-0 bg-white shadow-sm transition-shadow hover:shadow-md",
          className
        )}
      >
        <CardContent className="p-5 md:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {question}
          </h3>

          <div className="space-y-2 mb-4">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={clsx(
                  " bg-background flex items-center justify-between flex-wrap text-foreground w-full p-3 rounded-xl z-10 border text-left transition-all duration-200"
                )}
              >
                <span className="text-gray-900 font-medium">{answer}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              {usageCount && (
                <div className="flex items-center space-x-1">
                  <Repeat className="h-3 w-3" />
                  <span className="text-xs">{usageCount} uses</span>
                </div>
              )}
              {upvotes && (
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span className="text-xs">{upvotes} upvotes</span>
                </div>
              )}
              {creator ? (
                <div className="flex items-center space-x-2">
                  <UserAvatar
                    size="xs"
                    image={creator.avatarUrl}
                    name={creator.username}
                  />
                  <span className="text-xs">{creator.username}</span>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  System-generated
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {customActions ? (
                customActions
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Qwirl</span>
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Post Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

// Assign a display name for better debugging experience
CompactQuestionCard.displayName = "CompactQuestionCard";
