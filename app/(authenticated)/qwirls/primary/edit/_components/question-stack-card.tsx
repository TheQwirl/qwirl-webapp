"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Library, PlusIcon, Shuffle } from "lucide-react";
import { usePrimaryQwirlEdit } from "./primary-qwirl-edit-context";

export const QuestionStackCard = () => {
  const {
    pollCountLabel,
    hasReachedTarget,
    remainingPolls,
    progressValue,
    setShowAddDialog,
    setShowLibrary,
    handleRandomizeQuestions,
    isShuffling,
    pollCount,
  } = usePrimaryQwirlEdit();

  return (
    <Card className="rounded-3xl border border-border/60 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Question stack
              </span>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {pollCountLabel}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground sm:text-base">
                {hasReachedTarget
                  ? "You're ready to share."
                  : "Build up your set."}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasReachedTarget
                  ? "Tidy the order or add more."
                  : `Add ${remainingPolls} more to unlock sharing.`}
              </p>
            </div>
            {progressValue < 100 && (
              <Progress value={progressValue} className="h-2" />
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <Button
              id="primary-add-question"
              onClick={() => setShowAddDialog(true)}
              className="h-11 w-full justify-center rounded-full text-sm font-semibold sm:w-auto sm:min-w-[200px]"
              icon={PlusIcon}
              iconPlacement="left"
            >
              Add Question
            </Button>
            <Button
              id="primary-add-from-library"
              onClick={() => setShowLibrary(true)}
              variant="outline"
              className="h-11 w-full justify-center rounded-full text-sm font-semibold sm:w-auto sm:min-w-[200px]"
              icon={Library}
              iconPlacement="left"
            >
              Add from Library
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t border-border/60 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <span className="text-[11px] font-medium text-muted-foreground">
          Want a quick remix?
        </span>
        <Button
          id="primary-shuffle-questions"
          onClick={handleRandomizeQuestions}
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-3 text-xs text-muted-foreground hover:text-primary"
          icon={Shuffle}
          iconPlacement="left"
          disabled={isShuffling || pollCount < 2}
          loading={isShuffling}
        >
          Shuffle order
        </Button>
      </CardFooter>
    </Card>
  );
};
