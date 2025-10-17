"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { components } from "@/lib/api/v1-client-side";
import { cn } from "@/lib/utils";
import { Check, Plus, Tag } from "lucide-react";
import React from "react";
import {
  useQwirlSelection,
  useQwirlSelectionForm,
} from "@/contexts/qwirl-selection-context";
import PollOption from "@/components/qwirl/poll-option";

type Question = components["schemas"]["QuestionSearchResponse"];

interface QuestionCardProps {
  question: Question;
  onSelect?: (question: Question) => void;
  className?: string;
  showSelectButton?: boolean;
}

export const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  (
    { question, onSelect, className, showSelectButton = true, ...props },
    ref
  ) => {
    const {
      addQuestion,
      removeQuestion,
      isQuestionSelected,
      selectedCount,
      maxSelections,
    } = useQwirlSelection();
    const { getValues } = useQwirlSelectionForm();
    const questionIsSelected = isQuestionSelected(question.question_text);
    const canSelectMore = selectedCount < maxSelections;

    const handleSelect = () => {
      if (questionIsSelected) {
        // Find the index of the question to remove
        const currentPolls = getValues("polls");
        const indexToRemove = currentPolls.findIndex(
          (poll) => poll.question_text === question.question_text
        );
        if (indexToRemove !== -1) {
          removeQuestion(indexToRemove);
        }
        return;
      }

      if (canSelectMore) {
        addQuestion(question);
      }
    };

    // If onSelect is provided, use that instead of context logic
    const finalOnSelect =
      onSelect || (showSelectButton ? handleSelect : undefined);
    const isSelected = onSelect ? false : questionIsSelected;
    const canSelect = onSelect ? true : canSelectMore;

    return (
      <Card
        ref={ref}
        className={cn(
          "flex flex-col transition-all duration-200",
          isSelected && "ring-2 ring-primary/50 bg-primary/5",
          className
        )}
        {...props}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold leading-snug">
            {question.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <PollOption
                key={index}
                option={option}
                optionNumber={index + 1}
                variant="display"
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {question.tags?.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </div>
            ))}
          </div>
          {showSelectButton && finalOnSelect && (
            <Button
              onClick={() => finalOnSelect(question)}
              variant={isSelected ? "secondary" : "default"}
              className="w-full mt-2"
              size="sm"
              disabled={!isSelected && !canSelect}
              icon={isSelected ? Check : Plus}
              iconPlacement="left"
            >
              {isSelected ? (
                <>Selected</>
              ) : (
                <>{canSelect ? "Select Question" : "Limit Reached"}</>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
);

QuestionCard.displayName = "QuestionCard";

// Skeleton for loading state
export function QuestionCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col animate-pulse", className)}>
      <CardHeader>
        <div className="h-5 w-3/4 bg-muted rounded mb-2" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <PollOption
              key={i}
              option=""
              optionNumber={i + 1}
              variant="display"
              className="animate-pulse"
              style={{
                background: "var(--muted)",
                color: "transparent",
                minHeight: "2.5rem",
              }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-5 w-16 bg-muted rounded-full" />
          ))}
        </div>
        <div className="w-full mt-2 h-8 bg-muted rounded" />
      </CardFooter>
    </Card>
  );
}
