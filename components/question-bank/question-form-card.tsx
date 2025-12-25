"use client";

import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompactQuestionCardEditable } from "@/components/qwirl/compact-question-card-editable";
import { cn } from "@/lib/utils";
import type { components } from "@/lib/api/v1-client-side";
import type { QwirlPollData } from "@/components/qwirl/schema";
import { QwirlPollSchema } from "@/components/qwirl/schema";
import { Check } from "lucide-react";
import { categoryMeta } from "@/constants/categories";

type Question = components["schemas"]["QuestionSearchResponse"];

export interface QuestionFormCardProps {
  question: Question;
  onAddPoll: (pollData: QwirlPollData) => Promise<void>;
}

export function QuestionFormCard({
  question,
  onAddPoll,
}: QuestionFormCardProps) {
  const questionCategory = question.category_name;
  const questionOwnerAnswerIndex =
    (
      question as {
        owner_answer_index?: number;
      }
    ).owner_answer_index ?? 0;

  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: question.question_text,
      options: question.options || [],
      owner_answer_index: questionOwnerAnswerIndex,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    clearErrors,
    setError,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = methods;

  const [hasJustAdded, setHasJustAdded] = useState(false);

  const onSubmit = handleSubmit(async (data: QwirlPollData) => {
    clearErrors("root");
    try {
      await onAddPoll(data);
      setHasJustAdded(true);
      reset({ ...data });
      window.setTimeout(() => setHasJustAdded(false), 3500);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to add poll. Please try again.";
      setError("root", {
        type: "server",
        message,
      });
      setHasJustAdded(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="space-y-2 rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            {questionCategory &&
              (() => {
                const metaEntry = Object.entries(categoryMeta).find(
                  ([key]) =>
                    key.toLowerCase() === questionCategory.toLowerCase()
                );
                if (!metaEntry) {
                  return (
                    <Badge className="text-[10px] font-normal">
                      {questionCategory}
                    </Badge>
                  );
                }

                const [label, meta] = metaEntry as [
                  string,
                  { bg: string; fg: string; icon: React.ElementType }
                ];
                const Icon = meta.icon;

                return (
                  <Badge
                    className="inline-flex items-center gap-2 text-[10px] font-normal"
                    style={{ backgroundColor: meta.bg, color: meta.fg }}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </Badge>
                );
              })()}
          </div>
          {hasJustAdded ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Check className="h-3.5 w-3.5" /> Added
            </div>
          ) : null}
        </div>

        <CompactQuestionCardEditable bare />

        {errors.root ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.root.message}
          </div>
        ) : null}

        <Button
          type="submit"
          className={cn(
            "w-full rounded-full text-sm font-semibold",
            hasJustAdded ? "bg-primary/90" : ""
          )}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting
            ? "Adding..."
            : hasJustAdded
            ? "Added to your Qwirl"
            : "Add to your Qwirl"}
        </Button>
      </form>
    </FormProvider>
  );
}
