import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import PollOption from "./poll-option";

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
  category?: string;
  tags?: string[];
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
      category,
      tags,
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={clsx("transition-shadow hover:shadow-md", className)}
      >
        <CardContent className="p-5 md:p-6">
          {category && (
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs font-medium">
                {category}
              </Badge>
            </div>
          )}

          <h3 className="text-lg font-semibold text-foreground mb-3">
            {question}
          </h3>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2 mb-4">
            {answers.map((answer, index) => (
              <PollOption
                key={index}
                option={answer}
                optionNumber={index + 1}
                variant="display"
              />
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
                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[8px] font-medium text-primary">
                      {creator.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs">{creator.username}</span>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  System-generated
                </div>
              )}
            </div>

            <div className="flex space-x-2">{customActions}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

// Assign a display name for better debugging experience
CompactQuestionCard.displayName = "CompactQuestionCard";
