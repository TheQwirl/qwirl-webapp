"use client";

import { useEffect } from "react";
import VerticalEditView from "@/components/qwirl/vertical-edit-view";
import { Button } from "@/components/ui/button";
import { QuestionStackCard } from "./question-stack-card";
import { usePrimaryQwirlEdit } from "./primary-qwirl-edit-context";

export const QuestionsStepSection = () => {
  const {
    lastLibraryAdd,
    setLastLibraryAdd,
    setShowAddDialog,
    setShowLibrary,
  } = usePrimaryQwirlEdit();

  useEffect(() => {
    if (!lastLibraryAdd) return;
    const timeout = window.setTimeout(() => setLastLibraryAdd(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [lastLibraryAdd, setLastLibraryAdd]);

  return (
    <section
      id="qwirl-questions"
      aria-labelledby="qwirl-questions-heading"
      className="space-y-6 p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="qwirl-questions-heading" className="text-xl font-semibold">
            Choose the questions that feel most like you
          </h2>
          <p className="text-sm text-muted-foreground">
            Mix grounding questions with a few surprises. Aim for 15 to unlock
            sharing.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="sticky top-0 z-30 space-y-3">
          <QuestionStackCard />
          {lastLibraryAdd ? (
            <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-primary">
              <div className="flex items-center gap-2">
                <span>
                  Added{" "}
                  <span className="font-semibold">
                    &quot;{lastLibraryAdd}&quot;
                  </span>{" "}
                  to your qwirl.
                </span>
              </div>
              <Button
                onClick={() => setLastLibraryAdd(null)}
                variant="ghost"
                size="sm"
                className="h-8 text-primary hover:text-primary"
              >
                Dismiss
              </Button>
            </div>
          ) : null}
        </div>
        <div id="qwirl-polls-container">
          <VerticalEditView
            onAddQuestion={() => setShowAddDialog(true)}
            onOpenLibrary={() => setShowLibrary(true)}
          />
        </div>
      </div>
    </section>
  );
};
