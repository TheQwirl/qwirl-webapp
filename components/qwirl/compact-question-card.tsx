import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Repeat, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../user-avatar";

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
      <div
        ref={ref} // Attach the forwarded ref to the main div
        className={cn(
          "rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
          className
        )}
      >
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {question}
        </h3>

        <div className="space-y-2 mb-4">
          {answers.map((answer, index) => (
            <div
              key={index}
              className="flex items-center text-secondary-foreground bg-secondary px-4 py-2 rounded-md"
            >
              {answer}
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
      </div>
    );
  }
);

// Assign a display name for better debugging experience
CompactQuestionCard.displayName = "CompactQuestionCard";
